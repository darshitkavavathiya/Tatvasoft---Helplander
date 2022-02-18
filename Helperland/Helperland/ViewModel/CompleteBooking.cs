using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Helperland.ViewModel
{
    public class CompleteBooking
    {
        public int AddressId { get; set; }
        public DateTime ServiceStartDate { get; set; }

        public float ServiceHours { get; set; }
        public float ExtraHours { get; set; }
        public float SubTotal { get; set; }


        public float TotalCost { get; set; }
        public string Comments { get; set; }
        public bool HasPet { get; set; }
        public bool Cabinet { get; set; }
        public bool Window { get; set; }
        public bool Laundry { get; set; }
        public bool Oven { get; set; }
        public bool Fridge { get; set; }
        public string PostalCode { get; set; }
    }
}

