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
    public class CreditCardDataService
    {
        private readonly ShopAppContext _dbContext;
        private readonly IConfiguration _configuration;

        public CreditCardDataService(ShopAppContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        public void CreateCC(CreditCard creditCard)
        {
            try
            {
                string sql = "EXEC CreateCC @CardHolder, @Numero, @Expira, @CCV, @Tipo, @id_user";
                using (var connection = new SqlConnection(_configuration["ConnectionStrings:SQL_STRING"]))
                {
                    connection.Open();

                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = sql;

                        SqlParameter CardHolderParam = new SqlParameter("@CardHolder", creditCard.CardHolder);
                        SqlParameter NumeroParam = new SqlParameter("@Numero", creditCard.Numero);
                        SqlParameter ExpiraParam = new SqlParameter("@Expira", creditCard.Expira);
                        SqlParameter CCVParam = new SqlParameter("@CCV", creditCard.CCV);
                        SqlParameter TipoParam = new SqlParameter("@Tipo", creditCard.Tipo);
                        SqlParameter IdUserParam = new SqlParameter("@id_user", creditCard.Id_user);

                        command.Parameters.Add(CardHolderParam);
                        command.Parameters.Add(NumeroParam);
                        command.Parameters.Add(ExpiraParam);
                        command.Parameters.Add(CCVParam);
                        command.Parameters.Add(TipoParam);
                        command.Parameters.Add(IdUserParam);

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

        public void EditCC(CreditCard creditCard, int id)
        {
            try
            {
                string sql = "EXEC EditCC @Id, @CardHolder, @Numero, @Expira, @CCV, @Tipo, @id_user";
                using (var connection = new SqlConnection(_configuration["ConnectionStrings:SQL_STRING"]))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        SqlParameter idParam = new SqlParameter("@Id", id);
                        SqlParameter cardHolderParam = new SqlParameter("@CardHolder", creditCard.CardHolder);
                        SqlParameter numeroParam = new SqlParameter("@Numero", creditCard.Numero);
                        SqlParameter expiraParam = new SqlParameter("@Expira", creditCard.Expira);
                        SqlParameter ccvParam = new SqlParameter("@CCV", creditCard.CCV);
                        SqlParameter tipoParam = new SqlParameter("@Tipo", creditCard.Tipo);
                        SqlParameter idUserParam = new SqlParameter("@id_user", creditCard.Id_user);

                        command.Parameters.Add(idParam);
                        command.Parameters.Add(cardHolderParam);
                        command.Parameters.Add(numeroParam);
                        command.Parameters.Add(expiraParam);
                        command.Parameters.Add(ccvParam);
                        command.Parameters.Add(tipoParam);
                        command.Parameters.Add(idUserParam);

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

        public void DeleteCC(int id)
        {
            try
            {
                string sql = "EXEC DeleteCC @Id";
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

        public List<CreditCard> GetCCByUser(int id)
        {
            List<CreditCard> results = new List<CreditCard>();
            try
            {
                string sql = "EXEC GetCreditCardsByUser @Id";
                using (var connection = new SqlConnection(_configuration["ConnectionStrings:SQL_STRING"]))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        SqlParameter idParam = new SqlParameter("@Id", id);
                        command.Parameters.Add(idParam);
                        command.CommandText = sql;
                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                CreditCard creditCard = new CreditCard();
                                creditCard.CardHolder = reader.GetString(reader.GetOrdinal("CardHolder"));
                                creditCard.Numero = reader.GetString(reader.GetOrdinal("Numero"));
                                creditCard.Expira = reader.GetDateTime(reader.GetOrdinal("Expira"));
                                creditCard.CCV = reader.GetInt32(reader.GetOrdinal("CCV"));
                                creditCard.Tipo = reader.GetString(reader.GetOrdinal("Tipo"));
                                creditCard.Id_user = reader.GetInt32(reader.GetOrdinal("id_user"));
                                creditCard.Id = reader.GetInt32(reader.GetOrdinal("Id"));
                                results.Add(creditCard);
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

        public CreditCard GetCCById(int id)
        {
            try
            {
                string sql = "EXEC GetCCById @Id";
                CreditCard creditCard = new CreditCard();
                using (var connection = new SqlConnection(_configuration["ConnectionStrings:SQL_STRING"]))
                {
                    connection.Open();
                    using (var command = connection.CreateCommand())
                    {
                        SqlParameter idParam = new SqlParameter("@Id", id);
                        command.Parameters.Add(idParam);
                        command.CommandText = sql;
                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                creditCard.CardHolder = reader.GetString(reader.GetOrdinal("CardHolder"));
                                creditCard.Numero = reader.GetString(reader.GetOrdinal("Numero"));
                                creditCard.Expira = reader.GetDateTime(reader.GetOrdinal("Expira"));
                                creditCard.CCV = reader.GetInt32(reader.GetOrdinal("CCV"));
                                creditCard.Tipo = reader.GetString(reader.GetOrdinal("Tipo"));
                                creditCard.Id_user = reader.GetInt32(reader.GetOrdinal("id_user"));
                                creditCard.Id = reader.GetInt32(reader.GetOrdinal("Id"));
                            }
                        }
                    }
                    connection.Close();
                }
                return creditCard;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }
        }

    }


}

