using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dentist.DTOs
{
    public class TreatmentCategoryDto
    {
        public string Name { get; set; }

        public List<TreatmentDetailsDto> TreatmentDetails
        {
            get;
            set;
        }
    }
}