using IronPython.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Scripting.Hosting;
using Paidit.Configuration;
using Paidit.Models;
using System.Diagnostics;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Paidit.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private ScriptScope scope;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;

            scope = EstablishPython();
        }

        public IActionResult Index()
        {
            if(!System.IO.File.Exists(SiteConstants.UserdataFilePath))
            {
                System.IO.File.WriteAllText(SiteConstants.UserdataFilePath, "{}");
            }

            var jsonData = System.IO.File.ReadAllText(SiteConstants.UserdataFilePath);
            ViewBag.ChartData = jsonData;

            return View();
        }

        private ScriptScope EstablishPython()
        {
            ScriptEngine engine = Python.CreateEngine();
            ScriptScope scope = engine.CreateScope();

            string _pythonPath = Path.Combine(Directory.GetCurrentDirectory(), "PythonScripts", "PythonScript.py");
            engine.ExecuteFile(_pythonPath, scope);

            dynamic read_json_file = scope.GetVariable("read_json_file");
            read_json_file(SiteConstants.UserdataFilePath);

            return scope;
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [HttpPost]
        public ActionResult AddNewAccountAjax(string accountName)
        {
            if(scope == null)
            {
                return new EmptyResult();
            }

            dynamic add_bank_account = scope.GetVariable("add_bank_account");
            add_bank_account(SiteConstants.UserdataFilePath, accountName);

            return new EmptyResult();
        }

        [HttpPost]
        public ActionResult SendNewDataAjax(string accountName, string date, int amount)
        {
            if(scope == null)
            {
                return new EmptyResult();
            }

            dynamic add_data_to_account = scope.GetVariable("add_data_to_account");

            add_data_to_account(SiteConstants.UserdataFilePath, accountName, date, amount);
            var jsonData = System.IO.File.ReadAllText(SiteConstants.UserdataFilePath);
            ViewBag.ChartData = jsonData;

            return new EmptyResult();
        }
    }
}