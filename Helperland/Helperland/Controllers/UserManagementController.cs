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

                string password = _db.Users.FirstOrDefault(x => x.Email == user.username).Password;

                bool pass = BCrypt.Net.BCrypt.Verify(user.password, password);
                if (_db.Users.Where(x => x.Email == user.username && pass).Count() > 0)
                {

                    var U = _db.Users.FirstOrDefault(x => x.Email == user.username);





                    ViewBag.Name = null;


                    if (U.UserTypeId == 0)
                    {
                        if (user.remember == true)
                        {
                            CookieOptions cookieRemember = new CookieOptions();
                            cookieRemember.Expires = DateTime.Now.AddSeconds(604800);
                            Response.Cookies.Append("userId", Convert.ToString(U.UserId), cookieRemember);
                        }


                        HttpContext.Session.SetInt32("userId", U.UserId);


                        return RedirectToAction("CustomerDashboard", "Customer");
                    }
                    else if (U.UserTypeId == 1)
                    {
                        if (U.IsApproved == false)
                        {
                            ViewBag.Name = null;
                            TempData["add"] = "alert show";
                            TempData["fail"] = "You are not approved by admin, please contact admin.";
                            return RedirectToAction("Index", "Public", new { loginModal = "true" });
                        }

                        if (user.remember == true)
                        {
                            CookieOptions cookieRemember = new CookieOptions();
                            cookieRemember.Expires = DateTime.Now.AddSeconds(604800);
                            Response.Cookies.Append("userId", Convert.ToString(U.UserId), cookieRemember);
                        }


                        HttpContext.Session.SetInt32("userId", U.UserId);


                        return RedirectToAction("SPServiceRequest", "Serviceprovider");
                    }
                    else if (U.UserTypeId == 2)
                    {
                        if (user.remember == true)
                        {
                            CookieOptions cookieRemember = new CookieOptions();
                            cookieRemember.Expires = DateTime.Now.AddSeconds(604800);
                            Response.Cookies.Append("userId", Convert.ToString(U.UserId), cookieRemember);
                        }


                        HttpContext.Session.SetInt32("userId", U.UserId);

                        return RedirectToAction("AdminPanel", "Admin");
                    }

                    //return RedirectToAction("CustomerDashboard", "Customer");
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


        public IActionResult logout()
        {
            HttpContext.Session.Clear();

            Response.Cookies.Delete("userId");
            return RedirectToAction("Index", "Public", new { logoutModal = "true" });
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
                    user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
                    user.IsApproved = true;
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
                    user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
                    user.IsApproved = true;
                    user.UserProfilePicture = "cap.png";
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
                "darshitkavathiya34@gmail.com");
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
                client.Authenticate("darshitkavathiya34@gmail.com", "Dar@1234");
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
            rp.password = BCrypt.Net.BCrypt.HashPassword(rp.password);
            var user = new User() { UserId = rp.userId, Password = rp.password, ModifiedDate = DateTime.Now };
            _db.Users.Attach(user);
            _db.Entry(user).Property(x => x.Password).IsModified = true;
            _db.SaveChanges();


            return RedirectToAction("Index", "Public", new { loginModal = "true" });

        }
    }
}
