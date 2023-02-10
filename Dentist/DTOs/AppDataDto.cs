using System;
using System.Collections.Generic;
using System.Linq;
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

        public AppDataDto GetAppData()
        {
            this.AreaList = DataCache.AreaList.Where(x => !string.IsNullOrEmpty(x)).ToList();
            this.CenterHeader = DataCache.CenterHeader.Where(x => !string.IsNullOrEmpty(x)).ToList();
            this.AlignRightHeader = DataCache.AlignRightHeader.Where(x => !string.IsNullOrEmpty(x)).ToList();
            this.RequirementList = DataCache.RequirementList.Where(x => !string.IsNullOrEmpty(x)).ToList();
            this.Notes = DataCache.Notes.Where(x => !string.IsNullOrEmpty(x)).ToList();

            for (var i = 0; i < DataCache.TreatmentList.Count; i++)
            {
                if (!string.IsNullOrEmpty(DataCache.TreatmentList[i]))
                {
                    this.TreatmentList.Add(new TreatmentDetailsDto()
                    {
                        Name = DataCache.TreatmentList[i],
                        Cost = string.IsNullOrEmpty(DataCache.TreatmentScore[i])? 0 : decimal.Parse(DataCache.TreatmentScore[i]),
                    });
                }
            }


            return this;
        }
    }
}