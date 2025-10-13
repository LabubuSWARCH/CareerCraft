import amqp from 'amqplib';
import { RABBITMQ_URL } from '../../config';

let channel: amqp.Channel | null = null;

export async function getRabbitChannel(): Promise<amqp.Channel> {
  if (channel) return channel;

  const conn = await amqp.connect(RABBITMQ_URL);
  channel = await conn.createChannel();
  await channel.assertQueue('send_email_queue', { durable: true });
  return channel;
}

export async function publishEmail(to: string, subject: string, body: string) {
  const ch = await getRabbitChannel();
  const payload = JSON.stringify({ to, subject, body });
  await ch.sendToQueue('send_email_queue', Buffer.from(payload), { persistent: true });
}
