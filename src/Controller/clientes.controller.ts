import { Request, Response } from "express";
import sql from "mssql";
import bcrypt from "bcrypt";
import { connectToDB } from "../Config/db";
import { Clientes } from "../Models/clientes.model";

// Funcion para obtener el ubigeo
export const getUbigeo = async (
  departamento: string,
  provincia: string,
  distrito: string
): Promise<string | null> => {
  try {
    // Conectar la base de datos
    const pool = await connectToDB();

    // Si no hay conexion
    if (!pool) {
      throw new Error("Error al conectar la Base de datos");
    }

    // Buscar el ubigeo que coincida con el departamento,provincia y distrito
    const result = await pool
      .request()
      .input("departamento", sql.NVarChar, departamento)
      .input("provincia", sql.NVarChar, provincia)
      .input("distrito", sql.NVarChar, distrito).query(`
      SELECT UBIGEO
      FROM dbo.ubigeo
      WHERE DEPARTAMENTO = @departamento
      AND PROVINCIA = @provincia
      AND DESTINO = @distrito
    `);

    // Si no hay resultados
    if (result.recordset.length > 0) {
      // Obtener el ubigeo
      return result.recordset[0].UBIGEO;
    } else {
      // Si no hay resultados
      return null;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createCliente = async (req: Request, res: Response) => {
  const {
    dni_cliente,
    razon_social_cliente,
    representante_cliente,
    clave_cliente,
    id_vendedor_usuario_cliente,
    limite_credito_cliente,
    alerta_credito_cliente,
    departamento,
    provincia,
    distrito,
    direccion_cliente,
    referencias_cliente,
    contacto_cliente,
    telefono_cliente,
    email_cliente,
    area_cliente,
    logo_cliente,
    id_creador_cliente,
    fecha_creado,
  }: Clientes = req.body;

  try {
    // Buscar el ubigeo que coincida con el departamento,provincia y distrito
    const ubigeo = await getUbigeo(departamento, provincia, distrito);

    // Si no hay ubigeo
    if (!ubigeo) {
      return res.status(400).json({ message: "No se encontró el ubigeo" });
    }

    // Si hay ubigeo nos conectamos a la BD
    const pool = await connectToDB();

    if (!pool) {
      return res
        .status(500)
        .json({ message: "Error al conectar a la base de datos" });
    }

    // Verificamos si el email existe
    const emailExist = await pool
      .request()
      .input("email_cliente", sql.VarChar(250), email_cliente)
      .query(`SELECT * FROM dbo.clientes WHERE email_cliente = @email_cliente`);

    if (emailExist.recordset.length > 0) {
      return res.status(400).json({ message: "El email ya existe" });
    }

    // Verificamos si el dni existe
    const dniExist = await pool
      .request()
      .input("dni_cliente", sql.VarChar(250), dni_cliente)
      .query(`SELECT * FROM dbo.clientes WHERE dni_cliente = @dni_cliente`);

    if (dniExist.recordset.length > 0) {
      return res.status(400).json({ message: "El DNI ya esta en uso" });
    }

    // Encriptamos la contraseña
    const salt = await bcrypt.genSalt();
    const claveEncriptada = await bcrypt.hash(clave_cliente, salt);

    // Insertamos los datos con el ubigeo
    await pool
      .request()
      .input("dni_cliente", sql.Char(11), dni_cliente)
      .input("razon_social_cliente", sql.VarChar(250), razon_social_cliente)
      .input("representante_cliente", sql.VarChar(250), representante_cliente)
      .input("clave_cliente", sql.VarChar(250), claveEncriptada)
      .input(
        "id_vendedor_usuario_cliente",
        sql.Int,
        id_vendedor_usuario_cliente
      )
      .input(
        "limite_credito_cliente",
        sql.Decimal(15, 4),
        limite_credito_cliente
      )
      .input(
        "alerta_credito_cliente",
        sql.Decimal(15, 4),
        alerta_credito_cliente
      )
      .input("ubigeo_cliente", sql.Int, ubigeo)
      .input("direccion_cliente", sql.VarChar(250), direccion_cliente)
      .input("referencias_cliente", sql.VarChar(250), referencias_cliente)
      .input("contacto_cliente", sql.VarChar(250), contacto_cliente)
      .input("telefono_cliente", sql.Char(9), telefono_cliente)
      .input("email_cliente", sql.VarChar(250), email_cliente)
      .input("area_cliente", sql.VarChar(250), area_cliente)
      .input("logo_cliente", sql.VarChar(250), logo_cliente)
      .input("id_creador_cliente", sql.Int, id_creador_cliente)
      .input("fecha_creado", sql.Date, fecha_creado).query(`
        INSERT INTO dbo.clientes (dni_cliente, razon_social_cliente, representante_cliente, clave_cliente, id_vendedor_usuario_cliente, limite_credito_cliente, alerta_credito_cliente, ubigeo_cliente, direccion_cliente, referencias_cliente, contacto_cliente, telefono_cliente, email_cliente, area_cliente, logo_cliente, id_creador_cliente, fecha_creado)
        VALUES (@dni_cliente, @razon_social_cliente, @representante_cliente, @clave_cliente, @id_vendedor_usuario_cliente, @limite_credito_cliente, @alerta_credito_cliente, @ubigeo_cliente, @direccion_cliente, @referencias_cliente, @contacto_cliente, @telefono_cliente, @email_cliente, @area_cliente, @logo_cliente, @id_creador_cliente, @fecha_creado)
      `);

    return res.status(201).json({ message: "Cliente creado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al insertar cliente" });
  }
};

export const listClientes = async (_req: Request, res: Response) => {
  try {
    // Conectarse a la base de datos
    const pool = await connectToDB();

    // si no hay conexion
    if (!pool) {
      return res
        .status(500)
        .json({ message: "Error al conectar a la base de datos" });
    }

    // Ejecutar la consulta
    const result = await pool.request().query(`
      SELECT 
          c.id,
          c.dni_cliente,
          c.razon_social_cliente,
          c.representante_cliente,
          c.clave_cliente,
          c.id_vendedor_usuario_cliente,
          c.limite_credito_cliente,
          c.alerta_credito_cliente,
          u.DEPARTAMENTO,
          u.PROVINCIA,
          u.DESTINO,
          c.direccion_cliente,
          c.referencias_cliente,
          c.contacto_cliente,
          c.telefono_cliente,
          c.email_cliente,
          c.area_cliente,
          c.logo_cliente,
          c.id_creador_cliente,
          c.fecha_creado
      FROM 
          dbo.clientes c
      JOIN 
          dbo.ubigeo u ON c.ubigeo_cliente = u.UBIGEO
    `);

    // Listamos los clientes
    return res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al listar clientes" });
  }
};
