import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../../config/database';
import { AppError } from '../../middlewares/errorHandler';
import config from 'src/config';

export class AuthService {
  static async login(username: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { username, isDeleted: false },
      include: { staff: true }
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
        staffId: user.staffId
      },
      // config.jwt.secret!,
      // { expiresIn: config.jwt.expires_in! }
      'your-super-secret-jwt-key-here',
      { expiresIn: '1d' }
    );
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        staffId: user.staffId,
        staff: user.staff
      }
    };
  }

  static async register(userData: {
    username: string;
    password: string;
    role: string;
    staffId?: number;
  }) {
    const existingUser = await prisma.user.findUnique({
      where: { username: userData.username }
    });

    if (existingUser) {
      throw new AppError('Username already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        username: userData.username,
        passwordHash: hashedPassword,
        role: userData.role,
        staffId: userData.staffId
      },
      include: { staff: true }
    });

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async getUserProfile(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId, isDeleted: false },
      include: { staff: true }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}