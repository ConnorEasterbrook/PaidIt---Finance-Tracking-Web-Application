using IronPython.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Scripting.Hosting;
using Paidit.Models;
using System.Diagnostics;

namespace Paidit.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        private ScriptEngine? _engine;
        private ScriptScope? _scope;

        private string? _pythonPath;
        private string? _userDataPath;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            EstablishPython();
            return View();
        }

        private void EstablishPython()
        {
            _engine = Python.CreateEngine();
            _scope = _engine.CreateScope();
            var libraries = new[]
            {
                "C:\\Program Files (x86)\\Microsoft Visual Studio 14.0\\Common7\\IDE\\Extensions\\Microsoft\\Python Tools for Visual Studio\\2.2",
                "E:\\Not_Windows\\Code\\IronPython\\Lib",
                "E:\\Not_Windows\\Code\\IronPython\\DLLs",
                "E:\\Not_Windows\\Code\\IronPython",
                "E:\\Not_Windows\\Code\\IronPython\\lib\\site-packages"
            };

            _engine.SetSearchPaths(libraries);

            _userDataPath = Path.Combine(Directory.GetCurrentDirectory(), "userdata.json");
            if(!System.IO.File.Exists(_userDataPath))
            {
                System.IO.File.WriteAllText(_userDataPath, "{}");
            }

            _pythonPath = Path.Combine(Directory.GetCurrentDirectory(), "PythonScripts", "PythonScript.py");
            _engine.ExecuteFile(_pythonPath, _scope);

            dynamic read_json_file = _scope.GetVariable("read_json_file");
            read_json_file(_userDataPath);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
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
            add_bank_account(_userDataPath, accountName);

            return new EmptyResult();
        }
    }
}