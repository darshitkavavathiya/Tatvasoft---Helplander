using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
namespace Helperland.Models

{
    public class ResetPassword
    {
        public int userId { get; set; }

        public string password { get; set; }

      
    }
}
