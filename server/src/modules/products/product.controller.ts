import { Request, Response, NextFunction } from 'express';
import {
  createProduct,
  listStoreProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from './product.service';
import { success } from '@/utils/apiError';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await createProduct(req.params.storeId as string, req.body);
    res.status(201).json(success(product, 'Product created'));
  } catch (err) {
    next(err);
  }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await listStoreProducts(req.params.storeId as string, req.query as any);
    res.status(200).json(success(result, 'Products fetched'));
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await getProductById(req.params.storeId as string, req.params.productId as string);
    res.status(200).json(success(product, 'Product fetched'));
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await updateProduct(
      req.params.storeId as string,
      req.params.productId as string,
      req.body
    );
    res.status(200).json(success(product, 'Product updated'));
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteProduct(req.params.storeId as string, req.params.productId as string);
    res.status(200).json(success(null, 'Product deleted'));
  } catch (err) {
    next(err);
  }
};