import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../Controller/user.controller";
import { check } from "express-validator";
import { validateSchema } from "../Middleware/ValidarCampos";

const router = Router();

// Obtener usuarios
router.get("/listar", getUsers);

// Obtener un usuario
router.get("/listar/:id", getUser);

// Crear usuario
router.post(
  "/crear",
  [
    check("dni_usuario")
      .isLength({ min: 8, max: 8 })
      .withMessage("DNI debe tener exactamente 8 caracteres")
      .notEmpty()
      .withMessage("DNI es obligatorio"),
    check("clave_usuario")
      .isLength({ min: 8 })
      .withMessage("Clave debe tener minimo 8 caracteres")
      .notEmpty()
      .withMessage("Clave es obligatoria"),
    check("email_usuario").isEmail().withMessage("Email no es válido"),
    check("telefono_usuario")
      .isLength({ min: 9, max: 9 })
      .withMessage("Teléfono debe tener exactamente 9 caracteres"),
    check("colaborador_usuario")
      .notEmpty()
      .withMessage("Nombre es obligatorio"),
    check("brevete_usuario").notEmpty().withMessage("Brevete es obligatorio"),
    check("area_usuario").notEmpty().withMessage("Area es obligatorio"),
    check("cargo_usuario").notEmpty().withMessage("Cargo es obligatorio"),
    validateSchema,
  ],
  createUser
);

// Actualizar
router.put(
  "/actualizar/:id",
  [
    check("dni_usuario")
      .isLength({ min: 8 })
      .withMessage("DNI debe tener exactamente 8 caracteres")
      .notEmpty()
      .withMessage("DNI es obligatorio"),
    check("clave_usuario")
      .isLength({ min: 8 })
      .withMessage("Clave debe tener minimo 8 caracteres")
      .notEmpty()
      .withMessage("Clave es obligatoria"),
    check("email_usuario").isEmail().withMessage("Email no es válido"),
    check("telefono_usuario")
      .isLength({ min: 9, max: 9 })
      .withMessage("Teléfono debe tener exactamente 9 caracteres"),
    check("colaborador_usuario")
      .notEmpty()
      .withMessage("Nombre es obligatorio"),
    check("brevete_usuario").notEmpty().withMessage("Brevete es obligatorio"),
    check("area_usuario").notEmpty().withMessage("Area es obligatorio"),
    check("cargo_usuario").notEmpty().withMessage("Cargo es obligatorio"),
    validateSchema,
  ],
  updateUser
);

// Eliminar
router.delete("/eliminar/:id", deleteUser);

export default router;
