namespace Helperland.ViewModel
{
    public class RatingDTO
    {
       public int ServiceRequestId { get; set; }
        public string CustomerName { get; set; }

        public string ServiceDate { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }

        public double Rating { get; set; }

        public string Remarks { get; set; }

        public string Comments { get; set; }
    }
}
