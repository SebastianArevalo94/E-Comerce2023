using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopAppAPI.Models;
using System.Security.Claims;
using Newtonsoft.Json;
using System.Diagnostics.Contracts;
using webapi.DataServices;
using webapi.Models;

namespace ShopAppAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FacturasController : ControllerBase
    {
        private readonly ShopAppContext _dbContext;
        private readonly UsersDataservice _usersDataService;
        private readonly FacturasDataService _facturasDataService;
        private readonly LogDataService _logDataService;
        private readonly IConfiguration _configuration;

        public FacturasController(ShopAppContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
            _usersDataService = new UsersDataservice(_dbContext, _configuration);
            _facturasDataService = new FacturasDataService(_dbContext, _configuration);
            _configuration = configuration;
            _logDataService = new LogDataService(_dbContext, _configuration);
        }

        //Comprar y generar factura
        [HttpPost]
        [Route("GenerarFactura")]
        public IActionResult GenerarFactura([FromBody] GenerateFactura newFactura)
        {
            try
            {
                string token = HttpContext.Request.Headers["Authorization"].ToString();

                bool isValidToken = Jwt.ValidateToken(token);

                if (!isValidToken)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "You are not authorized!" });
                }

                string id_compra = Guid.NewGuid().ToString();

                foreach (Producto_Comprado pc in newFactura.products)
                {
                    pc.Id_Compra = id_compra;
                }

                Factura factura = new Factura()
                {
                    Id_Usuario = newFactura.usuario,
                    FechaCompra = DateTime.Now,
                    MetodoPago = newFactura.metodoPago,
                    Id_Compra = id_compra,
                    Direccion_Envio = newFactura.direccion_envio
                };

                int id_factura = _facturasDataService.GenerarFactura(newFactura.products, factura);

                LogUsuario logUsuario = new LogUsuario()
                {
                    IdUsuario = newFactura.usuario,
                    TipoAccion = 6,
                    FechaAccion = DateTime.Now,
                };

                int log = _logDataService.CreateLogAcccionUsuario(logUsuario);

                Compras_Usuario compraUsuario = new Compras_Usuario()
                {
                    Log = log,
                    Factura = id_factura,
                    Usuario = newFactura.usuario,
                    Fecha = DateTime.Now,
                };

                _usersDataService.CreateUsuarioCompra(compraUsuario);

                return StatusCode(StatusCodes.Status201Created, new
                {
                    message = "Compra realizada correctamente.",
                    status = 200
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    message = "Error creating product",
                    response = ex.Message,
                    status = 500
                });
            }
        }

        // Obtener Facturas / Historial de compras por usuario
        [HttpGet]
        [Route("GetFacturasByUser/{usuario:int}")]
        public IActionResult GetFacturasByUser(int usuario)
        {
            try
            {
                string token = HttpContext.Request.Headers["Authorization"].ToString();

                bool isValidToken = Jwt.ValidateToken(token);

                if (!isValidToken)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "You are not authorized!" });
                }

                List<InfoFactura> result = _facturasDataService.GetFacturasByUser(usuario);

                return StatusCode(StatusCodes.Status201Created, new
                {
                    message = "Get Facturas Success",
                    status = 200,
                    result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    message = "Error get",
                    response = ex.Message,
                    status = 500
                });
            }
        }

        // Obtener Facturas / Historial de compras por usuario
        [HttpGet]
        [Route("GetFacturaBylog/{log:int}")]
        public IActionResult GetFacturaBylog(int log)
        {
            try
            {
                string token = HttpContext.Request.Headers["Authorization"].ToString();

                bool isValidToken = Jwt.ValidateToken(token);

                if (!isValidToken)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "You are not authorized!" });
                }

                InfoFactura result = _facturasDataService.GetFacturaByLog(log);

                return StatusCode(StatusCodes.Status201Created, new
                {
                    message = "Get Facturas Success",
                    status = 200,
                    result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    message = "Error get",
                    response = ex.Message,
                    status = 500
                });
            }
        }
    }
}
