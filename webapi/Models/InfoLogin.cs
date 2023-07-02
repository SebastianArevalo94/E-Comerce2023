using ShopAppAPI.Models;

namespace webapi.Models
{
    public partial class InfoLogin
    {
        public LoginModel usuario { get; set; } 
        public LogAuthUser logAuthUser { get; set; }
    }
}
