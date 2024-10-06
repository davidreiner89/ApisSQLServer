import { Request, Response } from "express";
import sql from "mssql";
import bcrypt from "bcrypt";
import { connectToDB } from "../Config/db";
import { Usuario } from "../Models/userModel";

// Listar usuarios
export const getUsers = async (res: Response) => {
  try {
    // conexion
    const pool = await connectToDB();

    // si no hay conexion
    if (!pool) {
      return res
        .status(500)
        .json({ message: "Error al conectar a la base de datos" });
    }

    // Listamos usuarios
    const result = await pool.request().query("SELECT * FROM dbo.usuarios");
    return res.json(result.recordset);
  } catch (error) {
    // Si no mostramos el error
    console.error(error);
    return res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// Listar un usuario
export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Conectar a la base de datos
    const pool = await connectToDB();

    // si no hay conexion
    if (!pool) {
      return res
        .status(500)
        .json({ message: "Error al conectar a la base de datos" });
    }

    // Ver si el usuario existe
    const result = await pool
      .request()
      .input("id", sql.Int, parseInt(id))
      .query("SELECT * FROM dbo.usuarios WHERE id = @id");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json(result.recordset[0]);
  } catch (error) {
    // Si no mostramos el error
    console.error(error);
    return res.status(500).json({ message: "Error al obtener usuario" });
  }
};

// Crear nuevo usuario
export const createUser = async (req: Request, res: Response) => {
  const {
    dni_usuario,
    clave_usuario,
    colaborador_usuario,
    brevete_usuario,
    telefono_usuario,
    email_usuario,
    area_usuario,
    cargo_usuario,
    id_creador_usuario,
    fecha_creado,
  }: Usuario = req.body;

  try {
    // conexion
    const pool = await connectToDB();

    // si no hay conexion
    if (!pool) {
      return res
        .status(500)
        .json({ message: "Error al conectar a la base de datos" });
    }

    // Verificamos si el email existe
    const emailExist = await pool
      .request()
      .input("email_usuario", sql.VarChar(250), email_usuario)
      .query(`SELECT * FROM dbo.usuarios WHERE email_usuario = @email_usuario`);

    if (emailExist.recordset.length > 0) {
      return res.status(400).json({ message: "El email ya existe" });
    }

    // Verificamos si el dni existe
    const dniExist = await pool
      .request()
      .input("dni_usuario", sql.VarChar(250), dni_usuario)
      .query(`SELECT * FROM dbo.usuarios WHERE dni_usuario = @dni_usuario`);

    if (dniExist.recordset.length > 0) {
      return res.status(400).json({ message: "El DNI ya esta en uso" });
    }

    // Encriptamos la contraseña
    const salt = await bcrypt.genSalt();
    const claveEncriptada = await bcrypt.hash(clave_usuario, salt);

    // si hay conexion que crear usuario
    await pool
      .request()
      .input("dni_usuario", sql.Char(11), dni_usuario)
      .input("clave_usuario", sql.VarChar(250), claveEncriptada)
      .input("colaborador_usuario", sql.VarChar(50), colaborador_usuario)
      .input("brevete_usuario", sql.VarChar(250), brevete_usuario)
      .input("telefono_usuario", sql.Char(9), telefono_usuario)
      .input("email_usuario", sql.VarChar(250), email_usuario)
      .input("area_usuario", sql.VarChar(250), area_usuario)
      .input("cargo_usuario", sql.VarChar(250), cargo_usuario)
      .input("id_creador_usuario", sql.Int, id_creador_usuario)
      .input("fecha_creado", sql.Date, fecha_creado)
      .query(`INSERT INTO dbo.usuarios (dni_usuario, clave_usuario, colaborador_usuario, brevete_usuario, telefono_usuario, email_usuario, area_usuario, cargo_usuario, id_creador_usuario, fecha_creado)
              VALUES (@dni_usuario, @clave_usuario, @colaborador_usuario, @brevete_usuario, @telefono_usuario, @email_usuario, @area_usuario, @cargo_usuario, @id_creador_usuario, @fecha_creado)`);

    // Creamos usuario
    return res.status(201).json({ message: "Usuario creado correctamente" });
  } catch (error) {
    // Si no mostramos el error
    console.error(error);
    return res.status(500).json({ error: "Error creando el usuario" });
  }
};

