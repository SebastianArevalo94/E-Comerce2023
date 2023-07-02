﻿using Microsoft.AspNetCore.Http;
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
    public class LogController : ControllerBase
    {
        private readonly ShopAppContext _dbContext;
        private readonly ProductsDataService _productsDataService;
        private readonly UsersDataservice _usersDataService;
        private readonly LogDataService _logDataService;

        public LogController(ShopAppContext dbContext)
        {
            _dbContext = dbContext;
            _productsDataService = new ProductsDataService(_dbContext);
            _usersDataService = new UsersDataservice(_dbContext);
            _logDataService = new LogDataService(_dbContext);
        }

        [HttpGet]
        [Route("GetLogByUser/{user:int}")]
        public IActionResult GetLogByUser(int user)
        {
            try
            {
                string token = HttpContext.Request.Headers["Authorization"].ToString();

                bool isValidToken = Jwt.ValidateToken(token);

                if (!isValidToken)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "You are not authorized!" });
                }

                List<InfoLog> logUser = _logDataService.GetLogByUser(user);

                return StatusCode(StatusCodes.Status200OK, new
                {
                    message = "Sucess Get Log Users",
                    results = logUser,
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

        [HttpGet]
        [Route("GetLogUserAuthBylog/{log:int}")]
        public IActionResult GetLogUserAuthBylog(int log)
        {
            try
            {
                string token = HttpContext.Request.Headers["Authorization"].ToString();

                bool isValidToken = Jwt.ValidateToken(token);

                if (!isValidToken)
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new { message = "You are not authorized!" });
                }

                LogAuthUser logUser = _logDataService.GetLogUserAuthBylog(log);

                return StatusCode(StatusCodes.Status200OK, new
                {
                    message = "Sucess Get Log Users",
                    results = logUser,
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