using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using ShopAppAPI.Models;
using System.Data;
using System.Diagnostics;
using System.Dynamic;
using webapi.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace webapi.DataServices
{
    public class ProductsDataService
    {
        public readonly ShopAppContext _dbContext;
        public readonly IConfiguration _configuration;

        public ProductsDataService(ShopAppContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        #region Productos
        public string GetAllProducts()
        {

            List<dynamic> results = new List<dynamic>();

            try
            {
                string sql = "EXEC GetAllProducts";
                using (var connection = new SqlConnection(_configuration["ConnectionStrings:SQL_STRING"]))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = sql;
                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                dynamic producto = new ExpandoObject();
                                producto.id = reader.GetInt32(reader.GetOrdinal("id"));
                                producto.nombre = reader.GetString(reader.GetOrdinal("nombre"));
                                producto.precio = reader.GetDouble(reader.GetOrdinal("precio"));
                                producto.descripcion = reader.GetString(reader.GetOrdinal("descripcion"));
                                producto.codigoCategoria = reader.GetInt32(reader.GetOrdinal("codigoCategoria"));
                                producto.nombreCategoria = reader.GetString(reader.GetOrdinal("nombreCategoria"));
                                producto.foto = reader.GetString(reader.GetOrdinal("foto"));
                                producto.cantidad = reader.GetInt32(reader.GetOrdinal("cantidad"));
                                producto.unidades = 1;
                                results.Add(producto);
                            }
                        }
                    }
                }

                return JsonConvert.SerializeObject(results);

            }
            catch (Exception)
            {
                return JsonConvert.SerializeObject(results);
            }
        }

        public string GetByName(string name)
        {

            List<dynamic> results = new List<dynamic>();

            try
            {
                string sql = $"EXEC GetByName {name}";
                using (var connection = new SqlConnection(_configuration["ConnectionStrings:SQL_STRING"]))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = sql;
                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                dynamic producto = new ExpandoObject();
                                producto.id = reader.GetInt32(reader.GetOrdinal("id"));
                                producto.nombre = reader.GetString(reader.GetOrdinal("nombre"));
                                producto.precio = reader.GetDouble(reader.GetOrdinal("precio"));
                                producto.descripcion = reader.GetString(reader.GetOrdinal("descripcion"));
                                producto.codigoCategoria = reader.GetInt32(reader.GetOrdinal("codigoCategoria"));
                                producto.nombreCategoria = reader.GetString(reader.GetOrdinal("nombreCategoria"));
                                producto.foto = reader.GetString(reader.GetOrdinal("foto"));
                                producto.cantidad = reader.GetInt32(reader.GetOrdinal("cantidad"));
                                results.Add(producto);
                            }
                        }
                    }
                }

                return JsonConvert.SerializeObject(results);

            }
            catch (Exception)
            {
                return JsonConvert.SerializeObject(results);
            }
        }

        public string GetByCategory(int category)
        {

            List<dynamic> results = new List<dynamic>();

            try
            {
                string sql = "EXEC GetByCategory @Category";
                using (var connection = new SqlConnection(_configuration["ConnectionStrings:SQL_STRING"]))
                {
                    connection.Open();

                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = sql;

                        SqlParameter categoryParam = new SqlParameter("@Category", category);

                        command.Parameters.Add(categoryParam);

                        using (var reader = command.ExecuteReader())
                        {


                            while (reader.Read())
                            {
                                dynamic producto = new ExpandoObject();
                                producto.id = reader.GetInt32(reader.GetOrdinal("id"));
                                producto.nombre = reader.GetString(reader.GetOrdinal("nombre"));
                                producto.precio = reader.GetDouble(reader.GetOrdinal("precio"));
                                producto.descripcion = reader.GetString(reader.GetOrdinal("descripcion"));
                                producto.codigoCategoria = reader.GetInt32(reader.GetOrdinal("codigoCategoria"));
                                producto.nombreCategoria = reader.GetString(reader.GetOrdinal("nombreCategoria"));
                                producto.foto = reader.GetString(reader.GetOrdinal("foto"));
                                producto.cantidad = reader.GetInt32(reader.GetOrdinal("cantidad"));
                                producto.unidades = 1;
                                results.Add(producto);
                            }
                        }
                    }
                    connection.Close();
                }

                return JsonConvert.SerializeObject(results);

            }
            catch (Exception)
            {
                return JsonConvert.SerializeObject(results);
            }
        }

        public string GetById(int id)
        {
            Producto producto = new Producto();

            try
            {
                string sql = "EXEC GetProductById @Id";
                using (var connection = new SqlConnection(_configuration["ConnectionStrings:SQL_STRING"]))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = sql;
                        SqlParameter Id = new SqlParameter("@Id", id);
                        command.Parameters.Add(Id);

                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                producto.Id = reader.GetInt32(reader.GetOrdinal("Id"));
                                producto.Nombre = reader.GetString(reader.GetOrdinal("Nombre"));
                                producto.Precio = reader.GetDouble(reader.GetOrdinal("Precio"));
                                producto.Descripcion = reader.GetString(reader.GetOrdinal("Descripcion"));
                                producto.Categoria = reader.GetInt32(reader.GetOrdinal("Categoria"));
                                producto.Foto = reader.GetString(reader.GetOrdinal("Foto"));
                                producto.Cantidad = reader.GetInt32(reader.GetOrdinal("Cantidad"));
                            }
                        }
                    }
                    connection.Close();
                }

                if (producto.Id == 0)
                {
                    return "No product Found";
                }

                return JsonConvert.SerializeObject(producto);

            }
            catch (Exception)
            {
                return JsonConvert.SerializeObject(producto);
            }
        }

        public void Create(Producto producto)
        {
            try
            {
                string sql = "EXEC CreateProduct @Nombre, @Precio, @Descripcion, @Categoria, @Foto, @Cantidad";
                using (var connection = new SqlConnection(_configuration["ConnectionStrings:SQL_STRING"]))
                {
                    connection.Open();

                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = sql;

                        SqlParameter Nombre = new SqlParameter("@Nombre", producto.Nombre);
                        SqlParameter Precio = new SqlParameter("@Precio", producto.Precio);
                        SqlParameter Descripcion = new SqlParameter("@Descripcion", producto.Descripcion);
                        SqlParameter Categoria = new SqlParameter("@Categoria", producto.Categoria);
                        SqlParameter Foto = new SqlParameter("@Foto", producto.Foto);
                        SqlParameter Cantidad = new SqlParameter("@Cantidad", producto.Cantidad);

                        command.Parameters.Add(Nombre);
                        command.Parameters.Add(Precio);
                        command.Parameters.Add(Descripcion);
                        command.Parameters.Add(Categoria);
                        command.Parameters.Add(Foto);
                        command.Parameters.Add(Cantidad);

                        command.ExecuteNonQuery();

                    }
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void Edit(Producto producto, int id)
        {
            try
            {
                string sql = "EXEC EditProduct @Id, @Nombre, @Precio,  @Descripcion, @Categoria, @Foto, @Cantidad";
                using (var connection = new SqlConnection(_configuration["ConnectionStrings:SQL_STRING"]))
                {
                    connection.Open();

                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = sql;

                        SqlParameter Id = new SqlParameter("@Id", id);
                        SqlParameter Nombre = new SqlParameter("@Nombre", producto.Nombre);
                        SqlParameter Precio = new SqlParameter("@Precio", producto.Precio);
                        SqlParameter Descripcion = new SqlParameter("@Descripcion", producto.Descripcion);
                        SqlParameter Categoria = new SqlParameter("@Categoria", producto.Categoria);
                        SqlParameter Foto = new SqlParameter("@Foto", producto.Foto);
                        SqlParameter Cantidad = new SqlParameter("@Cantidad", producto.Cantidad);

                        command.Parameters.Add(Id);
                        command.Parameters.Add(Nombre);
                        command.Parameters.Add(Precio);
                        command.Parameters.Add(Descripcion);
                        command.Parameters.Add(Categoria);
                        command.Parameters.Add(Foto);
                        command.Parameters.Add(Cantidad);

                        command.ExecuteNonQuery();

                    }
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void Delete(int id)
        {
            try
            {
                string sql = "EXEC DeleteProduct @Id";
                using (var connection = new SqlConnection(_configuration["ConnectionStrings:SQL_STRING"]))
                {
                    connection.Open();

                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = sql;

                        SqlParameter Id = new SqlParameter("@Id", id);

                        command.Parameters.Add(Id);

                        command.ExecuteNonQuery();

                    }
                    connection.Close();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        #endregion

    }
}
