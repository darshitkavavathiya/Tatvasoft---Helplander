using System.ComponentModel.DataAnnotations;

namespace Helperland.ViewModel
{
    public class PostalCode
    {
        [Required]
        [StringLength(6, ErrorMessage = "Please Enter Valid Postal Code", MinimumLength = 6)]
        public string postalcode { get; set; }
    }
}
