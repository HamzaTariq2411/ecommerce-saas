import { Request, Response, NextFunction } from 'express';
import { createConnectAccountLink, checkConnectStatus } from './connect.service';
import { success } from '@/utils/apiError';

export const startOnboarding = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await createConnectAccountLink(req.params.storeId as string, req.user!.id);
    res.status(200).json(success(result, 'Onboarding link created'));
  } catch (err) {
    next(err);
  }
};

export const getStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await checkConnectStatus(req.params.storeId as string);
    res.status(200).json(success(result, 'Connect status fetched'));
  } catch (err) {
    next(err);
  }
};