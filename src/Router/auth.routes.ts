import { Router } from "express";
import { check } from "express-validator";
import { validateSchema } from "../Middleware/ValidarCampos";
import { LoginUser, RefreshToken } from "../Controller/auth.controller";
import { validarJWT } from "../Middleware/ValidarToken";

const router = Router();

// Login
router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Email no es valido"),
    check("password")
      .isLength({ min: 8 })
      .withMessage("La contraseña debe tener minimo 8 caracteres"),
    validateSchema,
  ],
  LoginUser
);

// Renovar token
router.get("/renew", validarJWT, RefreshToken);

export default router;
