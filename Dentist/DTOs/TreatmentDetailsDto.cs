using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Dentist.DTOs
{
    public class TreatmentDetailsDto
    {
        public string Category { get; set; }
        public string Name { get; set; }
        public decimal Cost { get; set; }
    }
}