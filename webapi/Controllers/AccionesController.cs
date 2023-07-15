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
    public class AccionesController : ControllerBase
    {
        private readonly ShopAppContext _dbContext;
        private readonly AccionesDataService _accionesDataService;

        public AccionesController(ShopAppContext dbContext)
        {
            _dbContext = dbContext;
            _accionesDataService = new AccionesDataService(_dbContext);
        }

        [HttpGet]
        [Route("GetTipoAcciones")]
        public IActionResult GetTipoAcciones()
        {
            try
            {
                string token = HttpContext.Request.Headers["Authorization"].ToString();

                bool isValidToken = Jwt.ValidateToken(token);

                if (!isValidToken)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "You are not authorized!" });
                }

                List<AccionesUsuario> data = _accionesDataService.GetTipoAcciones();

                return StatusCode(StatusCodes.Status200OK, new
                {
                    message = "Success",
                    response = data,
                    status = 200
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    message = ex.Message,
                    status = 500
                });
            }
        }

    }
}