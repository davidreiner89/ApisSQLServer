import { Router } from "express";
import { createCliente, listClientes } from "../Controller/clientes.controller";
import { validateSchema } from "../Middleware/ValidarCampos";
import { check } from "express-validator";

const router = Router();

// Crear cliente
router.post(
  "/crear",
  [
    // Validar dni
    check("dni_cliente")
      .isLength({ min: 8, max: 8 })
      .withMessage("DNI debe tener exactamente 8 caracteres")
      .notEmpty()
      .withMessage("DNI es obligatorio"),

    // Validar que razon social no este vacio
    check("razon_social_cliente")
      .notEmpty()
      .withMessage("Razon social no puede estar vacio"),

    // Representante del cliente
    check("representante_cliente")
      .notEmpty()
      .withMessage("Representate del cliente no puede estar vacio"),

    // Clave cliente
    check("clave_cliente")
      .isLength({ min: 8, max: 8 })
      .withMessage("Clave debe tener exactamente 8 caracteres"),

    // Limite de credito decimal
    check("limite_credito_cliente")
      .isDecimal()
      .withMessage("Limite de credito debe ser un numero"),

    // Alerta credito cliente
    check("alerta_credito_cliente")
      .isDecimal()
      .withMessage("Alerta credito debe ser un numero"),

    // Departamento obligatorio
    check("departamento")
      .notEmpty()
      .withMessage("Departamento no puede estar vacio"),

    // Provincia obligatorio
    check("provincia").notEmpty().withMessage("Provincia no puede estar vacio"),

    // Distrito obligatorio
    check("distrito").notEmpty().withMessage("Distrito no puede estar vacio"),

    // direccion_cliente
    check("direccion_cliente")
      .isLength({ min: 10, max: 100 })
      .withMessage("Direccion debe tener entre 10 y 100 caracteres"),

    // referencias_cliente
    check("referencias_cliente")
      .isLength({ min: 10, max: 100 })
      .withMessage("Referencias debe tener entre 10 y 100 caracteres"),

    // contacto_cliente
    check("contacto_cliente")
      .isLength({ min: 5 })
      .withMessage("Contacto debe tener un minimo de 5 caracteres"),

    // telefono_cliente
    check("telefono_cliente")
      .isLength({ min: 9, max: 9 })
      .withMessage("Telefono debe tener exactamente 9 caracteres"),

    // email_cliente
    check("email_cliente").isEmail().withMessage("Email no es valido"),

    // area_cliente
    check("area_cliente").notEmpty().withMessage("Area no puede estar vacio"),

    validateSchema,
  ],
  createCliente
);

// Listar clientes
router.get("/listar", listClientes);

export default router;
