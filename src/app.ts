import express, { Application } from "express";
import usuarios from "./Router/user.routes";
import auth from "./Router/auth.routes";
import clientes from "./Router/clientes.routes";

const app: Application = express();
const port: number = 3000;

app.use(express.json());

// Usuarios
app.use("/api/usuarios", usuarios);

// Login
app.use("/api/auth", auth);

// Clientes
app.use("/api/clientes", clientes);

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
