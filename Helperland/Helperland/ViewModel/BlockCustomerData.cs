using Helperland.Models;
using Newtonsoft.Json;

namespace Helperland.ViewModel
{
    public class BlockCustomerData
    {
        
        public  User user { get; set; }
      
        public FavoriteAndBlocked favoriteAndBlocked { get; set; }
    }
}
