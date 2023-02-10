using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using Dentist.Cache;
using DataTable = Microsoft.Office.Interop.Excel.DataTable;

namespace Dentist.Services
{
    public class ExcelHelper
    {

        public void ReadData()
        {
            var dir = AppDomain.CurrentDomain.BaseDirectory;
            string path = $"{dir}Files\\FILL IN OPTIONS.xlsx";

            Microsoft.Office.Interop.Excel.Application objXL = null;
            Microsoft.Office.Interop.Excel.Workbook objWB = null;
            objXL = new Microsoft.Office.Interop.Excel.Application();
            objWB = objXL.Workbooks.Open(path);
            Microsoft.Office.Interop.Excel.Worksheet objSHT = objWB.Worksheets[1];

            int rows = objSHT.UsedRange.Rows.Count;
            int cols = objSHT.UsedRange.Columns.Count;
            System.Data.DataTable dt = new System.Data.DataTable();
            int noofrow = 1;

            for (int c = 1; c <= cols; c++)
            {
                string colname = objSHT.Cells[1, c].Text;
                dt.Columns.Add(colname);
                noofrow = 2;
            }

            for (int r = noofrow; r <= rows; r++)
            {
                DataRow dr = dt.NewRow();
                for (int c = 1; c <= cols; c++)
                {
                    dr[c - 1] = objSHT.Cells[r, c].Text;
                }

                dt.Rows.Add(dr);
            }

            objWB.Close();
            objXL.Quit();


            DataCache.AreaList = dt.AsEnumerable().Select(r => r.Field<string>("AREA LIST")).ToList();
            DataCache.CenterHeader = dt.AsEnumerable().Select(r => r.Field<string>("CENTER HEADER")).ToList();
            DataCache.AlignRightHeader = dt.AsEnumerable().Select(r => r.Field<string>("ALIGN RIGHT HEADER")).ToList();
            DataCache.RequirementList = dt.AsEnumerable().Select(r => r.Field<string>("requirements LIST")).ToList();
            DataCache.TreatmentList = dt.AsEnumerable().Select(r => r.Field<string>("TREATMENT LIST")).ToList();
            DataCache.TreatmentScore = dt.AsEnumerable().Select(r => r.Field<string>("TREATMENT SCORE")).ToList();
            DataCache.Notes = dt.AsEnumerable().Select(r => r.Field<string>("Note")).ToList();
        }

    }
}