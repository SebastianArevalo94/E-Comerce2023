using System;
using System.Collections.Generic;

namespace ShopAppAPI.Models;

public partial class CreditCard
{
    public int Id { get; set; }
    public string CardHolder { get; set; }
    public string Numero { get; set; }
    public DateTime Expira { get; set; }
    public int CCV { get; set; }
    public string Tipo { get; set; }
    public int Id_user { get; set; }
}