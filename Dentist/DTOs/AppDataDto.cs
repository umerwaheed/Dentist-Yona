using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Web;
using Dentist.Cache;

namespace Dentist.DTOs
{
    public class AppDataDto
    {
        public List<string> AreaList = new List<string>();
        public List<string> CenterHeader = new List<string>();
        public List<string> AlignRightHeader = new List<string>();
        public List<string> RequirementList = new List<string>();
        public List<TreatmentDetailsDto> TreatmentList = new List<TreatmentDetailsDto>();
        public List<string> Notes = new List<string>();
        public List<TreatmentCategoryDto> TreatmentCategory = new List<TreatmentCategoryDto>();

        public AppDataDto GetAppData()
        {
            this.AreaList = DataCache.AreaList.Where(x => !string.IsNullOrEmpty(x)).ToList();
            this.CenterHeader = DataCache.CenterHeader.Where(x => !string.IsNullOrEmpty(x)).ToList();
            this.AlignRightHeader = DataCache.AlignRightHeader.Where(x => !string.IsNullOrEmpty(x)).ToList();
            this.RequirementList = DataCache.RequirementList.Where(x => !string.IsNullOrEmpty(x)).ToList();
            this.Notes = DataCache.Notes.Where(x => !string.IsNullOrEmpty(x)).ToList();

            string lastCategory = "Default";

            for (var i = 0; i < DataCache.TreatmentList.Count; i++)
            {
                if (!string.IsNullOrEmpty(DataCache.TreatmentList[i]))
                {
                    if (!string.IsNullOrEmpty(DataCache.TreatmentCategory[i]))
                    {
                        lastCategory = DataCache.TreatmentCategory[i];
                    }
                    this.TreatmentList.Add(new TreatmentDetailsDto()
                    {
                        Category = lastCategory,
                        Name = DataCache.TreatmentList[i],
                        Cost = string.IsNullOrEmpty(DataCache.TreatmentPrice[i])? 0 : decimal.Parse(DataCache.TreatmentPrice[i]),
                    });
                }
            }

            this.TreatmentCategory = this.TreatmentList
                .GroupBy(x => x.Category)
                .Select(x => new TreatmentCategoryDto()
                {
                    Name = x.Key,
                    TreatmentDetails = x.ToList()
                }).ToList();

            return this;
        }
    }
}