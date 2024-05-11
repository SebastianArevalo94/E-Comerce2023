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
    public class CategoryDataService
    {
        private readonly ShopAppContext _dbContext;
        private readonly IConfiguration _configuration;

        public CategoryDataService(ShopAppContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        public void CreateCategory(Categoria categoria)
        {
            try
            {
                string sql = "EXEC CreateCategory @Nombre";
                using (var connection = new SqlConnection(_configuration["ConnectionStrings:SQL_STRING"]))
                {
                    connection.Open();

                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = sql;

                        SqlParameter nombreParam = new SqlParameter("@Nombre", categoria.Nombre);

                        command.Parameters.Add(nombreParam);

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

        public void EditCategory(Categoria categoria, int codigo)
        {
            try
            {
                string sql = "EXEC EditCategory @Codigo, @Nombre";
                using (var connection = new SqlConnection(_configuration["ConnectionStrings:SQL_STRING"]))
                {
                    connection.Open();

                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = sql;

                        SqlParameter Codigo = new SqlParameter("@Codigo", codigo);
                        SqlParameter Nombre = new SqlParameter("@Nombre", categoria.Nombre);

                        command.Parameters.Add(Codigo);
                        command.Parameters.Add(Nombre);

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

        public List<Categoria> GetAllCategories()
        {

            List<Categoria> results = new List<Categoria>();

            try
            {
                string sql = "EXEC GetCategories";
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
                                Categoria categoria = new Categoria();
                                categoria.Id = reader.GetInt32(reader.GetOrdinal("id"));
                                categoria.Codigo = reader.GetInt32(reader.GetOrdinal("codigo"));
                                categoria.Nombre = reader.GetString(reader.GetOrdinal("nombre"));
                                results.Add(categoria);
                            }
                        }
                    }
                }

                return results;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public Categoria GetOneCategory(int codigo)
        {
            Categoria categoria = new Categoria();

            try
            {
                string sql = "EXEC GetOneCategory @Codigo";
                using (var connection = new SqlConnection(_configuration["ConnectionStrings:SQL_STRING"]))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {

                        command.CommandText = sql;

                        SqlParameter codigoParam = new SqlParameter("@Codigo", codigo);

                        command.Parameters.Add(codigoParam);

                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                categoria.Id = reader.GetInt32(reader.GetOrdinal("id"));
                                categoria.Codigo = reader.GetInt32(reader.GetOrdinal("codigo"));
                                categoria.Nombre = reader.GetString(reader.GetOrdinal("nombre"));
                            }
                        }
                    }
                }

                return categoria;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public List<Categoria> GetCategoryByName(string name)
        {
            List<Categoria> categorias = new List<Categoria>();

            try
            {
                string sql = "EXEC GetCategoryByName @name";
                using (var connection = new SqlConnection(_configuration["ConnectionStrings:SQL_STRING"]))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {

                        command.CommandText = sql;

                        SqlParameter codigoParam = new SqlParameter("@name", name);

                        command.Parameters.Add(codigoParam);

                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                Categoria categoria = new Categoria()
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("id")),
                                    Codigo = reader.GetInt32(reader.GetOrdinal("codigo")),
                                    Nombre = reader.GetString(reader.GetOrdinal("nombre")),
                                };

                                categorias.Add(categoria);
                            }
                        }
                    }
                }

                return categorias;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void DeleteCategory(int codigo)
        {
            try
            {
                string sql = "EXEC DeleteCategory @Codigo";
                using (var connection = new SqlConnection(_configuration["ConnectionStrings:SQL_STRING"]))
                {
                    connection.Open();

                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = sql;

                        SqlParameter codigoParam = new SqlParameter("@Codigo", codigo);

                        command.Parameters.Add(codigoParam);

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

