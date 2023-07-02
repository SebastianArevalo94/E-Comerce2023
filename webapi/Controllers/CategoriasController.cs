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
    public class CategoriasController : ControllerBase
    {
        private readonly ShopAppContext _dbContext;
        private readonly ProductsDataService _productsDataService;
        private readonly UsersDataservice _usersDataService;
        private readonly CreditCardDataService _creditCardDataService;
        private readonly CategoryDataService _categoryDataService;

        public CategoriasController(ShopAppContext dbContext)
        {
            _dbContext = dbContext;
            _productsDataService = new ProductsDataService(_dbContext);
            _usersDataService = new UsersDataservice(_dbContext);
            _creditCardDataService = new CreditCardDataService(_dbContext);
            _categoryDataService = new CategoryDataService(_dbContext);
        }

        //Get All Categories
        [HttpGet]
        [Route("GetCategories")]
        public IActionResult GetCategories()
        {
            try
            {
                string token = HttpContext.Request.Headers["Authorization"].ToString();

                bool isValidToken = Jwt.ValidateToken(token);

                if (!isValidToken)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "You are not authorized!" });
                }

                List<Categoria> data = _categoryDataService.GetAllCategories();

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

        //Get One Category
        [HttpGet]
        [Route("GetOneCategory/{codigo:int}")]
        public IActionResult GetOneCategory(int codigo)
        {
            try
            {
                string token = HttpContext.Request.Headers["Authorization"].ToString();

                bool isValidToken = Jwt.ValidateToken(token);

                if (!isValidToken)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "You are not authorized!" });
                }

                Categoria categoria = _categoryDataService.GetOneCategory(codigo);

                if (categoria.Id == 0)
                {
                    return StatusCode(StatusCodes.Status404NotFound, new
                    {
                        message = "Category not found",
                        status = 404
                    });
                }

                return StatusCode(StatusCodes.Status200OK, new
                {
                    message = "Success",
                    response = categoria,
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

        //Get Category By Name
        [HttpGet]
        [Route("GetCategoryByName/{name}")]
        public IActionResult GetCategoryByName(string name)
        {
            try
            {
                string token = HttpContext.Request.Headers["Authorization"].ToString();

                bool isValidToken = Jwt.ValidateToken(token, true);

                if (!isValidToken)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "You are not authorized!" });
                }

                List<Categoria> categorias = _categoryDataService.GetCategoryByName(name);

                return StatusCode(StatusCodes.Status200OK, new
                {
                    message = "Success Data",
                    response = categorias,
                    status = 201
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

        //Create Category
        [HttpPost]
        [Route("CreateCategory")]
        public IActionResult CreateCategory([FromBody] Categoria categoria)
        {
            try
            {
                string token = HttpContext.Request.Headers["Authorization"].ToString();

                bool isValidToken = Jwt.ValidateToken(token, true);

                if (!isValidToken)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "You are not authorized!" });
                }

                _categoryDataService.CreateCategory(categoria);

                return StatusCode(StatusCodes.Status200OK, new
                {
                    message = "Category created successfully",
                    status = 201
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

        // Edit Category
        [HttpPut]
        [Route("EditCategory/{codigo:int}")]
        public IActionResult EditCategory([FromBody] Categoria categoria, int codigo)
        {
            try
            {
                string token = HttpContext.Request.Headers["Authorization"].ToString();

                bool isValidToken = Jwt.ValidateToken(token, true);

                if (!isValidToken)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "You are not authorized!" });
                }

                _categoryDataService.EditCategory(categoria, codigo);

                return StatusCode(StatusCodes.Status200OK, new
                {
                    message = "Category updated successfully",
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

        // Delete Product
        [HttpDelete]
        [Route("DeleteCategory/{codigo:int}")]
        public IActionResult DeleteCategory(int codigo)
        {
            try
            {
                string token = HttpContext.Request.Headers["Authorization"].ToString();

                bool isValidToken = Jwt.ValidateToken(token, true);

                if (!isValidToken)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "You are not authorized!" });
                }

                _categoryDataService.DeleteCategory(codigo);


                return StatusCode(StatusCodes.Status200OK, new
                {
                    message = "Category deleted successfully",
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

    }
}