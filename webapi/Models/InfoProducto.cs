namespace webapi.Models
{
    public partial class InfoProducto
    {
        public int Id { get; set; }
        public string Nombre { get; set; }

        public double Precio { get; set; }
        public string Descripcion { get; set; }
        public string Categoria { get; set; }
        public string Foto { get; set; }
        public int Unidades { get; set; }
        public double SubTotal { get; set; }
    }
}