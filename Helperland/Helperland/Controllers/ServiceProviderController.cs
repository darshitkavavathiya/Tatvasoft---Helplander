using Helperland.Models;
using Helperland.Models.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using Helperland.ViewModel;

namespace Helperland.Controllers
{
    public class ServiceProviderController : Controller
    {
        private readonly HelperlandContext _db;

        public ServiceProviderController(HelperlandContext db)
        {
            _db = db;
        }


        /*-----------New Service Request------------*/

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


            List<SPDashboard> dashboardTable = new List<SPDashboard>();

            var ServiceRequest = _db.ServiceRequests.Where(x => x.ZipCode == user.ZipCode && x.Status == 1).ToList();

            if (ServiceRequest.Any())
            {
                foreach (var req in ServiceRequest)
                {
                    SPDashboard temp = new SPDashboard();


                    temp.ServiceRequestId = req.ServiceRequestId;
                    var StartDate = req.ServiceStartDate.ToString();
                    //temp.Date = StartDate.Substring(0, 10);
                    //temp.StartTime = StartDate.Substring(11);
                    temp.Date = req.ServiceStartDate.ToString("dd/MM/yyyy");
                    temp.StartTime = req.ServiceStartDate.AddHours(0).ToString("HH:mm ");
                    var totaltime = (double)(req.ServiceHours + req.ExtraHours);
                    temp.EndTime = req.ServiceStartDate.AddHours(totaltime).ToString("HH:mm ");
                    temp.Status = (int)req.Status;
                    temp.TotalCost = req.TotalCost;
                    temp.HasPet = req.HasPets;
                    temp.Comments = req.Comments;


                    User customer = _db.Users.FirstOrDefault(x => x.UserId == req.UserId);
                    temp.CustomerName = customer.FirstName + " " + customer.LastName;

                    ServiceRequestAddress Address = (ServiceRequestAddress)_db.ServiceRequestAddresses.FirstOrDefault(x => x.ServiceRequestId == req.ServiceRequestId);

                    temp.Address = Address.AddressLine1 + ", " + Address.AddressLine2 + ", " + Address.City + " , " + Address.PostalCode;

                    //List<ServiceRequestExtra> SRExtra = _db.ServiceRequestExtras.Where(x => x.ServiceRequestId == req.ServiceRequestId).ToList();

                    //foreach (ServiceRequestExtra row in SRExtra)
                    //{
                    //    if (row.ServiceExtraId == 1)
                    //    {
                    //        temp.Cabinet = true;
                    //    }
                    //    else if (row.ServiceExtraId == 2)
                    //    {
                    //        temp.Oven = true;
                    //    }
                    //    else if (row.ServiceExtraId == 3)
                    //    {
                    //        temp.Window = true;
                    //    }
                    //    else if (row.ServiceExtraId == 4)
                    //    {
                    //        temp.Fridge = true;
                    //    }
                    //    else
                    //    {
                    //        temp.Laundry = true;
                    //    }
                    //}

                    dashboardTable.Add(temp);






                }


            }


            return View(dashboardTable);


        }


        [HttpGet]
        public JsonResult getAllDetails(SPDashboard ID)
        {

            SPDashboard Details = new SPDashboard();

            ServiceRequest sr = _db.ServiceRequests.FirstOrDefault(x => x.ServiceRequestId == ID.ServiceRequestId);

            Details.ServiceRequestId = ID.ServiceRequestId;

            Details.Date = sr.ServiceStartDate.ToString("dd/MM/yyyy");

            Details.StartTime = sr.ServiceStartDate.ToString("HH:mm");

            Details.Duration = (decimal)(sr.ServiceHours + sr.ExtraHours);
            Details.EndTime = sr.ServiceStartDate.AddHours((double)sr.SubTotal).ToString("HH:mm");
            Details.TotalCost = sr.TotalCost;
            Details.Comments = sr.Comments;
            Details.Status = (int)sr.Status;


            List<ServiceRequestExtra> SRExtra = _db.ServiceRequestExtras.Where(x => x.ServiceRequestId == ID.ServiceRequestId).ToList();

            foreach (ServiceRequestExtra row in SRExtra)
            {
                if (row.ServiceExtraId == 1)
                {
                    Details.Cabinet = true;
                }
                else if (row.ServiceExtraId == 2)
                {
                    Details.Oven = true;
                }
                else if (row.ServiceExtraId == 3)
                {
                    Details.Window = true;
                }
                else if (row.ServiceExtraId == 4)
                {
                    Details.Fridge = true;
                }
                else
                {
                    Details.Laundry = true;
                }
            }

            ServiceRequestAddress Address = _db.ServiceRequestAddresses.FirstOrDefault(x => x.ServiceRequestId == ID.ServiceRequestId);

            Details.Address = Address.AddressLine1 + ", " + Address.AddressLine2 + ", " + Address.City + " - " + Address.PostalCode;
            Details.ZipCode = Address.PostalCode;

            User customer = _db.Users.FirstOrDefault(x => x.UserId == sr.UserId);

            Details.CustomerName = customer.FirstName + " " + customer.LastName;


            return new JsonResult(Details);
        }





        /*--------- Accept Service Req------------*/
        [HttpGet]
        public string acceptService(SPDashboard ID)
        {
            int? spId = HttpContext.Session.GetInt32("userId");
            if (spId == null)
            {
                spId = Convert.ToInt32(Request.Cookies["userId"]);
            }

            ServiceRequest serviceRequest = _db.ServiceRequests.FirstOrDefault(x => x.ServiceRequestId == ID.ServiceRequestId);
            if (serviceRequest != null && serviceRequest.Status != 1)
            {
                return new string("Service Req Not available");
            }

            int conflict = CheckConflict((int)serviceRequest.ServiceRequestId);

            if (conflict != -1)
            {





                return conflict.ToString();

            }



            serviceRequest.Status = 2;
            serviceRequest.ServiceProviderId = spId;
            var result = _db.ServiceRequests.Update(serviceRequest);
            _db.SaveChanges();
            if (result != null)
            {
                return "Suceess";
            }
            else
            {
                return "error";
            }

        }


