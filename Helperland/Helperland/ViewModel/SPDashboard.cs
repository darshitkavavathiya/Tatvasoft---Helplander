namespace Helperland.ViewModel
{
    public class SPDashboard
    {
        public int ServiceRequestId { get; set; }

    
        public string Date { get; set; }

        


        public string StartTime { get; set; }

        public string EndTime { get; set; }

        public string CustomerName { get; set; }
        
        public decimal Duration { get; set; }

        public int Status { get; set; }

        public bool Cabinet { get; set; }

        public bool Oven { get; set; }

        public bool Fridge { get; set; }

        public bool Laundry { get; set; }

        public bool Window { get; set; }

        public decimal TotalCost { get; set; }

        public string Address { get; set; }

        public string ZipCode { get; set; }

        public string Comments { get; set; }
       
        public bool HasPet { get; set; }

        public bool Complete { get; set; }  
    }
}
