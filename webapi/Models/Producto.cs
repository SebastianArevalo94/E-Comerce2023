using System;
using System.Collections.Generic;

namespace ShopAppAPI.Models;

public partial class Producto
{
    public int Id { get; set; }

    public string Nombre { get; set; } = null!;

    public double? Precio { get; set; }

    public string? Descripcion { get; set; }

    public int Categoria { get; set; }

    public string? Foto { get; set; }

    public int Cantidad { get; set; }
}
