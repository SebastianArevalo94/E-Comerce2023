using System;
using System.Collections.Generic;
using webapi.Models;

namespace ShopAppAPI.Models;

public partial class AdminInfoLog
{
    public int Id { get; set; }
    public string Descripcion { get; set; }
    public int TipoAccion { get; set; }
    public string Label { get; set; }
    public DateTime Fecha { get; set; }
    public UserInfo user { get; set; }
}
