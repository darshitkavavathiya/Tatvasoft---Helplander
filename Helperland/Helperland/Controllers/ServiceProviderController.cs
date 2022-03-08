using Helperland.Models;
using Helperland.Models.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;

namespace Helperland.Controllers
{
    public class ServiceProviderController : Controller
    {
        private readonly HelperlandContext _db;

        public ServiceProviderController(HelperlandContext db)
        {
            _db = db;
        }

        public IActionResult SPServiceRequest()
        {

            int? Id = HttpContext.Session.GetInt32("userId");
            if (Id == null)
            {
                Id = Convert.ToInt32(Request.Cookies["userId"]);
            }

            if (Id == null)
            {
                return RedirectToAction("Index", "Public", new { loginFail = "true" });
            }
            User user = _db.Users.FirstOrDefault(x => x.UserId == Id);
            int userTypeId = user.UserTypeId;
            if (userTypeId != 1)
            {
                return RedirectToAction("Index", "Public");

            }


            ViewBag.Name = user.FirstName;
            ViewBag.UserType = user.UserTypeId;

            return View();
        }
    }
}

