using ShopAppAPI.Models;

namespace webapi.Models
{
    public partial class GenerateFactura
    {
        public List<Producto_Comprado> products { get; set; }
        public int usuario { get; set; }
        public int metodoPago { get; set; }
        public string direccion_envio { get; set; }
    }
}
