using System;
using System.Collections.Generic;

namespace ShopAppAPI.Models;

public partial class Producto_Comprado
{
    public int Id_pc { get; set; }
    public string Id_Compra { get; set; }
    public int Id_Usuario { get; set; }
    public int Id_Producto { get; set; }
    public int Unidades { get; set; }
    public float Facturado { get; set; }
}