using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using ShopAppAPI.Models;
using System;
using System.Data;
using System.Data.Common;
using System.Dynamic;
using webapi.Models;

namespace webapi.DataServices
{
    public class FacturasDataService
    {
        private readonly ShopAppContext _dbContext;
        private readonly IConfiguration _configuration;

        public FacturasDataService(ShopAppContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;

        }

        public int GenerarFactura(List<Producto_Comprado> products, Factura factura)
        {
            using (var connection = new SqlConnection(_configuration["ConnectionStrings:SQL_STRING"]))
            {
                connection.Open();

                int id;

                using (var transaction = connection.BeginTransaction())
                {
                    try
                    {
                        string agregarProductoCompradoSql = "EXEC AgregarProductoComprado @id_usuario, @id_producto, @unidades, @id_compra";
                        using (var agregarProductoCompradoCommand = connection.CreateCommand())
                        {
                            agregarProductoCompradoCommand.CommandText = agregarProductoCompradoSql;
                            agregarProductoCompradoCommand.Transaction = transaction;

                            foreach (Producto_Comprado pc in products)
                            {
                                agregarProductoCompradoCommand.Parameters.Clear();

                                SqlParameter Id_UsuarioParam = new SqlParameter("@id_usuario", pc.Id_Usuario);
                                SqlParameter Id_ProductoParam = new SqlParameter("@id_producto", pc.Id_Producto);
                                SqlParameter UnidadesParam = new SqlParameter("@unidades", pc.Unidades);
                                SqlParameter Id_CompraParam = new SqlParameter("@id_compra", pc.Id_Compra);

                                agregarProductoCompradoCommand.Parameters.Add(Id_UsuarioParam);
                                agregarProductoCompradoCommand.Parameters.Add(Id_ProductoParam);
                                agregarProductoCompradoCommand.Parameters.Add(UnidadesParam);
                                agregarProductoCompradoCommand.Parameters.Add(Id_CompraParam);

                                agregarProductoCompradoCommand.ExecuteNonQuery();
                            }
                        }

                        string generarFacturaSql = "EXEC GenerarFactura @id_usuario, @fechaCompra, @metodoPago, @id_compra, @direccion_envio";
                        using (var generarFacturaCommand = connection.CreateCommand())
                        {
                            generarFacturaCommand.CommandText = generarFacturaSql;
                            generarFacturaCommand.Transaction = transaction;

                            SqlParameter Id_UsuarioParam = new SqlParameter("@id_usuario", factura.Id_Usuario);
                            SqlParameter FechaCompraParam = new SqlParameter("@fechaCompra", factura.FechaCompra);
                            SqlParameter MetodoPagoParam = new SqlParameter("@metodoPago", factura.MetodoPago);
                            SqlParameter Id_CompraParam = new SqlParameter("@id_compra", factura.Id_Compra);
                            SqlParameter DireccionEnvioParam = new SqlParameter("@direccion_envio", factura.Direccion_Envio);

                            generarFacturaCommand.Parameters.Add(Id_UsuarioParam);
                            generarFacturaCommand.Parameters.Add(FechaCompraParam);
                            generarFacturaCommand.Parameters.Add(MetodoPagoParam);
                            generarFacturaCommand.Parameters.Add(Id_CompraParam);
                            generarFacturaCommand.Parameters.Add(DireccionEnvioParam);

                            id = Convert.ToInt32(generarFacturaCommand.ExecuteScalar());
                        }

                        transaction.Commit();

                        return id;
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        throw new Exception("Error al generar la factura.", ex);
                    }
                }
            }
        }

