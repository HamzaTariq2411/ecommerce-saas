import { Request, Response, NextFunction } from 'express';
import { createStore, getStoreBySlug, getStoreById, updateStore, listAllStores } from './store.service';
import { success } from '@/utils/apiError';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const store = await createStore(req.user!.id, req.body);
    res.status(201).json(success(store, 'Store created successfully'));
  } catch (err) {
    next(err);
  }
};

export const getBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const store = await getStoreBySlug(req.params.slug as string);
    res.status(200).json(success(store, 'Store fetched'));
  } catch (err) {
    next(err);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const store = await getStoreById(req.params.storeId as string);
    res.status(200).json(success(store, 'Store fetched'));
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const store = await updateStore(req.params.storeId as string, req.body);
    res.status(200).json(success(store, 'Store updated'));
  } catch (err) {
    next(err);
  }
};

export const listAll = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const stores = await listAllStores();
    res.status(200).json(success(stores, 'All stores fetched'));
  } catch (err) {
    next(err);
  }
};