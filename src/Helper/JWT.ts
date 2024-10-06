import jwt, { JwtPayload } from "jsonwebtoken";

type TokenResponse = {
  token: string;
};

// Generamos un token por el id del usuario autenticado
export const generarJWT = (id: number): Promise<TokenResponse> => {
  // Creamos un payload con el id
  const payload = { id };

  // Retornamos una promesa
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_KEY || "12345Secret",
      { expiresIn: "15m" },
      (err, token) => {
        if (err) {
          return reject(err);
        }
        if (!token) {
          return reject(new Error("No se pudo generar el token"));
        }
        resolve({ token });
      }
    );
  });
};

// Comprobamos que usuario genero el token
export const comprobarJWT = (token: string) => {
  try {
    const { id } = jwt.verify(
      token,
      process.env.JWT_KEY || "12345Secret"
    ) as JwtPayload;
    return id;
  } catch (error) {
    return null;
  }
};
