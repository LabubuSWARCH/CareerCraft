import amqp from 'amqplib';
import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://user:pass@localhost:5672';
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const EMAIL_MODE = process.env.EMAIL_MODE || 'DEBUG'; // DEBUG | SENDGRID
const FROM_EMAIL = process.env.FROM_EMAIL || 'no-reply@example.com';

async function start() {
  const conn = await amqp.connect(RABBITMQ_URL);
  const channel = await conn.createChannel();

  await channel.assertQueue('send_email_queue', { durable: true });

  console.log('📬 Notification service waiting for messages...');

  channel.consume('send_email_queue', async (msg) => {
    if (!msg) return;

    try {
      const { to, subject, body } = JSON.parse(msg.content.toString());
      await handleEmail(to, subject, body);
      channel.ack(msg);
    } catch (err) {
      console.error('❌ Failed to process message:', err);
      channel.nack(msg, false, false); // discard message on failure
    }
  });
}

async function handleEmail(to: string, subject: string, body: string) {
  if (EMAIL_MODE === 'DEBUG') {
    console.log('📧 [DEBUG MODE]');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${body}`);
    return;
  }

  if (EMAIL_MODE === 'SENDGRID') {
    if (!SENDGRID_API_KEY) {
      console.error('❌ Missing SENDGRID_API_KEY in environment');
      return;
    }

    sgMail.setApiKey(SENDGRID_API_KEY);
    const msg = {
      to,
      from: FROM_EMAIL,
      subject,
      text: body,
      html: `<pre>${body}</pre>`,
    };

    await sgMail.send(msg);
    console.log(`✅ Email sent to ${to}`);
  }
}

start().catch((err) => {
  console.error('❌ Notification service failed to start:', err);
  process.exit(1);
});
