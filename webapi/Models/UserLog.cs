namespace webapi.Models
{
    public partial class UserLog
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Correo{ get; set;}
        public string Foto { get; set; }
        public int Rol { get; set; }
        public string Direccion { get; set; }
        public string Documento { get; set; }

    }
}
