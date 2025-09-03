import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../../middlewares/errorHandler';
import { sendError, sendSuccess } from '../../../utils/response';
import { AuthService } from './auth.service';
import { loginSchema, registerSchema } from './auth.validation';


export class AuthController {
  static login = asyncHandler(async (req: Request, res: Response) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return sendError(res, 'Validation error', error.details, 400);
    }

    const { username, password } = req.body;
    const result = await AuthService.login(username, password);

    return sendSuccess(res, result, 'Login successful', 200);
  });

  static register = asyncHandler(async (req: Request, res: Response) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return sendError(res, 'Validation error', error.details, 400);
    }

    const user = await AuthService.register(req.body);

    return sendSuccess(res, user, 'User registered successfully', 201);
  });

  static getProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = await AuthService.getUserProfile(req.user!.id);

    return sendSuccess(res, user, 'Profile retrieved successfully', 200);
  });
}