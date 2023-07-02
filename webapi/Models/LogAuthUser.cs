namespace webapi.Models
{
    public partial class LogAuthUser
    {
        public int Id { get; set; }
        public int Log { get; set; }
        public int TipoAccion { get; set; }
        public int Usuario { get; set; }
        public double Latitud { get; set; }
        public double Longitud { get; set; }
        public DateTime Fecha { get; set; }
        public string Ip { get; set; }
        public string Pais { get; set; }
        public string Ciudad { get; set; }
    }
}