// Actualizar usuario
export const updateUser = async (req: Request, res: Response) => {
  // Id
  const { id } = req.params;

  const {
    dni_usuario,
    clave_usuario,
    colaborador_usuario,
    brevete_usuario,
    telefono_usuario,
    email_usuario,
    area_usuario,
    cargo_usuario,
    id_creador_usuario,
    fecha_creado,
  }: Usuario = req.body;

  try {
    // Conectar a la base de datos
    const pool = await connectToDB();

    // si no hay conexion
    if (!pool) {
      return res
        .status(500)
        .json({ error: "Error al conectar a la base de datos" });
    }

    // Verificar si el usuario con el id proporcionado existe
    const userExists = await pool
      .request()
      .input("id", sql.Int, parseInt(id))
      .query(`SELECT * FROM dbo.usuarios WHERE id = @id`);

    if (userExists.recordset.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificamos si el email existe
    const emailExist = await pool
      .request()
      .input("email_usuario", sql.VarChar(250), email_usuario)
      .query(`SELECT * FROM dbo.usuarios WHERE email_usuario = @email_usuario`);

    if (emailExist.recordset.length > 0) {
      return res.status(400).json({ message: "El email ya existe" });
    }

    // Verificamos si el dni existe
    const dniExist = await pool
      .request()
      .input("dni_usuario", sql.VarChar(250), dni_usuario)
      .query(`SELECT * FROM dbo.usuarios WHERE dni_usuario = @dni_usuario`);

    if (dniExist.recordset.length > 0) {
      return res.status(400).json({ message: "El DNI ya esta en uso" });
    }

    // Encriptamos la contraseña
    const salt = await bcrypt.genSalt();
    const claveEncriptada = await bcrypt.hash(clave_usuario, salt);

    await pool
      .request()
      .input("id", sql.Int, parseInt(id))
      .input("dni_usuario", sql.Char(11), dni_usuario)
      .input("clave_usuario", sql.VarChar(250), claveEncriptada)
      .input("colaborador_usuario", sql.VarChar(250), colaborador_usuario)
      .input("brevete_usuario", sql.VarChar(250), brevete_usuario)
      .input("telefono_usuario", sql.Char(9), telefono_usuario)
      .input("email_usuario", sql.VarChar(250), email_usuario)
      .input("area_usuario", sql.VarChar(250), area_usuario)
      .input("cargo_usuario", sql.VarChar(250), cargo_usuario)
      .input("id_creador_usuario", sql.Int, id_creador_usuario)
      .input("fecha_creado", sql.Date, fecha_creado).query(`UPDATE dbo.usuarios
              SET dni_usuario = @dni_usuario, clave_usuario = @clave_usuario, colaborador_usuario = @colaborador_usuario, brevete_usuario = @brevete_usuario, telefono_usuario = @telefono_usuario, email_usuario = @email_usuario, area_usuario = @area_usuario, cargo_usuario = @cargo_usuario, id_creador_usuario = @id_creador_usuario, fecha_creado = @fecha_creado
              WHERE id = @id`);

    // Actualizamos usuario
    return res.json({ message: "Usuario actualizado corectamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

// Eliminar usuario
export const deleteUser = async (req: Request, res: Response) => {
  // Id
  const { id } = req.params;

  try {
    // Conectar a la base de datos
    const pool = await connectToDB();

    // si no hay conexion
    if (!pool) {
      return res
        .status(500)
        .json({ message: "Error al conectar a la base de datos" });
    }

    // Si el id no existe
    // Verificar si el usuario con el id proporcionado existe
    const userExists = await pool
      .request()
      .input("id", sql.Int, parseInt(id))
      .query(`SELECT * FROM dbo.usuarios WHERE id = @id`);

    if (userExists.recordset.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Eliminamos
    await pool
      .request()
      .input("id", sql.Int, parseInt(id))
      .query("DELETE FROM dbo.usuarios WHERE id = @id");

    // Retornamos message
    return res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al eliminar usuario" });
  }
};
