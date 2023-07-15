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
    public class LogDataService
    {
        private readonly ShopAppContext _dbContext;

        public LogDataService(ShopAppContext dbContext)
        {
            _dbContext = dbContext;
        }


        public int CreateLogAcccionUsuario(LogUsuario logUsuario)
        {
            try
            {
                string sql = "EXEC CreateLogAccionUsuario @id_usuario, @tipoAccion, @fechaAccion";
                using (var connection = new SqlConnection("Server=(local); Database=ShopApp; Integrated Security=true; TrustServerCertificate=True"))
                {

                    connection.Open();

                    //if (connection.State == ConnectionState.Open)
                    //{
                    //    // Acceder a la propiedad ServerVersion
                    //    string serverVersion = connection.ServerVersion;
                    //    // Resto de tu código...
                    //}

                    int id;

                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = sql;

                        SqlParameter Id = new SqlParameter("@id_usuario", logUsuario.IdUsuario);
                        SqlParameter TipoAccion = new SqlParameter("@tipoAccion", logUsuario.TipoAccion);
                        SqlParameter FechaAccion = new SqlParameter("@fechaAccion", logUsuario.FechaAccion);

                        command.Parameters.Add(Id);
                        command.Parameters.Add(TipoAccion);
                        command.Parameters.Add(FechaAccion);

                        id = Convert.ToInt32(command.ExecuteScalar());
                    }

                    connection.Close();

                    return id;
                }

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public List<AdminInfoLog> GetAdminLog(FilterAdminLog filter)
        {
            string sql = "EXEC GetAdminLog @filter, @type, @user, @order";
            List<AdminInfoLog> list = new List<AdminInfoLog>();
            using (var connection = _dbContext.Database.GetDbConnection())
            {
                connection.Open();
                using (var command = connection.CreateCommand())
                {
                    SqlParameter filterParam = new SqlParameter("@filter", filter.filter);
                    SqlParameter typeParam = new SqlParameter("@type", filter.type);
                    SqlParameter userParam = new SqlParameter("@user", filter.user);
                    SqlParameter orderParam = new SqlParameter("@order", filter.order);

                    command.Parameters.Add(filterParam);
                    command.Parameters.Add(typeParam);
                    command.Parameters.Add(userParam);
                    command.Parameters.Add(orderParam);

                    command.CommandText = sql;

                    using (var reader = command.ExecuteReader())
                    {

                        while (reader.Read())
                        {
                            AdminInfoLog log = new AdminInfoLog()
                            {
                                Id = reader.GetInt32(reader.GetOrdinal("id")),
                                TipoAccion = reader.GetInt32(reader.GetOrdinal("tipoAccion")),
                                Descripcion = reader.GetString(reader.GetOrdinal("descripcion")),
                                Label = reader.GetString(reader.GetOrdinal("label")),
                                Fecha = reader.GetDateTime(reader.GetOrdinal("fecha")),
                            };

                            UserInfo user = new UserInfo()
                            {
                                Id = reader.GetInt32(reader.GetOrdinal("id_user")),
                                NombreCompleto = reader.GetString(reader.GetOrdinal("NombreCompleto")),
                                Foto = reader.GetString(reader.GetOrdinal("foto")),
                                Rol = reader.GetInt32(reader.GetOrdinal("rol")),
                                Rol_desc = reader.GetString(reader.GetOrdinal("rol_desc"))
                            };

                            log.user = user;

                            list.Add(log);
                        }
                    }
                }
                connection.Close();
            }
            return list;
        }


        public List<InfoLog> GetLogByUser(int user)
        {
            string sql = "EXEC GetLogByUser @user";
            List<InfoLog> list = new List<InfoLog>();
            using (var connection = _dbContext.Database.GetDbConnection())
            {
                connection.Open();
                using (var command = connection.CreateCommand())
                {
                    SqlParameter userParam = new SqlParameter("@user", user);

                    command.Parameters.Add(userParam);
                    command.CommandText = sql;

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            InfoLog log = new InfoLog()
                            {
                                Id = reader.GetInt32(reader.GetOrdinal("id")),
                                TipoAccion = reader.GetInt32(reader.GetOrdinal("tipoAccion")),
                                Descripcion = reader.GetString(reader.GetOrdinal("descripcion")),
                                Label = reader.GetString(reader.GetOrdinal("label")),
                                Fecha = reader.GetDateTime(reader.GetOrdinal("fecha")),
                            };

                            list.Add(log);
                        }
                    }
                }
                connection.Close();
            }
            return list;
        }

        public void RegisterUserAuth(LogAuthUser logAuthUser)
        {
            try
            {
                string sql = "EXEC RegisterLogUserAuth @usuario, @log, @tipoAccion, @latitud, @longitud, @fecha, @ip, @pais, @ciudad";
                using (var connection = new SqlConnection("Server=(local); Database=ShopApp; Integrated Security=true; TrustServerCertificate=True"))
                {

                    connection.Open();

                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = sql;

                        SqlParameter usuarioParam = new SqlParameter("@usuario", logAuthUser.Usuario);
                        SqlParameter logParam = new SqlParameter("@log", logAuthUser.Log);
                        SqlParameter tipoAccionParam = new SqlParameter("@tipoAccion", logAuthUser.TipoAccion);
                        SqlParameter latitudParam = new SqlParameter("@latitud", logAuthUser.Latitud);
                        SqlParameter longitudParam = new SqlParameter("@longitud", logAuthUser.Longitud);
                        SqlParameter fechaParam = new SqlParameter("@fecha", logAuthUser.Fecha);
                        SqlParameter ipParam = new SqlParameter("@ip", logAuthUser.Ip);
                        SqlParameter paisParam = new SqlParameter("@pais", logAuthUser.Pais);
                        SqlParameter ciudadParam = new SqlParameter("@ciudad", logAuthUser.Ciudad);

                        command.Parameters.Add(usuarioParam);
                        command.Parameters.Add(logParam);
                        command.Parameters.Add(tipoAccionParam);
                        command.Parameters.Add(latitudParam);
                        command.Parameters.Add(longitudParam);
                        command.Parameters.Add(fechaParam);
                        command.Parameters.Add(ipParam);
                        command.Parameters.Add(paisParam);
                        command.Parameters.Add(ciudadParam);

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

        public LogAuthUser GetLogUserAuthBylog(int log)
        {
            string sql = "EXEC GetInfoUserAuthByLog @log";
            LogAuthUser logAuthUser = null;

            using (var connection = new SqlConnection("Server=(local); Database=ShopApp; Integrated Security=true; TrustServerCertificate=True"))
            {
                connection.Open();
                using (var command = connection.CreateCommand())
                {
                    SqlParameter logParam = new SqlParameter("@log", log);
                    command.Parameters.Add(logParam);
                    command.CommandText = sql;

                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            logAuthUser = new LogAuthUser()
                            {
                                Id = reader.GetInt32(reader.GetOrdinal("Id")),
                                Log = reader.GetInt32(reader.GetOrdinal("Log")),
                                TipoAccion = reader.GetInt32(reader.GetOrdinal("TipoAccion")),
                                Usuario = reader.GetInt32(reader.GetOrdinal("Usuario")),
                                Fecha = reader.GetDateTime(reader.GetOrdinal("Fecha")),
                                Ip = reader.GetString(reader.GetOrdinal("Ip")),
                                Pais = reader.GetString(reader.GetOrdinal("Pais")),
                                Ciudad = reader.GetString(reader.GetOrdinal("Ciudad"))
                            };
                            try
                            {
                                logAuthUser.Latitud = Convert.ToDouble(reader["latitud"]);
                                logAuthUser.Longitud = Convert.ToDouble(reader["longitud"]);
                            }
                            catch (Exception ex)
                            {

                            }
                        }
                    }
                }
            }

            return logAuthUser;
        }
    }
}