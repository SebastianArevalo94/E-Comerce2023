using System;
using System.Collections.Generic;

namespace ShopAppAPI.Models;

public partial class FilterAdminLog
{
    public int filter { get; set; }
    public int type { get; set; }
    public int user { get; set; }
    public string order { get; set; }
}
