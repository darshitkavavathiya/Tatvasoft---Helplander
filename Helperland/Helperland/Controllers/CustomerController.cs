using Helperland.Models.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System;
using Helperland.Models;
using Helperland.ViewModel;
using System.Collections.Generic;

namespace Helperland.Controllers
{
    public class CustomerController : Controller
    {
        private readonly HelperlandContext _db;

        public CustomerController(HelperlandContext db)
        {
            _db = db;
        }
        public IActionResult CustomerServiceHistory()
        {




            if (HttpContext.Session.GetInt32("userId") != null)
            {
                var id = HttpContext.Session.GetInt32("userId");
                User user = _db.Users.Find(id);
                ViewBag.Name = user.FirstName;
                ViewBag.UserType = user.UserTypeId;
                if (user.UserTypeId == 0)
                {
                    return PartialView();
                }
            }
            else if (Request.Cookies["userId"] != null)
            {
                var user = _db.Users.FirstOrDefault(x => x.UserId == Convert.ToInt32(Request.Cookies["userId"]));
                ViewBag.Name = user.FirstName;
                ViewBag.UserType = user.UserTypeId;
                if (user.UserTypeId == 0)
                {
                    return PartialView();
                }
            }
            return RedirectToAction("Index", "Public");


        }




        public IActionResult BookService()
        {
            if (HttpContext.Session.GetInt32("userId") != null)
            {
                var id = HttpContext.Session.GetInt32("userId");
                User user = _db.Users.Find(id);
                ViewBag.Name = user.FirstName;
                ViewBag.UserType = user.UserTypeId;
                if (user.UserTypeId == 0)
                {
                    return PartialView();
                }
            }
            else if (Request.Cookies["userId"] != null)
            {
                var user = _db.Users.FirstOrDefault(x => x.UserId == Convert.ToInt32(Request.Cookies["userId"]));
                ViewBag.Name = user.FirstName;
                ViewBag.UserType = user.UserTypeId;
                if (user.UserTypeId == 0)
                {
                    return PartialView();
                }
            }
            return RedirectToAction("Index", "Public");

        }

        [HttpPost]
        public IActionResult ValidPostalCode(PostalCode obj)
        {


            var list = _db.Users.Where(x => (x.ZipCode == obj.postalcode) && (x.UserTypeId == 1)).ToList();


            if (list.Count() > 0)
            {




                return Ok(Json("true"));
            }
            TempData["wrongZipCode"] = "service provider is not avilable in this area.";
            return Ok(Json("false"));
        }



        [HttpPost]
        public ActionResult ScheduleService(ScheduleService schedule)
        {

            if (ModelState.IsValid)
            {


                return Ok(Json("true"));


            }
            else
            {

                return Ok(Json("false"));
            }



        }


        [HttpGet]
        public IActionResult DetailsService(PostalCode obj)
        {

            int Id = -1;

            List<Address> Addresses = new List<Address>();
            if (HttpContext.Session.GetInt32("userId") != null)
            {
                Id = (int)HttpContext.Session.GetInt32("userId");
            }
            else if (Request.Cookies["userId"] != null)
            {
                Id = int.Parse(Request.Cookies["userId"]);

            }


            string postalcode = obj.postalcode;
            Console.WriteLine(obj.postalcode);
            var table = _db.UserAddresses.Where(x => x.UserId == Id && x.PostalCode == postalcode).ToList();
            Console.WriteLine(table.ToString());

            foreach (var add in table)
            {
                Console.WriteLine("1");
                Address useradd = new Address();
                useradd.AddressId = add.AddressId;
                useradd.AddressLine1 = add.AddressLine1;
                useradd.AddressLine2 = add.AddressLine2;
                useradd.City = add.City;
                useradd.PostalCode = add.PostalCode;
                useradd.Mobile = add.Mobile;
                useradd.isDefault = add.IsDefault;

                Addresses.Add(useradd);
            }
            Console.WriteLine("2");

            return new JsonResult(Addresses);
        }


        [HttpPost]
        public ActionResult AddNewAddress(UserAddress useradd)
        {
            Console.WriteLine("Inside Addnew address 1");
            int Id = -1;


            if (HttpContext.Session.GetInt32("userId") != null)
            {
                Id = (int)HttpContext.Session.GetInt32("userId");
            }
            else if (Request.Cookies["userId"] != null)
            {
                Id = int.Parse(Request.Cookies["userId"]);

            }
            Console.WriteLine("Inside Addnew address 2");
            Console.WriteLine(Id);

            useradd.UserId = Id;
            useradd.IsDefault = false;
            useradd.IsDeleted = false;
            User user = _db.Users.Where(x => x.UserId == Id).FirstOrDefault();
            useradd.Email = user.Email;
            var result = _db.UserAddresses.Add(useradd);
            Console.WriteLine("Inside Addnew address 3");
            _db.SaveChanges();

            Console.WriteLine("Inside Addnew address 4");
            if (result != null)
            {
                return Ok(Json("true"));
            }

            return Ok(Json("false"));
        }






    }
}
