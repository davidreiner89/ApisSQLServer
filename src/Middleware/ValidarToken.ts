import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface RequestC extends Request {
  id?: number;
}

export const validarJWT = (
  req: RequestC,
  res: Response,
  next: NextFunction
) => {
  try {
    // Obtenemos el token del header
    const token = req.headers["x-token"] as string | undefined;

    // Verificamos si el token existe
    if (!token) {
      return res.status(401).json({
        message: "No hay token en la petición",
      });
    }

    // Verificamos el token y accedemos al id del usuario
    const decoded = jwt.verify(token, process.env.JWT_KEY || "12345Secret") as {
      id: number;
    };
    req.id = decoded.id;

    // Pasamos a la siguiente funcion
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Token no valido",
    });
  }
};
