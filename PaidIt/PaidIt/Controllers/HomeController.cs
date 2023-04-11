using IronPython.Hosting;
using Microsoft.AspNetCore.Mvc;
using Paidit.Models;
using System.Diagnostics;
using System.IO;

namespace Paidit.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            var engine = Python.CreateEngine();
            var scope = engine.CreateScope();
            var libraries = new[]
            {
                "C:\\Program Files (x86)\\Microsoft Visual Studio 14.0\\Common7\\IDE\\Extensions\\Microsoft\\Python Tools for Visual Studio\\2.2",
                "E:\\Not_Windows\\Code\\IronPython\\Lib",
                "E:\\Not_Windows\\Code\\IronPython\\DLLs",
                "E:\\Not_Windows\\Code\\IronPython",
                "E:\\Not_Windows\\Code\\IronPython\\lib\\site-packages"
            };

            engine.SetSearchPaths(libraries);

            var pythonSource = engine.CreateScriptSourceFromFile(Path.Combine(Directory.GetCurrentDirectory(), "PythonScripts", "PythonScript.py"));
            pythonSource.Execute(scope);

            

            return View();
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
    }
}