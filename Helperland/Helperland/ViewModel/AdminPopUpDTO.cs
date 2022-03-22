using Helperland.Models;

namespace Helperland.ViewModel
{
    public class AdminPopUpDTO
    {





        public ServiceRequestAddress address { get; set; }

        public int ServiceRequestId { get; set; }

        public string Date { get; set; }


        //public DateTime ServiceStartDate { get; set; }


        public string StartTime { get; set; }


        public string WhyReschedule { get; set; }   

        public string CallCenterNote    { get; set; }
    }
}
