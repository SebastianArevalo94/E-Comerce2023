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
    public class CreditCardController : ControllerBase
    {
        private readonly ShopAppContext _dbContext;
        private readonly ProductsDataService _productsDataService;
        private readonly UsersDataservice _usersDataService;
        private readonly CreditCardDataService _creditCardDataService;

        public CreditCardController(ShopAppContext dbContext)
        {
            _dbContext = dbContext;
            _productsDataService = new ProductsDataService(_dbContext);
            _usersDataService = new UsersDataservice(_dbContext);
            _creditCardDataService = new CreditCardDataService(_dbContext);
        }

        // Create Credit Card
        [HttpPost]
        [Route("CreateCC")]
        public IActionResult CreateCC([FromBody] CreditCard creditCard)
        {
            try
            {
                string token = HttpContext.Request.Headers["Authorization"].ToString();

                bool isValidToken = Jwt.ValidateToken(token);

                if (!isValidToken)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "You are not authorized!" });
                }

                _creditCardDataService.CreateCC(creditCard);

                return StatusCode(StatusCodes.Status200OK, new
                {
                    message = "Credit Card created successfully",
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

        // Edit Credit Card
        [HttpPut]
        [Route("EditCC/{Id:int}")]
        public IActionResult EditCC([FromBody] CreditCard creditCard, int Id)
        {
            try
            {
                string token = HttpContext.Request.Headers["Authorization"].ToString();

                bool isValidToken = Jwt.ValidateToken(token);

                if (!isValidToken)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "You are not authorized!" });
                }

                _creditCardDataService.EditCC(creditCard, Id);

                return StatusCode(StatusCodes.Status200OK, new
                {
                    message = "Credit updated created successfully",
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

        // Delete Credit Card
        [HttpDelete]
        [Route("DeleteCC/{Id:int}")]
        public IActionResult DeleteCC(int Id)
        {
            try
            {
                string token = HttpContext.Request.Headers["Authorization"].ToString();

                bool isValidToken = Jwt.ValidateToken(token);

                if (!isValidToken)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "You are not authorized!" });
                }

                _creditCardDataService.DeleteCC(Id);

                return StatusCode(StatusCodes.Status200OK, new
                {
                    message = "Credit deleted successfully",
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

        [HttpGet]
        [Route("GetCCByUser/{Id:int}")]
        public IActionResult GetCCByUser(int id)
        {
            try
            {
                string token = HttpContext.Request.Headers["Authorization"].ToString();

                bool isValidToken = Jwt.ValidateToken(token);

                if (!isValidToken)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "You are not authorized!" });
                }

                List<CreditCard> results = _creditCardDataService.GetCCByUser(id);

                return StatusCode(StatusCodes.Status200OK, new
                {
                    results,
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

        [HttpGet]
        [Route("GetCCById/{Id:int}")]
        public IActionResult GetCCById(int id)
        {
            try
            {
                string token = HttpContext.Request.Headers["Authorization"].ToString();

                bool isValidToken = Jwt.ValidateToken(token);

                if (!isValidToken)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "You are not authorized!" });
                }

                CreditCard creditCard = _creditCardDataService.GetCCById(id);


                return StatusCode(StatusCodes.Status200OK, new
                {
                    results = creditCard,
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