        public string ConflictDetails(SPDashboard ID)
        {
            Console.WriteLine(ID.ServiceRequestId);

            int conflict = CheckConflict(ID.ServiceRequestId);

            ServiceRequest sr = _db.ServiceRequests.FirstOrDefault(x => x.ServiceRequestId == conflict);


            string conflictmsg = "This Request is conflicting with Service ID: " + sr.ServiceRequestId + " on :" + sr.ServiceStartDate;




            return conflictmsg;






        }

        public int CheckConflict(int SRID)
        {

            int? Id = HttpContext.Session.GetInt32("userId");
            if (Id == null)
            {
                Id = Convert.ToInt32(Request.Cookies["userId"]);
            }


            ServiceRequest request = _db.ServiceRequests.FirstOrDefault(x => x.ServiceRequestId == SRID);

            String reqdate = request.ServiceStartDate.ToString("yyyy-MM-dd");
            Console.WriteLine(reqdate);

            String startDateStr = reqdate + " 00:00:00.000";
            String endDateStr = reqdate + " 23:59:59.999";

            Console.WriteLine(startDateStr);

            DateTime startDate = DateTime.ParseExact(startDateStr, "yyyy-MM-dd HH:mm:ss.fff",
                                       System.Globalization.CultureInfo.InvariantCulture);

            DateTime endDate = DateTime.ParseExact(endDateStr, "yyyy-MM-dd HH:mm:ss.fff",
                                       System.Globalization.CultureInfo.InvariantCulture);

            List<ServiceRequest> list = _db.ServiceRequests.Where(x => (x.ServiceProviderId == Id) && (x.Status == 2) && (x.ServiceStartDate > startDate && x.ServiceStartDate < endDate)).ToList();

            double mins = ((double)(request.ServiceHours + request.ExtraHours)) * 60;
            DateTime endTimeRequest = request.ServiceStartDate.AddMinutes(mins + 60);

            request.ServiceStartDate = request.ServiceStartDate.AddMinutes(-60);
            Console.WriteLine(endTimeRequest);
            Console.WriteLine(request.ServiceStartDate);
            foreach (ServiceRequest booked in list)
            {
                mins = ((double)(booked.ServiceHours + booked.ExtraHours)) * 60;
                DateTime endTimeBooked = booked.ServiceStartDate.AddMinutes(mins);

                if (request.ServiceStartDate < booked.ServiceStartDate)
                {
                    if (endTimeRequest <= booked.ServiceStartDate)
                    {
                        return -1;
                    }
                    else
                    {
                        return booked.ServiceRequestId;
                    }
                }
                else
                {
                    if (request.ServiceStartDate < endTimeBooked)
                    {
                        return booked.ServiceRequestId;
                    }
                }

            }

            return -1;

        }




        public JsonResult getUpcomingService()
        {
            int? Id = HttpContext.Session.GetInt32("userId");
            if (Id == null)
            {
                Id = Convert.ToInt32(Request.Cookies["userId"]);
            }

            User user = _db.Users.FirstOrDefault(x => x.UserId == Id);

            List<SPDashboard> UpcomingTable = new List<SPDashboard>();

            var ServiceRequest = _db.ServiceRequests.Where(x =>  x.Status == 2 && x.ServiceProviderId == user.UserId ).ToList();

            if (ServiceRequest.Any())
            {
                foreach (var req in ServiceRequest)
                {
                    SPDashboard temp = new SPDashboard();


                    temp.ServiceRequestId = req.ServiceRequestId;
                    var StartDate = req.ServiceStartDate.ToString();
                    temp.Date = req.ServiceStartDate.ToString("dd/MM/yyyy");
                    temp.StartTime = req.ServiceStartDate.AddHours(0).ToString("HH:mm ");
                    var totaltime = (double)(req.ServiceHours + req.ExtraHours);
                    temp.EndTime = req.ServiceStartDate.AddHours(totaltime).ToString("HH:mm ");

                    //temp.Status = (int)req.Status;

                    temp.TotalCost = req.TotalCost;

                   // temp.HasPet = req.HasPets;
                    //temp.Comments = req.Comments;


                    User customer = _db.Users.FirstOrDefault(x => x.UserId == req.UserId);
                    temp.CustomerName = customer.FirstName + " " + customer.LastName;

                    ServiceRequestAddress Address = (ServiceRequestAddress)_db.ServiceRequestAddresses.FirstOrDefault(x => x.ServiceRequestId == req.ServiceRequestId);

                    temp.Address = Address.AddressLine1 + ", " + Address.AddressLine2 + ", " + Address.City + " , " + Address.PostalCode;

                   

                    UpcomingTable.Add(temp);






                }


            }


            return new JsonResult(UpcomingTable);

        }




        public string cancelRequest(ServiceRequest request)
        {
            Console.WriteLine(request.ServiceRequestId);

            ServiceRequest requestObj = _db.ServiceRequests.FirstOrDefault(x => x.ServiceRequestId == request.ServiceRequestId);

            requestObj.ServiceProviderId = null;
            requestObj.Status = 1;

            var result = _db.ServiceRequests.Update(requestObj);
            _db.SaveChanges();
            if (result != null)
            {
                return "Suceess";
            }
            else
            {
                return "error";
            }




        }










    }



  



  


}

