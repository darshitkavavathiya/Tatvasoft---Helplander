using Helperland.Models;
using Helperland.Models.Data;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MimeKit;
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

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Login(LoginUser user)
        {
            if (ModelState.IsValid)
            {
                if (_db.Users.Where(x => x.Email == user.username && x.Password == user.password).Count() > 0)
                {

                    var U = _db.Users.FirstOrDefault(x => x.Email == user.username);
                    HttpContext.Session.SetInt32("id", U.UserId);

                    return RedirectToAction("CustomerServiceHistory", "Customer");
                }
                else
                {
                    TempData["add"] = "alert show";
                    TempData["fail"] = "username and password are invalid";
                    return RedirectToAction("Index", "Public", new { loginFail = "true" });

                }
            }

            TempData["add"] = "alert show";
            TempData["fail"] = "username and password are required";
            return RedirectToAction("Index", "Public", new { loginModal = "true" });

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

                    TempData["add"] = "alert show";
                    TempData["msg"] = "Account created, Please Login";
                    return RedirectToAction("Index", "Public", new { loginModal = "true" });
                }
                else
                {
                    TempData["add"] = "alert show";
                    TempData["msg"] = "Username Exits!";
                    return View();


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

                    TempData["add"] = "alert show";
                    TempData["msg"] = "Account created, Wait for admin approval";
                    return RedirectToAction("Index", "Public");

                }
                else
                {
                    TempData["add"] = "alert show";
                    TempData["msg"] = "Username Exits!";
                    return View();
                    


                }

            }
            return View();
        }


        [HttpPost]
        public IActionResult SendMail(string email)
        {

            if (email != null)
            {
                var user = _db.Users.FirstOrDefault(x => x.Email == email);


                MimeMessage message = new MimeMessage();

                MailboxAddress from = new MailboxAddress("Helperland",
                "darshit2669@gmail.com");
                message.From.Add(from);

                MailboxAddress to = new MailboxAddress(user.FirstName, email);
                message.To.Add(to);

                message.Subject = "Reset Password";

                BodyBuilder bodyBuilder = new BodyBuilder();
                bodyBuilder.HtmlBody = "<h1>Reset your password by click below link</h1>" +
                    "<a href='" + Url.Action("ResetPassword", "UserManagement", new { userId = user.UserId }, "http") + "'>Reset Password</a>";
                

                message.Body = bodyBuilder.ToMessageBody();

                SmtpClient client = new SmtpClient();
                client.Connect("smtp.gmail.com", 587, false);
                client.Authenticate("vedantjotangiya@gmail.com", "Vedantjot@123");
                client.Send(message);
                client.Disconnect(true);
                client.Dispose();
                return RedirectToAction("Index", "Public", new { mailSended = "true" });
            }
            return RedirectToAction("Index", "Public");
        }


        [HttpGet]
        public IActionResult ResetPassword(int userId)
        {
            TempData["id"] = userId;
            return PartialView();
        }

        [HttpPost]
        public IActionResult ResetPassword(ResetPassword rp)
        {
            
                var user = new User() { UserId = rp.userId, Password = rp.password, ModifiedDate = DateTime.Now };
                _db.Users.Attach(user);
                _db.Entry(user).Property(x => x.Password).IsModified = true;
                _db.SaveChanges();


                return RedirectToAction("Index", "Public", new { loginModal = "true" });
         
        }
    } 
}
