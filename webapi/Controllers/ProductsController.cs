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
    public class ProductsController : ControllerBase
    {
        private readonly ShopAppContext _dbContext;
        private readonly ProductsDataService _productsDataService;
        private readonly UsersDataservice _usersDataService;
        private readonly IConfiguration _configuration;

        public ProductsController(ShopAppContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
            _productsDataService = new ProductsDataService(_dbContext, _configuration);
            _usersDataService = new UsersDataservice(_dbContext, _configuration);
        }

        #region Productos

        //Get All Products
        [HttpGet]
        [Route("GetAllProducts")]
        public IActionResult GetAll()
        {
            try
            {
                string token = HttpContext.Request.Headers["Authorization"].ToString();

                bool isValidToken = Jwt.ValidateToken(token);

                if (!isValidToken)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "You are not authorized!" });
                }

                string data = _productsDataService.GetAllProducts();

                return StatusCode(StatusCodes.Status200OK, new
                {
                    message = "Success",
                    response = data,
                    status = 200
                });

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status200OK, new
                {
                    message = ex.Message,
                    status = 500
                });
            }
        }

        //Get By Id
        [HttpGet]
        [Route("GetById/{id:int}")]
        public IActionResult GetById(int id)
        {
            string token = HttpContext.Request.Headers["Authorization"].ToString();

            bool isValidToken = Jwt.ValidateToken(token);

            if (!isValidToken)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new { message = "You are not authorized!" });
            }

            string data = _productsDataService.GetById(id);

            if (data == "No product Found")
            {
                return StatusCode(StatusCodes.Status404NotFound, new
                {
                    message = "No product Found"
                });
            }

            return StatusCode(StatusCodes.Status200OK, new { message = "Success", response = JsonConvert.DeserializeObject<Producto>(data) });

        }

        //Get By Category
        [HttpGet]
        [Route("GetByCategory/{categoria:int}")]
        public IActionResult GetByCategory(int categoria)
        {
            try
            {
                string token = HttpContext.Request.Headers["Authorization"].ToString();

                bool isValidToken = Jwt.ValidateToken(token);

                if (!isValidToken)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "You are not authorized!" });
                }

                string data = _productsDataService.GetByCategory(categoria);

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
                    response = "[]",
                    status = 500
                });
            }
        }

        //Get By Name
        [HttpGet]
        [Route("GetByName/{name}")]
        public IActionResult GetByName(string name)
        {
            try
            {
                string token = HttpContext.Request.Headers["Authorization"].ToString();

                bool isValidToken = Jwt.ValidateToken(token);

                if (!isValidToken)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "You are not authorized!" });
                }

                string data = _productsDataService.GetByName(name);

                return StatusCode(StatusCodes.Status200OK, new
                {
                    message = "Success",
                    response = data,
                    status = 200
                });

            }
            catch (Exception ex)
            {

                return StatusCode(StatusCodes.Status200OK, new
                {
                    message = ex.Message,
                    response = "[]",
                    StatusCode = 500
                });
            }
        }

        // Create Product
        [HttpPost]
        [Route("Create")]
        public IActionResult CreateProduct([FromBody] Producto producto)
        {
            try
            {
                string token = HttpContext.Request.Headers["Authorization"].ToString();

                bool isValidToken = Jwt.ValidateToken(token, true);

                if (!isValidToken)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "You are not authorized!" });
                }

                _productsDataService.Create(producto);

                return StatusCode(StatusCodes.Status201Created, new
                {
                    message = "Product created successfully",
                    status = 201
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

        // Edit Product
        [HttpPut]
        [Route("Edit/{id:int}")]
        public IActionResult EditProduct([FromBody] Producto producto, int id)
        {
            try
            {
                string token = HttpContext.Request.Headers["Authorization"].ToString();

                bool isValidToken = Jwt.ValidateToken(token, true);

                if (!isValidToken)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "You are not authorized!" });
                }

                _productsDataService.Edit(producto, id);

                return StatusCode(StatusCodes.Status201Created, new
                {
                    message = "Product updated successfully",
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    message = ex.Message
                });
            }
        }

        // Delete Product
        [HttpDelete]
        [Route("Delete/{id:int}")]
        public IActionResult DeleteProduct(int id)
        {
            try
            {
                string token = HttpContext.Request.Headers["Authorization"].ToString();

                bool isValidToken = Jwt.ValidateToken(token, true);

                if (!isValidToken)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "You are not authorized!" });
                }

                _productsDataService.Delete(id);


                return StatusCode(StatusCodes.Status200OK, new
                {
                    message = "Product deleted successfully",
                    status = 200
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    message = ex.Message
                });
            }
        }

        #endregion
    }

}
