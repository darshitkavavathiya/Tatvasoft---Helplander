using Helperland.Models;
using Helperland.Models.Data;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;

namespace Helperland.Controllers
{
    public class UserManagementController : Controller
    {
        private readonly HelperlandContext _db;

        public UserManagementController(HelperlandContext db)
        {
            _db = db;
        }

        public IActionResult CustomerSignUp()
        {
            return View();
        }
        [ValidateAntiForgeryToken]
        [HttpPost]
        public IActionResult CustomerSignUp(User user)
        {
            if (ModelState.IsValid)
            {
                if ((_db.Users.Where(x => x.Email == user.Email).Count() == 0 && _db.Users.Where(x => x.Mobile == user.Mobile).Count() == 0))
                {
                    user.CreatedDate = DateTime.Now;
                    user.ModifiedDate = DateTime.Now;
                    user.UserTypeId = 0;
                    user.IsRegisteredUser = true;
                    user.ModifiedBy = 152;

                    _db.Users.Add(user);
                    _db.SaveChanges();
                    return RedirectToAction("Index", "Public");
                }
                else
                {
                    ViewBag.message = "User already exist.";
                    return RedirectToAction("Index", "Public");


                }

            }
            return View();
        }






        public IActionResult BecomeAProvider()
        {
            return View();
        }
        [ValidateAntiForgeryToken]
        [HttpPost]
        public IActionResult BecomeAProvider(User user)
        {
            if (ModelState.IsValid)
            {
                if ((_db.Users.Where(x => x.Email == user.Email).Count() == 0 && _db.Users.Where(x => x.Mobile == user.Mobile).Count() == 0))
                {
                    user.CreatedDate = DateTime.Now;
                    user.ModifiedDate = DateTime.Now;
                    user.UserTypeId = 1;
                    user.IsRegisteredUser = true;
                    user.ModifiedBy = 152;

                    _db.Users.Add(user);
                    _db.SaveChanges();
                    return RedirectToAction("Index", "Public");
                }
                else
                {
                    ViewBag.message = "User already exist.";
                    return RedirectToAction("Index", "Public");


                }

            }
            return View();
        }
    } 
}
