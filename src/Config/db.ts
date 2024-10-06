import sql from "mssql";

const sqlConfig = {
  user: "sa",
  password: "badangop12",
  server: "DESKTOP-F9RUQPB\\SQLEXPRESS",
  database: "bytransload",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

export const connectToDB = async () => {
  try {
    const pool = await sql.connect(sqlConfig);
    console.log("Connected to database");
    return pool;
  } catch (error) {
    console.error("Error connecting to database:", error);
    return null;
  }
};
