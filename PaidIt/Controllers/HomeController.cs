using IronPython.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Scripting.Hosting;
using Paidit.Models;
using System.Diagnostics;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Paidit.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        private ScriptEngine? _engine;
        private ScriptScope? _scope;

        private static string _userdataFilePath = "";

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            EstablishPython();

            if(_userdataFilePath != null)
            {
                var jsonData = System.IO.File.ReadAllText(_userdataFilePath);
                ViewBag.ChartData = jsonData;
            }

            return View();
        }

        private void EstablishPython()
        {
            _engine = Python.CreateEngine();
            _scope = _engine.CreateScope();

            _userdataFilePath = Path.Combine(Directory.GetCurrentDirectory(), "userdata.json");
            if(!System.IO.File.Exists(_userdataFilePath))
            {
                System.IO.File.WriteAllText(_userdataFilePath, "{}");
            }

            string _pythonPath = Path.Combine(Directory.GetCurrentDirectory(), "PythonScripts", "PythonScript.py");
            _engine.ExecuteFile(_pythonPath, _scope);

            dynamic read_json_file = _scope.GetVariable("read_json_file");
            read_json_file(_userdataFilePath);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [HttpPost]
        public ActionResult SendNewAccountAjax(string accountName)
        {
            EstablishPython();

            if (_engine == null || _scope == null)
            {
                return new EmptyResult();
            }

            dynamic add_bank_account = _scope.GetVariable("add_bank_account");
            add_bank_account(_userdataFilePath, accountName);

            return new EmptyResult();
        }

        [HttpPost]
        public ActionResult SendNewDataAjax(string accountName, string date, int amount)
        {
            EstablishPython();

            if (_engine == null || _scope == null)
            {
                return new EmptyResult();
            }

            dynamic add_data_to_account = _scope.GetVariable("add_data_to_account");

            add_data_to_account(_userdataFilePath, accountName, date, amount);

            if (_userdataFilePath != null)
            {
                var jsonData = System.IO.File.ReadAllText(_userdataFilePath);
                ViewBag.ChartData = jsonData;
            }

            return new EmptyResult();
        }
    }
}