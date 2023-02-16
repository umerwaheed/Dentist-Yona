using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using Dentist.Cache;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;



namespace Dentist.Services
{
    public class ExcelHelper
    {
        public List<string> columns = new List<string>()
        {
            "A", "B", "C", "D","E","F","G","H","I","J","K","L","M","N","O"
        };
        public void ReadData()
        {
            var dir = AppDomain.CurrentDomain.BaseDirectory;
            string path = $"{dir}Files\\FILL IN OPTIONS.xlsx";
            //Create a worksheet
            var table = new DataTable();
            using (SpreadsheetDocument spreadSheetDocument = SpreadsheetDocument.Open(path, false))
            {
                WorkbookPart workbookPart = spreadSheetDocument.WorkbookPart;
                IEnumerable<Sheet> sheets = spreadSheetDocument.WorkbookPart.Workbook.GetFirstChild<Sheets>().Elements<Sheet>();
                string relationshipId = sheets.First().Id.Value;
                WorksheetPart worksheetPart = (WorksheetPart)spreadSheetDocument.WorkbookPart.GetPartById(relationshipId);
                Worksheet workSheet = worksheetPart.Worksheet;
                SheetData sheetData = workSheet.GetFirstChild<SheetData>();
                IEnumerable<Row> rows = sheetData.Descendants<Row>();

                var rowsCount = rows.Count();

                foreach (var column in columns)
                {
                    Cell theCell = worksheetPart.Worksheet.Descendants<Cell>().Where(c => c.CellReference == $"{column}1").FirstOrDefault();
                    var cellValue = GetCellValue(spreadSheetDocument, theCell);
                    table.Columns.Add(cellValue);
                }


                for (int i = 1; i <= rowsCount; i++)
                {
                    DataRow tempRow = table.NewRow();
                    for (int j=0;j<columns.Count;j++)
                    {
                        Cell theCell = worksheetPart.Worksheet.Descendants<Cell>().Where(c => c.CellReference == $"{columns[j]}{i}").FirstOrDefault();
                        var cellValue = GetCellValue(spreadSheetDocument, theCell);
                        tempRow[j] = cellValue;
                    }

                    table.Rows.Add(tempRow);
                }
            }
            table.Rows.RemoveAt(0);
           
            DataCache.AreaList = table.AsEnumerable().Select(r => r.Field<string>("AREA LIST")).ToList();
            DataCache.CenterHeader = table.AsEnumerable().Select(r => r.Field<string>("CENTER HEADER")).ToList();
            DataCache.AlignRightHeader = table.AsEnumerable().Select(r => r.Field<string>("ALIGN RIGHT HEADER")).ToList();
            DataCache.RequirementList = table.AsEnumerable().Select(r => r.Field<string>("requirements LIST")).ToList();
            DataCache.TreatmentList = table.AsEnumerable().Select(r => r.Field<string>("TREATMENT LIST")).ToList();
            DataCache.TreatmentCategory = table.AsEnumerable().Select(r => r.Field<string>("Column1")).ToList();
            DataCache.TreatmentPrice = table.AsEnumerable().Select(r => r.Field<string>("TREATMENT PRICE")).ToList();
            DataCache.Notes = table.AsEnumerable().Select(r => r.Field<string>("Note")).ToList();
        }
        public static string GetCellValue(SpreadsheetDocument document, Cell cell)
        {
            SharedStringTablePart stringTablePart = document.WorkbookPart.SharedStringTablePart;
            if (cell !=null && cell.CellValue != null)
            {
                string value = cell.CellValue.InnerXml;
                if (cell.DataType != null && cell.DataType.Value == CellValues.SharedString)
                {
                    return stringTablePart.SharedStringTable.ChildElements[Int32.Parse(value)].InnerText;
                }
                else
                {
                    return value;
                }
            }
            else
            {
                return string.Empty;
            }
        }

        //    int rows = objSHT.UsedRange.Rows.Count;
        //    int cols = objSHT.UsedRange.Columns.Count;
        //    System.Data.DataTable dt = new System.Data.DataTable();
        //    int noofrow = 1;

        //        for (int c = 1; c <= cols; c++)
        //    {
        //        string colname = objSHT.Cells[1, c].Text;
        //        dt.Columns.Add(colname);
        //        noofrow = 2;
        //    }

        //for (int r = noofrow; r <= rows; r++)
        //{
        //    DataRow dr = dt.NewRow();
        //    for (int c = 1; c <= cols; c++)
        //    {
        //        dr[c - 1] = objSHT.Cells[r, c].Text;
        //    }

        //    dt.Rows.Add(dr);
        //}



    }
}