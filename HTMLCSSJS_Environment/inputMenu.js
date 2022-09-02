var inputMenu = document.getElementById("inputMenu");
var button = document.getElementById("add");
var span = document.getElementsByClassName("close")[0];

button.onclick = function () 
{
    inputMenu.style.display = "block";
}

span.onclick = function ()
{
    inputMenu.style.display = "none";
}

window.onclick = function (event)
{
    if (event.target == inputMenu)
    {
        inputMenu.style.display = "none";
    }
}