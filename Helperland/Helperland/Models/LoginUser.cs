
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
namespace Helperland.Models
{



    public class LoginUser
    {
        [Required]
        public string username { get; set; }
        [Required]
        public string password { get; set; }
        public bool remember { get; set; }
    }

}
