using ShopAppAPI.Models;

namespace webapi.Models
{
    public partial class InfoFactura
    {
        public int Id_Factura { get; set; }
        public int Id_Usuario { get; set; }
        public DateTime FechaCompra { get; set; }
        public int MetodoPago { get; set; }
        public string LabelMetodoPago { get; set; }
        public string Id_Compra { get; set; }
        public string Direccion_Envio { get; set; }
        public List<InfoProducto> Productos { get; set; }
        public double TotalFacturado { get; set; }
        public string NombreCompleto { get; set; }
        public string Documento { get; set; }
        public string Correo { get; set; }
    }
}
