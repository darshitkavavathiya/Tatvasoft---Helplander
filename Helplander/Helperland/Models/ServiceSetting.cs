using System;
using System.Collections.Generic;

#nullable disable

namespace Helperland.Models
{
    public partial class ServiceSetting
    {
        public int Id { get; set; }
        public int ActionType { get; set; }
        public int Interval { get; set; }
        public TimeSpan ScheduleTime { get; set; }
        public DateTime LastPoll { get; set; }
    }
}
