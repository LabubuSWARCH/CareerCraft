import { query } from '../infra/db/postgres';
import bcrypt from 'bcrypt';
import { setSession, getSession, deleteSession } from '../infra/db/redis';
import { User } from '../model';
import { randomBytes, createHash } from 'crypto';

function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

function hashSessionToken(sessionIoken: string): string {
  return createHash('sha256').update(sessionIoken).digest('hex');
}

interface RegisterUserInput {
  username: string;
  password: string;
  full_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  profile_picture?: string;
}

export async function registerUser(data: RegisterUserInput): Promise<User> {
  const hash = await bcrypt.hash(data.password, 10);

  const res = await query(
    `INSERT INTO users(username, password, full_name, email, phone, address, profile_picture)
     VALUES($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, username, full_name, email, phone, address, profile_picture, created_at, updated_at`,
    [
      data.username,
      hash,
      data.full_name,
      data.email,
      data.phone,
      data.address,
      data.profile_picture,
    ],
  );

  return res.rows[0];
}

export async function loginUser(
  username: string,
  password: string,
): Promise<{ user: User; token: string }> {
  const res = await query('SELECT * FROM users WHERE username=$1', [username]);
  const user = res.rows[0];
  if (!user) throw new Error('User not found');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid password');

  const token = generateSessionToken();
  const hashedToken = hashSessionToken(token);
  await setSession(hashedToken, user.id);

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      address: user.address,
      profile_picture: user.profile_picture,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
    token,
  };
}

export async function validateSession(token: string): Promise<User | null> {
  const hashedToken = hashSessionToken(token);
  const userId = await getSession(hashedToken);
  if (!userId) return null;
  const res = await query(
    `SELECT id, username, email, full_name, phone, address, profile_picture, created_at, updated_at
     FROM users
     WHERE id=$1`,
    [userId],
  );
  return res.rows[0] || null;
}

export async function logoutSession(token: string) {
  await deleteSession(token);
}
