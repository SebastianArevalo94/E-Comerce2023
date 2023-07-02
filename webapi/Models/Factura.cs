using System;
using System.Collections.Generic;

namespace ShopAppAPI.Models;

public partial class Factura
{
    public int Id_Factura { get; set; }
    public int Id_Usuario { get; set; }
    public DateTime FechaCompra { get; set; }
    public int MetodoPago { get; set; }
    public string Id_Compra { get; set; }
    public string Direccion_Envio { get; set; }
}