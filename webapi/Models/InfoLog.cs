namespace webapi.Models
{
    public partial class InfoLog
    {
        public int Id { get; set; }
        public string Descripcion { get; set; }
        public int TipoAccion { get; set; }
        public string Label { get; set; }
        public DateTime Fecha { get; set; }
    }
}