        public List<InfoFactura> GetFacturasByUser(int usuario)
        {
            string sql = "EXEC GetFacturasByUser @usuario";
            List<InfoFactura> resultado = new List<InfoFactura>();

            using (var connection = new SqlConnection(_configuration["ConnectionStrings:SQL_STRING"]))
            {
                connection.Open();
                using (var command = connection.CreateCommand())
                {
                    command.CommandText = sql;

                    SqlParameter usuarioParam = new SqlParameter("@usuario", usuario);
                    command.Parameters.Add(usuarioParam);

                    using (var reader = command.ExecuteReader())
                    {
                        // Variables auxiliares para mantener la referencia de la factura actual
                        int facturaActualId = -1;
                        InfoFactura facturaActual = null;

                        while (reader.Read())
                        {
                            int facturaId = Convert.ToInt32(reader["id_factura"]);

                            // Si la factura actual es diferente de la factura leída, crear un nuevo objeto InfoFactura
                            if (facturaId != facturaActualId)
                            {
                                facturaActualId = facturaId;

                                // Crear un objeto InfoFactura y asignar los valores de las columnas
                                facturaActual = new InfoFactura
                                {
                                    Id_Factura = facturaId,
                                    Id_Usuario = Convert.ToInt32(reader["id_usuario"]),
                                    FechaCompra = Convert.ToDateTime(reader["fechaCompra"]),
                                    Id_Compra = Convert.ToString(reader["id_compra"]),
                                    Direccion_Envio = Convert.ToString(reader["direccion_envio"]),
                                    TotalFacturado = Convert.ToDouble(reader["total_facturado"]),
                                    Productos = new List<InfoProducto>(),
                                    NombreCompleto = Convert.ToString(reader["nombre_completo"]),
                                    Documento = Convert.ToString(reader["Documento"]),
                                    Correo = Convert.ToString(reader["correo"]),
                                    MetodoPago = Convert.ToInt32(reader["metodoPago"]),
                                    LabelMetodoPago = Convert.ToString(reader["LabelMetodoPago"])
                                };

                                resultado.Add(facturaActual);
                            }

                            // Crear un objeto InfoProducto y asignar los valores de las columnas
                            InfoProducto producto = new InfoProducto
                            {
                                Id = Convert.ToInt32(reader["id"]),
                                Nombre = Convert.ToString(reader["nombre"]),
                                Precio = Convert.ToDouble(reader["precio"]),
                                Descripcion = Convert.ToString(reader["descripcion"]),
                                Categoria = Convert.ToString(reader["categoria"]),
                                Foto = Convert.ToString(reader["foto"]),
                                Unidades = Convert.ToInt32(reader["unidades"]),
                                SubTotal = Convert.ToDouble(reader["sub_total"])
                            };

                            // Agregar el producto a la lista de productos de la factura actual
                            facturaActual.Productos.Add(producto);
                        }
                    }
                }
            }

            return resultado;
        }

        public InfoFactura GetFacturaByLog(int log)
        {
            string sql = "EXEC GetFacturaByLog @log";
            InfoFactura factura = null;

            using (var connection = new SqlConnection(_configuration["ConnectionStrings:SQL_STRING"]))
            {
                connection.Open();
                using (var command = connection.CreateCommand())
                {
                    command.CommandText = sql;

                    SqlParameter logParam = new SqlParameter("@log", log);
                    command.Parameters.Add(logParam);

                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            factura = new InfoFactura
                            {
                                Id_Factura = Convert.ToInt32(reader["id_factura"]),
                                Id_Usuario = Convert.ToInt32(reader["id_usuario"]),
                                FechaCompra = Convert.ToDateTime(reader["fechaCompra"]),
                                Id_Compra = Convert.ToString(reader["id_compra"]),
                                Direccion_Envio = Convert.ToString(reader["direccion_envio"]),
                                TotalFacturado = Convert.ToDouble(reader["total_facturado"]),
                                MetodoPago = Convert.ToInt32(reader["metodoPago"]),
                                LabelMetodoPago = Convert.ToString(reader["LabelMetodoPago"]),
                                Productos = new List<InfoProducto>(),
                                NombreCompleto = Convert.ToString(reader["nombreCompleto"]),
                                Documento = Convert.ToString(reader["Documento"]),
                                Correo = Convert.ToString(reader["correo"]),
                            };

                            do
                            {
                                InfoProducto producto = new InfoProducto
                                {
                                    Id = Convert.ToInt32(reader["id"]),
                                    Nombre = Convert.ToString(reader["nombre"]),
                                    Precio = Convert.ToDouble(reader["precio"]),
                                    Descripcion = Convert.ToString(reader["descripcion"]),
                                    Categoria = Convert.ToString(reader["categoria"]),
                                    Foto = Convert.ToString(reader["foto"]),
                                    Unidades = Convert.ToInt32(reader["unidades"]),
                                    SubTotal = Convert.ToDouble(reader["sub_total"])
                                };

                                factura.Productos.Add(producto);
                            }
                            while (reader.Read());
                        }
                    }
                }
            }

            return factura;
        }

    }


}

