using System;
using System.Collections.Generic;

namespace ShopAppAPI.Models;

public partial class Categoria
{
    public int Id { get; set; }
    public int Codigo { get; set; }

    public string Nombre { get; set; } = null!;
}
