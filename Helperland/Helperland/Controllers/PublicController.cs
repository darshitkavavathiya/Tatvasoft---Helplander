using Helperland.Models;
using Helperland.Models.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;

using Microsoft.AspNetCore.Http;


namespace Helperland.Controllers
{
    public class PublicController : Controller
    {
        private readonly ILogger<PublicController> _logger;
       
        private readonly HelperlandContext _db;
        private readonly IWebHostEnvironment _webHostEnv;

        public PublicController(HelperlandContext db, IWebHostEnvironment webHostEnv , ILogger<PublicController> logger)
        {
            _db = db;
            _webHostEnv = webHostEnv;
            _logger = logger;
        }

      

        public IActionResult Index()
        {
            if (HttpContext.Session.GetInt32("userId") != null)
            {
                var id = HttpContext.Session.GetInt32("userId");
                User user = _db.Users.Find(id);
                ViewBag.Name = user.FirstName;
                ViewBag.UserType = user.UserTypeId;
               
            }
            else if (Request.Cookies["userId"] != null)
            {
                var user = _db.Users.FirstOrDefault(x => x.UserId == Convert.ToInt32(Request.Cookies["userId"]));
                ViewBag.Name = user.FirstName;
                ViewBag.UserType = user.UserTypeId;
            }
            return View();
        }

        public IActionResult Price()
        {
            if (HttpContext.Session.GetInt32("userId") != null)
            {
                var id = HttpContext.Session.GetInt32("userId");
                User user = _db.Users.Find(id);
                ViewBag.Name = user.FirstName;
                ViewBag.UserType = user.UserTypeId;

            }
            else if (Request.Cookies["userId"] != null)
            {
                var user = _db.Users.FirstOrDefault(x => x.UserId == Convert.ToInt32(Request.Cookies["userId"]));
                ViewBag.Name = user.FirstName;
                ViewBag.UserType = user.UserTypeId;
            }
            return View();
        }

        public IActionResult Contact()
        {
            if (HttpContext.Session.GetInt32("userId") != null)
            {
                var id = HttpContext.Session.GetInt32("userId");
                User user = _db.Users.Find(id);
                ViewBag.Name = user.FirstName;
                ViewBag.UserType = user.UserTypeId;

            }
            else if (Request.Cookies["userId"] != null)
            {
                var user = _db.Users.FirstOrDefault(x => x.UserId == Convert.ToInt32(Request.Cookies["userId"]));
                ViewBag.Name = user.FirstName;
                ViewBag.UserType = user.UserTypeId;
            }
            return View();
        }
        [HttpPost]
        public IActionResult Contact(ContactU contact)
        {

            if (ModelState.IsValid)
            {
                if (contact.Attach != null)
                {
                    string folder = "ContactFile/";
                    folder += Guid.NewGuid().ToString() + "_" + contact.Attach.FileName;
                    string serverFolder = Path.Combine(_webHostEnv.WebRootPath, folder);
                    contact.Attach.CopyToAsync(new FileStream(serverFolder, FileMode.Create));
                    contact.FileName = folder;
                    contact.UploadFileName = contact.Attach.FileName;
                }
                contact.CreatedOn = DateTime.Now;
                _db.ContactUs.Add(contact);
                _db.SaveChanges();
                return RedirectToAction("Index", "Public", new { msgSent = "true" });
            }
            return View();

        }

        public IActionResult Faq()
        {
            if (HttpContext.Session.GetInt32("userId") != null)
            {
                var id = HttpContext.Session.GetInt32("userId");
                User user = _db.Users.Find(id);
                ViewBag.Name = user.FirstName;
                ViewBag.UserType = user.UserTypeId;
        
            }
            else if (Request.Cookies["userId"] != null)
            {
                var user = _db.Users.FirstOrDefault(x => x.UserId == Convert.ToInt32(Request.Cookies["userId"]));
                ViewBag.Name = user.FirstName;
                ViewBag.UserType = user.UserTypeId;
            
            }
            return View();
        }

        public IActionResult About()
        {
            if (HttpContext.Session.GetInt32("userId") != null)
            {
                var id = HttpContext.Session.GetInt32("userId");
                User user = _db.Users.Find(id);
                ViewBag.Name = user.FirstName;
                ViewBag.UserType = user.UserTypeId;

            }
            else if (Request.Cookies["userId"] != null)
            {
                var user = _db.Users.FirstOrDefault(x => x.UserId == Convert.ToInt32(Request.Cookies["userId"]));
                ViewBag.Name = user.FirstName;
                ViewBag.UserType = user.UserTypeId;
            }
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
