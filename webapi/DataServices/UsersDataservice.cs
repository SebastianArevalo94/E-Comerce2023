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
    public class UsersDataservice
    {
        private readonly ShopAppContext _dbContext;

        public UsersDataservice(ShopAppContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Usuario GetByEmail(string email)
        {
            try
            {
                Usuario usuario = new Usuario();
                string sql = "EXEC GetUserByEmail @Correo";
                using (var connection = _dbContext.Database.GetDbConnection())
                {
                    connection.Open();

                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = sql;

                        SqlParameter Correo = new SqlParameter("@Correo", email);

                        command.Parameters.Add(Correo);

                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                usuario.Id = reader.GetInt32(reader.GetOrdinal("id"));
                                usuario.Nombre = reader.GetString(reader.GetOrdinal("nombre"));
                                usuario.Apellido = reader.GetString(reader.GetOrdinal("apellido"));
                                usuario.Correo = reader.GetString(reader.GetOrdinal("correo"));
                                usuario.Contrasenia = reader.GetString(reader.GetOrdinal("contrasenia"));
                                usuario.Foto = reader.GetString(reader.GetOrdinal("foto"));
                                usuario.Rol = reader.GetInt32(reader.GetOrdinal("rol"));
                                usuario.FechaCreacion = reader.GetDateTime(reader.GetOrdinal("fechaCreacion"));
                            }
                            else
                            {
                                return usuario;
                            }
                        }

                    }
                    connection.Close();

                }
                return usuario;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public Usuario CreateUser(Usuario usuario)
        {
            try
            {
                Usuario createdUser = new Usuario();
                string sql = "EXEC CreateUser @Correo, @Nombre, @Apellido, @Contrasenia, @Foto, @Rol, @FechaCreacion, @Direccion, @Documento";
                using (var connection = _dbContext.Database.GetDbConnection())
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        var correoParam = new SqlParameter("@Correo", usuario.Correo);
                        var nombreParam = new SqlParameter("@Nombre", usuario.Nombre);
                        var apellidoParam = new SqlParameter("@Apellido", usuario.Apellido);
                        var contraseniaParam = new SqlParameter("@Contrasenia", usuario.Contrasenia);
                        var fotoParam = new SqlParameter("@Foto", usuario.Foto);
                        var rolParam = new SqlParameter("@Rol", usuario.Rol);
                        var fechaCreacionParam = new SqlParameter("@FechaCreacion", DateTime.Now);
                        var direccionParam = new SqlParameter("@Direccion", usuario.Direccion);
                        var documentoParam = new SqlParameter("@Documento", usuario.Documento);

                        command.Parameters.Add(correoParam);
                        command.Parameters.Add(nombreParam);
                        command.Parameters.Add(apellidoParam);
                        command.Parameters.Add(contraseniaParam);
                        command.Parameters.Add(fotoParam);
                        command.Parameters.Add(rolParam);
                        command.Parameters.Add(fechaCreacionParam);
                        command.Parameters.Add(direccionParam);
                        command.Parameters.Add(documentoParam);

                        command.CommandText = sql;

                        using (var reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                createdUser = new Usuario
                                {
                                    // Asigna los valores de las columnas del usuario devuelto por la consulta
                                    Id = Convert.ToInt32(reader["Id"]),
                                    Correo = reader["Correo"].ToString(),
                                    Nombre = reader["Nombre"].ToString(),
                                    Apellido = reader["Apellido"].ToString(),
                                    Contrasenia = reader["Contrasenia"].ToString(),
                                    Foto = reader["Foto"].ToString(),
                                    Rol = Convert.ToInt32(reader["Rol"]),
                                    FechaCreacion = Convert.ToDateTime(reader["FechaCreacion"]),
                                    Direccion = reader["Direccion"].ToString(),
                                    Documento = reader["Documento"].ToString()
                                };
                            }
                        }
                    }
                    connection.Close();
                }

                return createdUser;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }
        }

        public List<Usuario> GetAllUsers()
        {
            List<Usuario> results = new List<Usuario>();
            try
            {
                string sql = "EXEC GetAllUsers";
                using (var connection = _dbContext.Database.GetDbConnection())
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = sql;
                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                Usuario usuario = new Usuario();
                                usuario.Id = reader.GetInt32(reader.GetOrdinal("Id"));
                                usuario.Correo = reader.GetString(reader.GetOrdinal("Correo"));
                                usuario.Nombre = reader.GetString(reader.GetOrdinal("Nombre"));
                                usuario.Apellido = reader.GetString(reader.GetOrdinal("Apellido"));
                                usuario.Contrasenia = reader.GetString(reader.GetOrdinal("Contrasenia"));
                                usuario.Foto = reader.GetString(reader.GetOrdinal("Foto"));
                                usuario.Rol = reader.GetInt32(reader.GetOrdinal("Rol"));
                                usuario.FechaCreacion = reader.GetDateTime(reader.GetOrdinal("FechaCreacion"));
                                results.Add(usuario);
                            }
                        }
                    }
                    connection.Close();
                }
                return results;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }
        }

        public Usuario GetById(int id)
        {
            Usuario usuario = new Usuario();
            try
            {
                string sql = "EXEC GetUserById @Id";
                using (var connection = _dbContext.Database.GetDbConnection())
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
                                usuario.Id = reader.GetInt32(reader.GetOrdinal("Id"));
                                usuario.Correo = reader.GetString(reader.GetOrdinal("Correo"));
                                usuario.Nombre = reader.GetString(reader.GetOrdinal("Nombre"));
                                usuario.Apellido = reader.GetString(reader.GetOrdinal("Apellido"));
                                usuario.Contrasenia = reader.GetString(reader.GetOrdinal("Contrasenia"));
                                usuario.Foto = reader.GetString(reader.GetOrdinal("Foto"));
                                usuario.Rol = reader.GetInt32(reader.GetOrdinal("Rol"));
                                usuario.FechaCreacion = reader.GetDateTime(reader.GetOrdinal("FechaCreacion"));
                                usuario.Direccion = reader.GetString(reader.GetOrdinal("Direccion"));
                                usuario.Documento = reader.GetString(reader.GetOrdinal("Documento"));
                            }
                        }
                    }
                    connection.Close();
                }
                return usuario;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }
        }

        public List<Usuario> GetByName(string name)
        {
            try
            {
                List<Usuario> result = new List<Usuario>();
                string sql = "EXEC GetUserByName @name";
                using (var connection = _dbContext.Database.GetDbConnection())
                {
                    connection.Open();

                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = sql;

                        SqlParameter Name = new SqlParameter("@name", name);

                        command.Parameters.Add(Name);

                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                Usuario usuario = new Usuario();
                                usuario.Id = reader.GetInt32(reader.GetOrdinal("Id"));
                                usuario.Correo = reader.GetString(reader.GetOrdinal("Correo"));
                                usuario.Nombre = reader.GetString(reader.GetOrdinal("Nombre"));
                                usuario.Apellido = reader.GetString(reader.GetOrdinal("Apellido"));
                                usuario.Contrasenia = reader.GetString(reader.GetOrdinal("Contrasenia"));
                                usuario.Foto = reader.GetString(reader.GetOrdinal("Foto"));
                                usuario.Rol = reader.GetInt32(reader.GetOrdinal("Rol"));
                                usuario.FechaCreacion = reader.GetDateTime(reader.GetOrdinal("FechaCreacion"));
                                result.Add(usuario);
                            }
                        }

                    }
                    connection.Close();

                }
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void EditUser(Usuario usuario, int id)
        {
            try
            {
                string sql = "EXEC EditUser @Id, @Nombre, @Apellido, @Correo, @Contrasenia, @Foto, @Rol, @Direccion, @Documento";
                using (var connection = _dbContext.Database.GetDbConnection())
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        SqlParameter idParam = new SqlParameter("@Id", id);
                        SqlParameter correoParam = new SqlParameter("@Correo", usuario.Correo);
                        SqlParameter nombreParam = new SqlParameter("@Nombre", usuario.Nombre);
                        SqlParameter apellidoParam = new SqlParameter("@Apellido", usuario.Apellido);
                        SqlParameter contraseniaParam = new SqlParameter("@Contrasenia", usuario.Contrasenia);
                        SqlParameter fotoParam = new SqlParameter("@Foto", usuario.Foto);
                        SqlParameter rolParam = new SqlParameter("@Rol", usuario.Rol);
                        SqlParameter direccionParam = new SqlParameter("@Direccion", usuario.Direccion);
                        SqlParameter documentoParam = new SqlParameter("@Documento", usuario.Documento);

                        command.Parameters.Add(idParam);
                        command.Parameters.Add(correoParam);
                        command.Parameters.Add(nombreParam);
                        command.Parameters.Add(apellidoParam);
                        command.Parameters.Add(contraseniaParam);
                        command.Parameters.Add(fotoParam);
                        command.Parameters.Add(rolParam);
                        command.Parameters.Add(direccionParam);
                        command.Parameters.Add(documentoParam);

                        command.CommandText = sql;

                        command.ExecuteNonQuery();
                    }
                    connection.Close();
                }

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }
        }

        public void DeleteUser(int id)
        {
            try
            {
                string sql = "EXEC Deleteuser @Id";
                using (var connection = _dbContext.Database.GetDbConnection())
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
    
        public void CreateUsuarioCompra(Compras_Usuario comprasUsuario)
        {
            try
            {
                string sql = "EXEC Create_UsuarioCompras @log, @factura, @usuario, @fecha";
                using (var connection = new SqlConnection("Server=(local); Database=ShopApp; Integrated Security=true; TrustServerCertificate=True"))
                {
                    connection.Open();

                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = sql;

                        SqlParameter logParam = new SqlParameter("@log", comprasUsuario.Log);
                        SqlParameter facturaParam = new SqlParameter("@factura", comprasUsuario.Factura);
                        SqlParameter usuarioParam = new SqlParameter("@usuario", comprasUsuario.Usuario);
                        SqlParameter fechaParam = new SqlParameter("@fecha", comprasUsuario.Fecha);

                        command.Parameters.Add(logParam);
                        command.Parameters.Add(facturaParam);
                        command.Parameters.Add(usuarioParam);
                        command.Parameters.Add(fechaParam);

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

    }
}
