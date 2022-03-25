using Helperland.Models;
using Helperland.Models.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using Helperland.ViewModel;
using System.Threading.Tasks;
using MimeKit;
using MailKit.Net.Smtp;

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

            var BlockedCustomer = _db.FavoriteAndBlockeds.Where(x => x.UserId == Id && x.IsBlocked == true).Select(x => x.TargetUserId).ToList();

            var SPBlocked = _db.FavoriteAndBlockeds.Where(x => x.TargetUserId == Id && x.IsBlocked == true).Select(x => x.UserId).ToList();

            BlockedCustomer.AddRange(SPBlocked);

            if (ServiceRequest.Any())
            {
                foreach (var req in ServiceRequest)
                {
                    if (!BlockedCustomer.Contains(req.UserId))
                    {
                        SPDashboard temp = new SPDashboard();


                        temp.ServiceRequestId = req.ServiceRequestId;
                        var StartDate = req.ServiceStartDate.ToString();
                        //temp.Date = StartDate.Substring(0, 10);
                        
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

                        temp.Address = Address.AddressLine1 + ", " + Address.AddressLine2 + ", " + Address.City + " - " + Address.PostalCode;

                        List<ServiceRequestExtra> SRExtra = _db.ServiceRequestExtras.Where(x => x.ServiceRequestId == req.ServiceRequestId).ToList();

                        foreach (ServiceRequestExtra row in SRExtra)
                        {
                            if (row.ServiceExtraId == 1)
                            {
                                temp.Cabinet = true;
                            }
                            else if (row.ServiceExtraId == 2)
                            {
                                temp.Oven = true;
                            }
                            else if (row.ServiceExtraId == 3)
                            {
                                temp.Window = true;
                            }
                            else if (row.ServiceExtraId == 4)
                            {
                                temp.Fridge = true;
                            }
                            else
                            {
                                temp.Laundry = true;
                            }

                        }



                        dashboardTable.Add(temp);





                    }




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

            Details.EndTime = sr.ServiceStartDate.AddHours((double)Details.Duration).ToString("HH:mm");
            Details.TotalCost = sr.TotalCost;
            Details.Comments = sr.Comments;
            Details.Status = (int)sr.Status;
            Details.Complete = sr.ServiceStartDate.AddHours((double)Details.Duration) <= DateTime.Now;
           


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
                serviceRequest.ServiceRequestId = result.Entity.ServiceRequestId;
                sendServiceMailtoSP(serviceRequest);
                return "Suceess";
            }
            else
            {
                return "error";
            }

        }







        public async Task sendServiceMailtoSP(ServiceRequest req)
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




            var serviceProviderList = _db.Users.Where(x => x.UserTypeId == 1 && x.IsApproved == true && x.UserId != req.ServiceProviderId).ToList();

            var SpByBlocked = _db.FavoriteAndBlockeds.Where(x => x.TargetUserId == req.UserId && x.IsBlocked == true).Select(x => x.UserId).ToList();




            await Task.Run(() =>
            {
                foreach (var temp in serviceProviderList)
                {
                    if (!SpByBlocked.Contains(temp.UserId))
                    {
                        MimeMessage message = new MimeMessage();

                        MailboxAddress from = new MailboxAddress("Helperland",
                        "darshitkavathiya34@gmail.com");
                        message.From.Add(from);

                        MailboxAddress to = new MailboxAddress(temp.FirstName, temp.Email);
                        message.To.Add(to);

                        message.Subject = "New Service Request";

                        BodyBuilder bodyBuilder = new BodyBuilder();
                        bodyBuilder.HtmlBody = "<h1>A service with ID number " + req.ServiceRequestId + " is no more avaliable</h1>";



                        message.Body = bodyBuilder.ToMessageBody();

                        SmtpClient client = new SmtpClient();
                        client.Connect("smtp.gmail.com", 587, false);
                    mailto: client.Authenticate("darshitkavathiya34@gmail.com", "Dar@1234");
                        client.Send(message);
                        client.Disconnect(true);
                        client.Dispose();
                    }
                }


            });



        }


















        public string ConflictDetails(SPDashboard ID)
        {
            //Console.WriteLine(ID.ServiceRequestId);

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

            String startDateStr = reqdate + " 00:00:00.000";
            String endDateStr = reqdate + " 23:59:59.999";


            DateTime startDate = DateTime.ParseExact(startDateStr, "yyyy-MM-dd HH:mm:ss.fff",
                                       System.Globalization.CultureInfo.InvariantCulture);

            DateTime endDate = DateTime.ParseExact(endDateStr, "yyyy-MM-dd HH:mm:ss.fff",
                                       System.Globalization.CultureInfo.InvariantCulture);

            List<ServiceRequest> list = _db.ServiceRequests.Where(x => (x.ServiceProviderId == Id) && (x.Status == 2) && (x.ServiceStartDate > startDate && x.ServiceStartDate < endDate)).ToList();

            double mins = ((double)(request.ServiceHours + request.ExtraHours)) * 60;
            DateTime endTimeRequest = request.ServiceStartDate.AddMinutes(mins + 60);

            request.ServiceStartDate = request.ServiceStartDate.AddMinutes(-60);
            //Console.WriteLine(endTimeRequest);
            //Console.WriteLine(request.ServiceStartDate);
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

            var ServiceRequest = _db.ServiceRequests.Where(x => x.Status == 2 && x.ServiceProviderId == user.UserId).ToList();

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
                    /* complete btn */
                    temp.Complete = req.ServiceStartDate.AddHours(totaltime) <= DateTime.Now;
                    temp.Status = (int)req.Status;
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

        public string CompleteService(ServiceRequest request)
        {

            ServiceRequest requestObj = _db.ServiceRequests.FirstOrDefault(x => x.ServiceRequestId == request.ServiceRequestId);

            requestObj.Status = 3;

            var result = _db.ServiceRequests.Update(requestObj);
            _db.SaveChanges();
            if (result != null)
            {
                return "true";
            }
            else
            {
                return "false";
            }
        }


        public string cancelRequest(ServiceRequest request)
        {

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





        public JsonResult getServiceHistory()
        {
            int? Id = HttpContext.Session.GetInt32("userId");
            if (Id == null)
            {
                Id = Convert.ToInt32(Request.Cookies["userId"]);
            }

            User user = _db.Users.FirstOrDefault(x => x.UserId == Id);

            List<SPDashboard> ServiceHistoryTable = new List<SPDashboard>();

            var ServiceRequest = _db.ServiceRequests.Where(x => x.Status == 3 && x.ServiceProviderId == user.UserId).ToList();

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
                    temp.Status = (int)req.Status;
                    //temp.TotalCost = req.TotalCost;
                    // temp.HasPet = req.HasPets;
                    //temp.Comments = req.Comments;
                    User customer = _db.Users.FirstOrDefault(x => x.UserId == req.UserId);
                    temp.CustomerName = customer.FirstName + " " + customer.LastName;

                    ServiceRequestAddress Address = (ServiceRequestAddress)_db.ServiceRequestAddresses.FirstOrDefault(x => x.ServiceRequestId == req.ServiceRequestId);

                    temp.Address = Address.AddressLine1 + ", " + Address.AddressLine2 + ", " + Address.City + " , " + Address.PostalCode;

                    ServiceHistoryTable.Add(temp);

                }

            }

            return new JsonResult(ServiceHistoryTable);

        }





        //rating

        public JsonResult getRatingData()
        {

            int? Id = HttpContext.Session.GetInt32("userId");
            if (Id == null)
            {
                Id = Convert.ToInt32(Request.Cookies["userId"]);
            }

            var ratingList = _db.Ratings.Where(x => x.RatingTo == Id).ToList();

            List<RatingDTO> ratingDTOsList = new List<RatingDTO>();

            foreach (var temp in ratingList)
            {

                RatingDTO ratingDTO = new RatingDTO();

                User customer = _db.Users.FirstOrDefault(x => x.UserId == temp.RatingFrom);

                string customerName = customer.FirstName + " " + customer.LastName;


                ServiceRequest req = _db.ServiceRequests.FirstOrDefault(x => x.ServiceRequestId == temp.ServiceRequestId);


                ratingDTO.CustomerName = customerName;
                ratingDTO.ServiceRequestId = temp.ServiceRequestId;
                ratingDTO.ServiceDate = req.ServiceStartDate.ToString("dd/MM/yyyy");
                ratingDTO.StartTime = req.ServiceStartDate.AddHours(0).ToString("HH:mm ");
                var totaltime = (double)(req.ServiceHours + req.ExtraHours);
                ratingDTO.EndTime = req.ServiceStartDate.AddHours(totaltime).ToString("HH:mm ");
                ratingDTO.Rating = (double)temp.Ratings;
                ratingDTO.Comments = temp.Comments;



                if (ratingDTO.Rating > 4)
                {
                    ratingDTO.Remarks = "Excellent";
                }
                else if (ratingDTO.Rating > 3)
                {
                    ratingDTO.Remarks = "Very Good";
                }
                else if (ratingDTO.Rating > 2)
                {
                    ratingDTO.Remarks = "Good"; ;
                }
                else if (ratingDTO.Rating > 1)
                {
                    ratingDTO.Remarks = "Average";
                }
                else if (ratingDTO.Rating >= 0)
                {
                    ratingDTO.Remarks = "Poor";
                }

                ratingDTOsList.Add(ratingDTO);


            }

            return Json(ratingDTOsList);

        }





        //block customer 







        public JsonResult getCustomer()
        {

            int? Id = HttpContext.Session.GetInt32("userId");
            if (Id == null)
            {
                Id = Convert.ToInt32(Request.Cookies["userId"]);
            }

            List<int> customerID = _db.ServiceRequests.Where(x => x.ServiceProviderId == Id && x.Status != 1).Select(u => u.UserId).ToList();


            var CustomerSetId = new HashSet<int>(customerID);

            List<BlockCustomerData> blockData = new List<BlockCustomerData>();

            foreach (int temp in CustomerSetId)
            {
                User user = _db.Users.FirstOrDefault(x => x.UserId == temp);
                FavoriteAndBlocked FB = _db.FavoriteAndBlockeds.FirstOrDefault(x => x.UserId == Id && x.TargetUserId == temp);

                BlockCustomerData blockCustomerData = new BlockCustomerData();
                blockCustomerData.user = user;
                blockCustomerData.favoriteAndBlocked = FB;

                blockData.Add(blockCustomerData);



            }



            return Json(blockData);


        }


        public string BlockUnblockCustomer(BlockDTO temp)
        {
            int? Id = HttpContext.Session.GetInt32("userId");
            if (Id == null)
            {
                Id = Convert.ToInt32(Request.Cookies["userId"]);
            }

            FavoriteAndBlocked obj = _db.FavoriteAndBlockeds.FirstOrDefault(x => x.UserId == Id && x.TargetUserId == temp.Id);

            if (temp.Req == "B")
            {

                if (obj == null)
                {
                    obj = new FavoriteAndBlocked();
                    obj.UserId = (int)Id;
                    obj.TargetUserId = temp.Id;
                    obj.IsBlocked = true;

                }
                else
                {
                    obj.IsBlocked = true;
                }

            }
            else
            {
                obj.IsBlocked = false;

            }





            var result = _db.FavoriteAndBlockeds.Update(obj);
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













        public JsonResult GetSpData()
        {
            int? Id = HttpContext.Session.GetInt32("userId");
            if (Id == null)
            {
                Id = Convert.ToInt32(Request.Cookies["userId"]);
            }

            User user = _db.Users.FirstOrDefault(x => x.UserId == Id);

            UserAddress Addresses = _db.UserAddresses.FirstOrDefault(x => x.UserId == Id );
            
            SPSettingsDTO sPSettingsDTO = new SPSettingsDTO();
              
            sPSettingsDTO.user = user;
            sPSettingsDTO.address = Addresses;



            return new JsonResult(sPSettingsDTO);
        }
        

        [HttpPost]
        public IActionResult UpdateSPData(SPSettingsDTO sPSettings)
        {
            int? Id = HttpContext.Session.GetInt32("userId");
            if (Id == null)
            {
                Id = Convert.ToInt32(Request.Cookies["userId"]);
            }


            User sp = _db.Users.FirstOrDefault(x => x.UserId == (int)Id);
            sp.FirstName = sPSettings.user.FirstName;
            sp.LastName = sPSettings.user.LastName;
            sp.Mobile = sPSettings.user.Mobile;
            sp.DateOfBirth = sPSettings.user.DateOfBirth;
            sp.NationalityId = sPSettings.user.NationalityId;
            sp.Gender = sPSettings.user.Gender;
            sp.UserProfilePicture = sPSettings.user.UserProfilePicture; 
            sp.ModifiedDate = DateTime.Now;
            sp.ModifiedBy = 1;


            var userresult= _db.Users.Update(sp);

            _db.SaveChanges();

            UserAddress userAddress1 = _db.UserAddresses.FirstOrDefault(x => x.UserId == Id);

            if (userAddress1 == null)
            {

                sPSettings.address.UserId = (int)Id;
                UserAddress userAddress = sPSettings.address;
               var updateaddress = _db.UserAddresses.Update(userAddress);

                _db.SaveChanges();
            }
            else
            {
                userAddress1.AddressLine1 = sPSettings.address.AddressLine1;
                userAddress1.AddressLine2 = sPSettings.address.AddressLine2;    
                userAddress1.City= sPSettings.address.City;
                userAddress1.State = sPSettings.address.State;
                userAddress1.PostalCode = sPSettings.address.PostalCode;
                userAddress1.Mobile = sPSettings.address.Mobile;    
                var updateaddress = _db.UserAddresses.Update(userAddress1);

                _db.SaveChanges();

            }
             

            












            if (userresult != null )
                {
                return Ok(Json("true"));
            }

            return Ok(Json("false"));
        }









        public IActionResult ChangePassword(ChangePassword password)
        {
            int? Id = HttpContext.Session.GetInt32("userId");
            if (Id == null)
            {
                Id = Convert.ToInt32(Request.Cookies["userId"]);
            }
            User user = _db.Users.FirstOrDefault(x => x.UserId == Id);


            if (BCrypt.Net.BCrypt.Verify(password.oldPassword, user.Password))
            {
                user.Password = BCrypt.Net.BCrypt.HashPassword(password.newPassword);
                user.ModifiedDate = DateTime.Now;
                _db.Users.Update(user);
                _db.SaveChanges();
                return Ok(Json("true"));
            }
            else
            {
                return Ok(Json("wrong password"));
            }


        }























    }
}

