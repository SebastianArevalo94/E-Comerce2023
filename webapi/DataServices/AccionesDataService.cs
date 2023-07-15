using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using ShopAppAPI.Models;
using System.Collections.Generic;
using System.Data;
using webapi.Models;

namespace webapi.DataServices
{
    public class AccionesDataService
    {
        public readonly ShopAppContext _dbContext;

        public AccionesDataService(ShopAppContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<AccionesUsuario> GetTipoAcciones()
        {
            try
            {
                string sql = "EXEC GetTipoAcciones";
                List<AccionesUsuario> result = new List<AccionesUsuario> ();

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
                                AccionesUsuario accionesUsuario = new AccionesUsuario()
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("tipoAccion")),
                                    Nombre = reader.GetString(reader.GetOrdinal("nombre"))
                                };

                                result.Add(accionesUsuario);
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

    }
}
