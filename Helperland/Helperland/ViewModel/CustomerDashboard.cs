using System;

namespace Helperland.ViewModel
{
    public class CustomerDashboard
    {




    
  
        public int ServiceRequestId { get; set; }

        public string Date { get; set; }

        public string StartTime { get; set; }

        public string EndTime { get; set; }

        public string ServiceProvider { get; set; }
        public string UserProfilePicture { get; set; }

        public decimal SPRatings { get; set; }

        public string SPAvatar { get; set; }

        public decimal Duration { get; set; }

        public int Status { get; set; }

        public bool Cabinet { get; set; }

        public bool Oven { get; set; }

        public bool Fridge { get; set; }

        public bool Laundry { get; set; }

        public bool Window { get; set; }

        public decimal TotalCost { get; set; }

        public string Address { get; set; }

        public string PhoneNo { get; set; }

        public string Email { get; set; }

        public string Comments { get; set; }
        public float AverageRating { get; set; }
    }
}
