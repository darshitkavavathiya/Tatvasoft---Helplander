using System;
namespace Helperland.ViewModel
{
    public class ScheduleService
    {

        public DateTime Date { get; set; }

        public string Time { get; set; }


        public int Duration { get; set; }


        public Extra extra { get; set; }

        public String Comments { get; set; }

        public bool havePet { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public bool Remember { get; set; }
    }
}
