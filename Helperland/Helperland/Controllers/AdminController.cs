using Microsoft.AspNetCore.Mvc;
using Helperland.Models.Data;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System;
using Helperland.Models;
using Helperland.ViewModel;
using System.Collections.Generic;
using System.Threading.Tasks;
using MimeKit;
using MailKit.Net.Smtp;
using Newtonsoft.Json;

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
            //Console.WriteLine(filter.ServiceRequestId);

            List<AdminservicereqDTO> tabledata = new List<AdminservicereqDTO>();

            var serviceRequestsList = _db.ServiceRequests.ToList().OrderByDescending(x=> x.ServiceRequestId);

            foreach (ServiceRequest temp in serviceRequestsList)
            {

                //Console.WriteLine(temp.ServiceRequestId);
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




        public JsonResult GetEditPopupData(ServiceRequest Id)
        {
            //Console.WriteLine(Id.ServiceRequestId);


            AdminPopUpDTO adminPopUpDTO = new AdminPopUpDTO();

            adminPopUpDTO.address = _db.ServiceRequestAddresses.FirstOrDefault(x => x.ServiceRequestId == Id.ServiceRequestId);

            DateTime starttime = _db.ServiceRequests.Where(x => x.ServiceRequestId == Id.ServiceRequestId).Select(x => x.ServiceStartDate).FirstOrDefault();
            //Console.WriteLine(starttime.ToString());
            adminPopUpDTO.Date = starttime.ToString("MM-dd-yyyy");

            adminPopUpDTO.StartTime = starttime.ToString("HH:mm:ss");

            //Console.WriteLine(adminPopUpDTO.StartTime);

            return Json(adminPopUpDTO);



        }



        public JsonResult UpdateServiceReq(AdminPopUpDTO DTO)
        {
            ServiceRequest serviceRequest = _db.ServiceRequests.FirstOrDefault(x=> x.ServiceRequestId == DTO.ServiceRequestId);

            DateTime dateTime= Convert.ToDateTime(DTO.Date);
            //Console.Write("269"+dateTime.ToString());
            serviceRequest.ServiceStartDate =dateTime;

 
            



            ServiceRequestAddress serviceRequestAddress = _db.ServiceRequestAddresses.FirstOrDefault(x => x.ServiceRequestId == DTO.ServiceRequestId);
            //Console.WriteLine(DTO.ServiceRequestId);


            serviceRequestAddress.AddressLine1 = DTO.address.AddressLine1;
            serviceRequestAddress.AddressLine2 = DTO.address.AddressLine2;

            serviceRequestAddress.PostalCode = DTO.address.PostalCode;
            serviceRequestAddress.City= DTO.address.City;
            serviceRequestAddress.State = DTO.address.State;
       
            var result2 = _db.ServiceRequestAddresses.Update(serviceRequestAddress);
            _db.SaveChanges();
            var result1 = _db.ServiceRequests.Update(serviceRequest);
            _db.SaveChanges();

            if (result1 != null&& result2 != null)
            {
                sendMail(serviceRequest);
                return Json("true");
            }
            else
            {
                return Json("false");
            }
            
        }



        [HttpPost]
        public async Task<IActionResult> CencleServiceReq(ServiceRequest cancel)
        {



            //Console.WriteLine(cancel.ServiceRequestId);
            ServiceRequest cancelService = _db.ServiceRequests.FirstOrDefault(x => x.ServiceRequestId == cancel.ServiceRequestId);
            cancelService.Status = 4;
           

            var result = _db.ServiceRequests.Update(cancelService);
            _db.SaveChanges();
            if (result != null)
            {

                await Task.Run(() =>
                {

                    if (cancelService.ServiceProviderId != null)
                    {

                        User temp = _db.Users.FirstOrDefault(x => x.UserId == cancelService.ServiceProviderId);


                        MimeMessage message = new MimeMessage();

                        MailboxAddress from = new MailboxAddress("Helperland",
                        "darshitkavathiya34@gmail.com");
                        message.From.Add(from);

                        MailboxAddress to = new MailboxAddress(temp.FirstName, temp.Email);
                        message.To.Add(to);

                        message.Subject = "Service Request cancelled ";

                        BodyBuilder bodyBuilder = new BodyBuilder();
                        bodyBuilder.HtmlBody = "<h1>Service request with Id=" + cancelService.ServiceRequestId + ", has been cancled </ h1 > ";



                        message.Body = bodyBuilder.ToMessageBody();

                        SmtpClient client = new SmtpClient();
                        client.Connect("smtp.gmail.com", 587, false);
                    mailto: client.Authenticate("darshitkavathiya34@gmail.com", "Dar@1234");
                        client.Send(message);
                        client.Disconnect(true);
                        client.Dispose();

                    }




                });




                return Ok(Json("true"));
            }

            return Ok(Json("false"));
        }









        public JsonResult GetUserData(AdminUserFilterDTO filterDto)
        {

            var user = _db.Users.ToList();

            List<User> result = new List<User>();

            foreach (User temp in user)
            {
                if (checkUserFilter(temp, filterDto))
                {

                    result.Add(temp);
                }
            }


            return Json(result);





        }

        public bool checkUserFilter(User user, AdminUserFilterDTO filter)
        {

            ////Console.WriteLine(filter.ToDate);
            ////Console.WriteLine(user.CreatedDate);

            if (filter.Name != null)
            {

                var name = user.FirstName + " " + user.LastName;
                if (!name.Contains(filter.Name))
                {
                    return false;
                }
            }

            if (filter.UserType != null)
            {
                if (user.UserTypeId != filter.UserType)
                {
                    return false;
                }
            }

            if (filter.Phone != null)
            {
                var phone = user.Mobile;
                if (!phone.Contains(filter.Phone))
                {
                    return false;
                }
            }

            if (filter.PostalCode != null)
            {
                if (user.ZipCode != filter.PostalCode)
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




            if (filter.FromDate != null)
            {
                DateTime dateTime = Convert.ToDateTime(filter.FromDate);
                if (!(user.CreatedDate >= dateTime))
                {
                    return false;
                }

            }

            if (filter.ToDate != null)
            {
                DateTime dateTime = Convert.ToDateTime(filter.ToDate);
                if (!(user.CreatedDate <= dateTime))
                {
                    return false;
                }

            }



            return true;

        }



        public string UserEdit(User Id)
        {
            //Console.WriteLine(Id.UserId);
            User user = _db.Users.FirstOrDefault(x => x.UserId == Id.UserId);

            var resultString = "Error";

            if (user.IsApproved == false)
            {
                user.IsApproved = true;
                user.IsActive = true;

                resultString = "Service Provider Approved and Activated";
            }
            else if (user.IsActive == false)
            {
                user.IsActive = true;

                resultString = "User Activated";
            }
            else
            {
                user.IsActive = false;

                resultString = "User Deactivated";
            }

            var result = _db.Users.Update(user);
            _db.SaveChanges();

            if (result != null)
            {
                return resultString;
            }

            return "Error occured in DataBase, try again";


        }


        public async Task sendMail(ServiceRequest req)
        {






            List<User> users = new List<User>();

            users.Add(_db.Users.FirstOrDefault(x => x.UserId == req.UserId));

            if (req.Status != 1)
            {
                users.Add(_db.Users.FirstOrDefault(x => x.UserId == req.ServiceProviderId));
            }






            await Task.Run(() =>
            {
                foreach (var temp in users)
                {

                    MimeMessage message = new MimeMessage();

                    MailboxAddress from = new MailboxAddress("Helperland","darshitkavathiya34@gmail.com");
                    message.From.Add(from);

                    MailboxAddress to = new MailboxAddress(temp.FirstName, temp.Email);
                    message.To.Add(to);

                    message.Subject = "Service Request Updated";

                    BodyBuilder bodyBuilder = new BodyBuilder();
                    bodyBuilder.HtmlBody = "<h1>A service with ID number " + req.ServiceRequestId + " has been updated</h1><br>" + "<h2>With time : " + req.ServiceStartDate + "</h2>";



                    message.Body = bodyBuilder.ToMessageBody();

                    SmtpClient client = new SmtpClient();
                    client.Connect("smtp.gmail.com", 587, false);
                mailto: client.Authenticate("darshitkavathiya34@gmail.com", "Dar@1234");
                    client.Send(message);
                    client.Disconnect(true);
                    client.Dispose();

                }


            });



        }



        /*   Good To Have */

        public JsonResult GetAdminRefundData(ServiceRequest Id)
        {


            Console.WriteLine(Id.ServiceRequestId);
            var req = _db.ServiceRequests.FirstOrDefault(x => x.ServiceRequestId == Id.ServiceRequestId);


            var myData = new
            {
                TotalCost = req.TotalCost,
                RefundAmount = req.RefundedAmount             
               
            };
           
            return Json(myData);
        }

        public string AdminRefundUpdate(ServiceRequest req)
        {
            Console.WriteLine(req.RefundedAmount);
            Console.WriteLine(req.ServiceRequestId);


            ServiceRequest obj = _db.ServiceRequests.FirstOrDefault(x=>x.ServiceRequestId == req.ServiceRequestId);

            
            obj.RefundedAmount = req.RefundedAmount;
            
            var result = _db.ServiceRequests.Update(obj);

            _db.SaveChanges();

            if(result != null)
            {

                return "true";
            }

            return "error";
        }































    }

}
