import { Request, Response } from "express";
import sql from "mssql";
import bcrypt from "bcrypt";
import { connectToDB } from "../Config/db";
import { generarJWT } from "../Helper/JWT";

interface RequestC extends Request {
  id?: number;
}

export const LoginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // conexion
    const pool = await connectToDB();

    // si no hay conexion
    if (!pool) {
      return res
        .status(500)
        .json({ message: "Error al conectar a la base de datos" });
    }

    // Verificamos correo y contraseña
    const result = await pool
      .request()
      .input("email_usuario", sql.VarChar, email)
      .query("SELECT * FROM usuarios WHERE email_usuario = @email_usuario");

    // Credenciales invalidad arreglo vacio
    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Credenciales invalidas" });
    }

    // Arreglo con los datos del usuario
    const usuario = result.recordset[0];
    // Desemcriptamos la contraseña
    const isMatch = await bcrypt.compare(password, usuario.clave_usuario);

    // Contraseña invalida
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Generamos el token
    const { token } = await generarJWT(usuario.id);

    // respuesta
    res.json({
      token: token,
      usuario: {
        dni: usuario.dni_usuario,
        colaborador: usuario.colaborador_usuario,
        brevete: usuario.brevete_usuario,
        telefono: usuario.telefono_usuario,
        email: usuario.email_usuario,
        area: usuario.area_usuario,
        cargo: usuario.cargo_usuario,
        conectado: usuario.conectado,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

export const RefreshToken = async (req: RequestC, res: Response) => {
  try {
    // Conexion a la base de datos
    const pool = await connectToDB();

    // Si no hay conexion
    if (!pool) {
      return res
        .status(500)
        .json({ message: "Error al conectar a la base de datos" });
    }

    // Recogemos el id de la request
    const id = req.id;

    if (!id) {
      return res
        .status(400)
        .json({ message: "ID del usuario no proporcionado" });
    }

    // Generamos el token
    const token = await generarJWT(id);

    // Obtenemos el usuario
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM dbo.usuarios WHERE id = @id");

    const usuario = result.recordset[0];

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Respuesta
    res.json({
      token,
      usuario: {
        dni: usuario.dni_usuario,
        colaborador: usuario.colaborador_usuario,
        brevete: usuario.brevete_usuario,
        telefono: usuario.telefono_usuario,
        email: usuario.email_usuario,
        area: usuario.area_usuario,
        cargo: usuario.cargo_usuario,
        conectado: usuario.conectado,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al refrescar token" });
  }
};
