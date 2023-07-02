using System;
using System.Collections.Generic;

namespace ShopAppAPI.Models;

public partial class AccionesUsuario
{
    public int TipoAccion { get; set; }

    public string Nombre { get; set; } = null!;
}
