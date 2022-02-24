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
        public IActionResult CustomerDashboard()
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
            if (ModelState.IsValid)
            {

                var list = _db.Users.Where(x => (x.ZipCode == obj.postalcode) && (x.UserTypeId == 1)).ToList();


                if (list.Count() > 0)
                {


                    return Ok(Json("true"));
                }
                
                return Ok(Json("false"));
            }
            else
            {
                return Ok(Json("Invalid"));
            }

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
            var table = _db.UserAddresses.Where(x => x.UserId == Id && x.PostalCode == postalcode).ToList();

            foreach (var add in table)
            {
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

            return new JsonResult(Addresses);
        }


        [HttpPost]
        public ActionResult AddNewAddress(UserAddress useradd)
        {
            int Id = -1;


            if (HttpContext.Session.GetInt32("userId") != null)
            {
                Id = (int)HttpContext.Session.GetInt32("userId");
            }
            else if (Request.Cookies["userId"] != null)
            {
                Id = int.Parse(Request.Cookies["userId"]);

            }
           

            useradd.UserId = Id;
            useradd.IsDefault = false;
            useradd.IsDeleted = false;
            User user = _db.Users.Where(x => x.UserId == Id).FirstOrDefault();
            useradd.Email = user.Email;
            var result = _db.UserAddresses.Add(useradd);
            _db.SaveChanges();

            if (result != null)
            {
                return Ok(Json("true"));
            }

            return Ok(Json("false"));
        }



        [HttpPost]
        public ActionResult CompleteBooking(CompleteBooking complete)
        {
            int Id = -1;


            if (HttpContext.Session.GetInt32("userId") != null)
            {
                Id = (int)HttpContext.Session.GetInt32("userId");
            }
            else if (Request.Cookies["userId"] != null)
            {
                Id = int.Parse(Request.Cookies["userId"]);

            }


            ServiceRequest add = new ServiceRequest();
            add.UserId = Id;
            add.ServiceId = Id;
            add.ServiceStartDate = complete.ServiceStartDate;
            add.ServiceHours = (double)complete.ServiceHours;
            add.ZipCode = complete.PostalCode;
            add.ServiceHourlyRate = 25;
            add.ExtraHours = complete.ExtraHours;
            add.SubTotal = (decimal)complete.SubTotal;
            add.TotalCost = (decimal)complete.TotalCost;
            add.Comments = complete.Comments;
            add.PaymentDue = false;
            add.PaymentDone = true;

            add.HasPets = complete.HasPet;
            add.CreatedDate = DateTime.Now;
            add.ModifiedDate = DateTime.Now;
            add.HasIssue = false;

            var result = _db.ServiceRequests.Add(add);
            _db.SaveChanges();

            UserAddress useraddr = _db.UserAddresses.Where(x => x.AddressId == complete.AddressId).FirstOrDefault();

            ServiceRequestAddress srAddr = new ServiceRequestAddress();
            srAddr.AddressLine1 = useraddr.AddressLine1;
            srAddr.AddressLine2 = useraddr.AddressLine2;
            srAddr.City = useraddr.City;
            srAddr.Email = useraddr.Email;
            srAddr.Mobile = useraddr.Mobile;
            srAddr.PostalCode = useraddr.PostalCode;
            srAddr.ServiceRequestId = result.Entity.ServiceRequestId;
            srAddr.State = useraddr.State;

            var srAddrResult = _db.ServiceRequestAddresses.Add(srAddr);
            _db.SaveChanges();

            if (complete.Cabinet == true)
            {
                ServiceRequestExtra srExtra = new ServiceRequestExtra();
                srExtra.ServiceRequestId = result.Entity.ServiceRequestId;
                srExtra.ServiceExtraId = 1;
                _db.ServiceRequestExtras.Add(srExtra);
                _db.SaveChanges();
            }
            if (complete.Fridge == true)
            {
                ServiceRequestExtra srExtra = new ServiceRequestExtra();
                srExtra.ServiceRequestId = result.Entity.ServiceRequestId;
                srExtra.ServiceExtraId = 2;
                _db.ServiceRequestExtras.Add(srExtra);
                _db.SaveChanges();
            }
            if (complete.Oven == true)
            {
                ServiceRequestExtra srExtra = new ServiceRequestExtra();
                srExtra.ServiceRequestId = result.Entity.ServiceRequestId;
                srExtra.ServiceExtraId = 3;
                _db.ServiceRequestExtras.Add(srExtra);
                _db.SaveChanges();
            }
            if (complete.Laundry == true)
            {
                ServiceRequestExtra srExtra = new ServiceRequestExtra();
                srExtra.ServiceRequestId = result.Entity.ServiceRequestId;
                srExtra.ServiceExtraId = 4;
                _db.ServiceRequestExtras.Add(srExtra);
                _db.SaveChanges();
            }
            if (complete.Window == true)
            {
                ServiceRequestExtra srExtra = new ServiceRequestExtra();
                srExtra.ServiceRequestId = result.Entity.ServiceRequestId;
                srExtra.ServiceExtraId = 5;
                _db.ServiceRequestExtras.Add(srExtra);
                _db.SaveChanges();
            }
            
            

            if (result != null && srAddrResult != null)
            {
                return Ok(Json(result.Entity.ServiceRequestId));
            }

            return Ok(Json("false"));
        }





    }
}
