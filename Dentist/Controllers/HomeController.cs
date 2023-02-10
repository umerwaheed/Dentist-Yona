using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Dentist.DTOs;
using Dentist.Services;

namespace Dentist.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }


        [HttpGet]
        public JsonResult GetAppData()
        {
            AppDataDto appData = new AppDataDto();
            var data = appData.GetAppData();

            return Json(data, JsonRequestBehavior.AllowGet);
        
        }
    }
}