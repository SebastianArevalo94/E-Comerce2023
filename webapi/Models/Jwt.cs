using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Identity.Client;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using System.Text;

namespace ShopAppAPI.Models
{
    public class Jwt
    {
        public static dynamic GenerateToken(Usuario usuarioDB)
        {

            var claims = new[]
            {
                new Claim("id", usuarioDB.Id.ToString()),
                new Claim("correo", usuarioDB.Correo),
                new Claim("rol", usuarioDB.Rol.ToString()),
                new Claim("direccion", usuarioDB.Direccion.ToString()),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("jwTSeCrEtKeY1923453"));

            SigningCredentials signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken("http://localhost:5289", "http://localhost:5289/", claims, signingCredentials: signIn);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public static bool ValidateToken(string token, bool forAdmin = false)
        {
            try
            {
                if(!string.IsNullOrEmpty(token))
                {
                    string[] tokenFormat = token.Split(" ");

                    if (tokenFormat.Length == 2 && tokenFormat[0] == "Bearer")
                    {
                        var handler = new JwtSecurityTokenHandler();
                        var jsonToken = handler.ReadToken(tokenFormat[1]);
                        var tokenS = handler.ReadToken(tokenFormat[1]) as JwtSecurityToken;
                        string rol = tokenS.Claims.First(claim => claim.Type == "rol").Value;
                        if (forAdmin) { return rol == "1"; }
                        return true;
                    }

                }

                return false;
            }
            catch (Exception)
            {
                return false;
            }

        }

    }
}
