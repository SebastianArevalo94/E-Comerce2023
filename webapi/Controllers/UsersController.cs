using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.AspNetCore.Mvc.RazorPages.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ShopAppAPI.Models;
using System.ComponentModel.Design.Serialization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using webapi.DataServices;
using webapi.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace ShopAppAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ShopAppContext _dbContext;
        private readonly UsersDataservice _usersDataService;
        private readonly LogDataService _logDataService;

        public UsersController(ShopAppContext dbContext)
        {
            _dbContext = dbContext;
            _usersDataService = new UsersDataservice(_dbContext);
            _logDataService = new LogDataService(_dbContext);
        }

        //Registro
        [HttpPost]
        [Route("SignUp")]
        public IActionResult SignUp([FromBody] InfoSignUp data)
        {
            try 
            {
                LogAuthUser logAuthUser = data.logAuthUser;

                Usuario userExist = _dbContext.Usuarios.FirstOrDefault(u => u.Correo == data.usuario.Correo);

                if (userExist != null)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, new { message = "The email is already registered.", status = 400 });
                }

                Usuario userCreated = _usersDataService.CreateUser(data.usuario);

                string token = Jwt.GenerateToken(userCreated);

                LogUsuario logUsuario = new LogUsuario()
                {
                    IdUsuario = userCreated.Id,
                    TipoAccion = 3,
                    FechaAccion = DateTime.Now
                };

                int log = _logDataService.CreateLogAcccionUsuario(logUsuario);
                
                data.logAuthUser.Fecha = DateTime.Now;
                data.logAuthUser.Log = log;

                _logDataService.RegisterUserAuth(data.logAuthUser);

                return StatusCode(StatusCodes.Status201Created, new { message = "Register Succesfully", status = 201, token, idUser = userCreated.Id });

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }

        //Inicio de Sesion
        [HttpPost]
        [Route("Login")]

        public IActionResult Login([FromBody] InfoLogin data)
        {
            try
            {
                LoginModel usuario = data.usuario;
                LogAuthUser logAuthUser = data.logAuthUser;

                Usuario usuarioDb = _dbContext.Usuarios.FirstOrDefault(u => u.Correo == usuario.Correo);

                if (usuarioDb != null)
                {
                    LogUsuario logUsuario = new LogUsuario();

                    if (usuarioDb.Contrasenia != usuario.Contrasenia)
                    {
                        logUsuario.IdUsuario = usuarioDb.Id;
                        logUsuario.TipoAccion = 5;
                        logUsuario.FechaAccion = DateTime.Now;

                        int logAU2 = _logDataService.CreateLogAcccionUsuario(logUsuario);

                        logAuthUser.Log = logAU2;
                        logAuthUser.Fecha = DateTime.Now;
                        logAuthUser.TipoAccion = 5;

                        _logDataService.RegisterUserAuth(logAuthUser);

                        return StatusCode(StatusCodes.Status403Forbidden, new { message = "Incorrect Password.", status = 403 });
                    }

                    logUsuario.IdUsuario = usuarioDb.Id;
                    logUsuario.TipoAccion = 1;
                    logUsuario.FechaAccion = DateTime.Now;

                    int logAU1 = _logDataService.CreateLogAcccionUsuario(logUsuario);

                    logAuthUser.Log = logAU1;
                    logAuthUser.Fecha = DateTime.Now;
                    logAuthUser.TipoAccion = 1;

                    _logDataService.RegisterUserAuth(logAuthUser);

                    return StatusCode(StatusCodes.Status200OK, new
                    {
                        message = $"Login successfully. Welcome {usuarioDb.Nombre}",
                        token = Jwt.GenerateToken(usuarioDb),
                        status = 200,
                    });
                }

                return StatusCode(StatusCodes.Status400BadRequest, new { message = "User does not exists", status = 400 });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }

        //Logout
        [HttpPost]
        [Route("Logout")]

        public IActionResult Logout(LogAuthUser logAuthUser)
        {
            try
            {
                Usuario usuarioDB = _dbContext.Usuarios.FirstOrDefault(u => u.Id == logAuthUser.Usuario);

                if (usuarioDB != null)
                {
                    LogUsuario logUsuario = new LogUsuario();
                    logUsuario.IdUsuario = usuarioDB.Id;
                    logUsuario.TipoAccion = 2;
                    logUsuario.FechaAccion = DateTime.Now;

                    int log = _logDataService.CreateLogAcccionUsuario(logUsuario);

                    logAuthUser.Log = log;
                    logAuthUser.Fecha = DateTime.Now;
                    logAuthUser.TipoAccion = 5;

                    _logDataService.RegisterUserAuth(logAuthUser);

                    return StatusCode(StatusCodes.Status200OK, new
                    {
                        message = $"Bye {usuarioDB.Nombre}",
                        status = 200
                    });
                }

                return StatusCode(StatusCodes.Status400BadRequest, new { message = "Invalid Payload" });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }

        //ADMIN PROCEDURES
        [HttpGet]
        [Route("GetAll")]
        public IActionResult GetAll()
        {
            try
            {
                string token = HttpContext.Request.Headers["Authorization"].ToString();

                bool isValidToken = Jwt.ValidateToken(token, true);

                if (!isValidToken)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "You are not authorized!" });
                }

                List<Usuario> data = _usersDataService.GetAllUsers();

                return StatusCode(StatusCodes.Status200OK, new
                {
                    message = "Success",
                    status = 200,
                    response = data
                });


            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status200OK, new
                {
                    message = ex.Message,
                    status = 200,
                    response = new List<dynamic>()
                });
            }
        }

        //Create User
        [HttpPost]
        [Route("Create")]
        public IActionResult CreateUser([FromBody] Usuario usuario)
        {
            try
            {
                string token = HttpContext.Request.Headers["Authorization"].ToString();

                bool isValidToken = Jwt.ValidateToken(token, true);

                if (!isValidToken)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "You are not authorized!" });
                }

                Usuario userExist = _dbContext.Usuarios.FirstOrDefault(u => u.Correo == usuario.Correo);

                if (userExist != null)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, new { message = "The email is already registered.", status = 400 });
                }

                _usersDataService.CreateUser(usuario);

                return StatusCode(StatusCodes.Status200OK, new
                {
                    message = "User created successfully",
                    status = 200
                });

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    message = ex.Message,
                    status = 200,
                    response = new List<dynamic>()
                });
            }
        }

        [HttpGet]
        [Route("GetById/{id:int}")]
        public IActionResult GetById(int id)
        {
            try
            {
                string token = HttpContext.Request.Headers["Authorization"].ToString();

                bool isValidToken = Jwt.ValidateToken(token);

                if (!isValidToken)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "You are not authorized!" });
                }

                Usuario usuario = _usersDataService.GetById(id);

                if (usuario.Id == 0)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, new
                    {
                        message = "User does not exists",
                        status = 400
                    });
                }

                return StatusCode(StatusCodes.Status200OK, new
                {
                    message = "Sucess",
                    response = usuario,
                    status = 200
                });

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    message = ex.Message,
                    status = 200,
                    response = new List<dynamic>()
                });
            }
        }

        //Edit User
        [HttpPut]
        [Route("Edit/{id:int}")]
        public IActionResult Edit([FromBody] Usuario usuario, int id)
        {
            try
            {
                string token = HttpContext.Request.Headers["Authorization"].ToString();

                bool isValidToken = Jwt.ValidateToken(token);

                if (!isValidToken)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "You are not authorized!" });
                }

                Usuario userExist = _dbContext.Usuarios.FirstOrDefault(u => u.Id == id);

                if (userExist == null)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, new { message = "The user does not exists", status = 400 });
                }

                _usersDataService.EditUser(usuario, id);

                return StatusCode(StatusCodes.Status200OK, new
                {
                    message = "User updated successfully",
                    status = 200
                });

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    message = ex.Message,
                    status = 200,
                    response = new List<dynamic>()
                });
            }
        }

        // Delete User
        [HttpDelete]
        [Route("Delete/{id:int}")]
        public IActionResult Delete(int id)
        {
            try
            {
                string token = HttpContext.Request.Headers["Authorization"].ToString();

                bool isValidToken = Jwt.ValidateToken(token, true);

                if (!isValidToken)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "You are not authorized!" });
                }

                _usersDataService.DeleteUser(id);


                return StatusCode(StatusCodes.Status200OK, new
                {
                    message = "User deleted successfully",
                    status = 200
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status200OK, new
                {
                    message = ex.Message
                });
            }
        }

    }
}
