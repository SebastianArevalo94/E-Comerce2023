using System;
using System.Collections.Generic;

namespace ShopAppAPI.Models;

public partial class LogUsuario
{
    public int Id { get; set; }

    public int IdUsuario { get; set; }

    public int TipoAccion { get; set; }

    public DateTime FechaAccion { get; set; }
}
