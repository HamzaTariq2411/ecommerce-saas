import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser } from './auth.service';
import { success } from '@/utils/apiError';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(success(result, 'Account created successfully'));
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await loginUser(req.body);
    res.status(200).json(success(result, 'Logged in successfully'));
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json(success(req.user, 'Current user fetched'));
  } catch (err) {
    next(err);
  }
};