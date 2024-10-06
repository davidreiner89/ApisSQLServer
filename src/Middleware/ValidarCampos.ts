import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Almacenamos los errores
  const errors = validationResult(req);

  // Si hay errores creamos un objeto
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  // Si no hay errores
  next();
};
