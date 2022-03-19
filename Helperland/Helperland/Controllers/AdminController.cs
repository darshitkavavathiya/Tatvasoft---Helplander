using Microsoft.AspNetCore.Mvc;
using Helperland.Models.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System;
using Helperland.Models;
using Helperland.ViewModel;
using System.Collections.Generic;
using PagedList;
using PagedList.Mvc;
using System.Threading.Tasks;
using MimeKit;
using MailKit.Net.Smtp;

namespace Helperland.Controllers
{
    public class AdminController : Controller

    {




        private readonly HelperlandContext _db;

        public AdminController(HelperlandContext db)
        {
            _db = db;
        }

        public IActionResult AdminPanel()
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
            if (userTypeId != 2)
            {
                return RedirectToAction("Index", "Public");

            }

            ViewBag.Name = user.FirstName;
            ViewBag.UserType = user.UserTypeId;

            return View();

        }


        public JsonResult GetServiceRequest(AdminServiceFilterDTO filter)
        {
            Console.WriteLine(filter.ServiceRequestId);

            List<AdminservicereqDTO> tabledata = new List<AdminservicereqDTO>();

            var serviceRequestsList = _db.ServiceRequests.ToList();

            foreach (ServiceRequest temp in serviceRequestsList)
            {
                if (checkServiceRequest(temp, filter))
                {


                    AdminservicereqDTO Dto = new AdminservicereqDTO();

                    Dto.ServiceRequestId = temp.ServiceRequestId;
                    Dto.Date = temp.ServiceStartDate.ToString("dd/MM/yyyy");
                    Dto.StartTime = temp.ServiceStartDate.AddHours(0).ToString("HH:mm ");
                    var totaltime = (double)(temp.ServiceHours + temp.ExtraHours);
                    Dto.EndTime = temp.ServiceStartDate.AddHours(totaltime).ToString("HH:mm ");
                    Dto.Status = (int)temp.Status;
                    Dto.TotalCost = temp.TotalCost;
                    /* customer */

                    User customer = _db.Users.FirstOrDefault(x => x.UserId == temp.UserId);

                    Dto.CustomerName = customer.FirstName + " " + customer.LastName;



                    /*address */

                    ServiceRequestAddress serviceRequestAddress = _db.ServiceRequestAddresses.FirstOrDefault(x => x.ServiceRequestId == temp.ServiceRequestId);

                    Dto.Address = serviceRequestAddress.AddressLine1 + " " + serviceRequestAddress.AddressLine2 + "," + serviceRequestAddress.City + "-" + serviceRequestAddress.PostalCode;

                    Dto.ZipCode = temp.ZipCode;


                    if (temp.ServiceProviderId != null)
                    {
                        User sp = _db.Users.FirstOrDefault(x => x.UserId == temp.ServiceProviderId);

                        Dto.ServiceProvider = sp.FirstName + " " + sp.LastName;
                        Dto.UserProfilePicture = sp.UserProfilePicture;


                        decimal rating;

                        if (_db.Ratings.Where(x => x.RatingTo == temp.ServiceProviderId).Count() > 0)
                        {
                            rating = _db.Ratings.Where(x => x.RatingTo == temp.ServiceProviderId).Average(x => x.Ratings);
                        }
                        else
                        {
                            rating = 0;
                        }
                        Dto.AverageRating = (float)decimal.Round(rating, 1, MidpointRounding.AwayFromZero);

                    }


                    tabledata.Add(Dto);
                }
















            }

            return Json(tabledata);
        }

        Boolean checkServiceRequest(ServiceRequest req, AdminServiceFilterDTO filter)
        {
            var user = _db.Users.FirstOrDefault(x => x.UserId == req.UserId);


            if (filter.ServiceRequestId != null)
            {
                if (req.ServiceRequestId != filter.ServiceRequestId)
                {
                    return false;
                }
            }
            if (filter.ZipCode != null)
            {
                if (req.ZipCode != filter.ZipCode)
                {
                    return false;
                }
            }
            if (filter.Email != null)
            {
                var email = user.Email;
                if (!email.Contains(filter.Email))
                {
                    return false;
                }
            }
            if (filter.CustomerName != null)
            {

                var name = user.FirstName + " " + user.LastName;
                if (!name.Contains(filter.CustomerName))
                {
                    return false;
                }
            }
            if (filter.ServiceProviderName != null)
            {
                User sp = _db.Users.FirstOrDefault(x => x.UserId == req.ServiceProviderId);
                if (sp != null)
                {
                    var name = sp.FirstName + " " + sp.LastName;

                    if (!name.Contains(filter.ServiceProviderName))
                    {
                        return false;
                    }
                }
                else
                {
                    return false;
                }
            }
            if (filter.Status != null)
            {
                if (req.Status != filter.Status)
                {
                    return false;
                }
            }
            if (filter.FromDate != null)
            {
                DateTime dateTime = Convert.ToDateTime(filter.FromDate);
                if (!(req.ServiceStartDate >= dateTime))
                {
                    return false;
                }

            }
            if (filter.ToDate != null)
            {
                var reqEndDate = req.ServiceStartDate.AddHours((double)(req.ServiceHours + req.ExtraHours));

                DateTime dateTime = Convert.ToDateTime(filter.ToDate);

                if (!(reqEndDate <= dateTime))
                {
                    return false;
                }
            }


            return true;



        }





































    }

}
