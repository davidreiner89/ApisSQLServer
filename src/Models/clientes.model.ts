export interface Clientes {
  dni_cliente: string;
  razon_social_cliente: string;
  representante_cliente: string;
  clave_cliente: string;
  id_vendedor_usuario_cliente: number;
  limite_credito_cliente: number;
  alerta_credito_cliente: number;
  ubigeo_cliente: string;
  departamento: string;
  provincia: string;
  distrito: string;
  direccion_cliente: string;
  referencias_cliente: string;
  contacto_cliente: string;
  telefono_cliente: string;
  email_cliente: string;
  area_cliente: string;
  logo_cliente: string;
  id_creador_cliente: number;
  fecha_creado: Date;
}
