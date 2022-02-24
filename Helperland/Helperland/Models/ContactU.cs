using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


#nullable disable

namespace Helperland.Models
{
    public partial class ContactU
    {

        public int ContactUsId { get; set; }
        [Required]
        public string Name { get; set; }
        [NotMapped]
        [Required]
        public string lastName { get; set; }
        [Required]
        [DataType(DataType.EmailAddress, ErrorMessage = "E-mail is not valid")]
        public string Email { get; set; }
        public string Subject { get; set; }
        [Required]
        [StringLength(10, ErrorMessage = "Please Enter Valid Phone No")]
        public string PhoneNumber { get; set; }
        public string Message { get; set; }
        public string UploadFileName { get; set; }
        public DateTime? CreatedOn { get; set; }
        public int? CreatedBy { get; set; }
        public string FileName { get; set; }

        [NotMapped]
        public IFormFile Attach { get; set; }
        


    }
}
