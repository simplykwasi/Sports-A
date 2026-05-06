import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db/client.js';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'unsafe-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';

class AuthService {
  async registerUser({ email, password, displayName }) {
    const hashed = await bcrypt.hash(password, 12);
    const result = await query(
      `insert into users (email, password_hash, display_name) values ($1, $2, $3) returning *`,
      [email.toLowerCase(), hashed, displayName || null]
    );
    return result.rows[0];
  }

  async validateCredentials(email, password) {
    const result = await query('select * from users where email = $1', [email.toLowerCase()]);
    const user = result.rows[0];
    if (!user) {
      throw new Error('Invalid email or password');
    }
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      throw new Error('Invalid email or password');
    }
    return user;
  }

  signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
  }
}

export default new AuthService();
