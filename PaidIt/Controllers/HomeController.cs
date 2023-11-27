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

        private static string? _userdataFilePath;

        private static dynamic? get_data_from_json;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            EstablishPython();

            if(_userdataFilePath != null)
            {
                ChartData();
            }

            return View();
        }

        public IActionResult Goals()
        {
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

            get_data_from_json = _scope.GetVariable("get_data_from_json");
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public ActionResult ChartData()
        {
            var jsonData = System.IO.File.ReadAllText(_userdataFilePath);
            var data = JsonSerializer.Deserialize<Dictionary<string, object>>(jsonData);

            ViewBag.ChartData = data;

            return View();
        }

        [HttpPost]
        public ActionResult SendNewAccount(string accountName)
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
        public ActionResult SendNewData(string accountName, string date, int amount)
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
                ChartData();
            }

            return new EmptyResult();
        }

        [HttpPost]
        public async Task<IActionResult> OverwriteUserdata(IFormFile userdataJSON)
        {
            if (userdataJSON == null || userdataJSON.Length == 0)
            {
                return RedirectToAction("Index");
            }

            using (var stream = new FileStream(_userdataFilePath, FileMode.Create))
            {
                await userdataJSON.CopyToAsync(stream);
            }

            return RedirectToAction("Index");
        }
    }
}