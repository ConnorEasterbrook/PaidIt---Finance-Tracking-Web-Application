var inputMenu = document.getElementById("inputMenu");
var button = document.getElementById("add");
var span = document.getElementsByClassName("close")[0];

button.onclick = function () 
{
    // inputMenu.style.display = "block";

    inputMenu.style.visibility = "visible";
    inputMenu.style.transition = 'all 0.2s';
    inputMenu.style.opacity = '1';
}

span.onclick = function ()
{
    // inputMenu.style.display = "none";

    inputMenu.style.visibility = "hidden";
    inputMenu.style.transition = 'all 0.2s';
    inputMenu.style.opacity = '0';
}

window.onclick = function (event)
{
    if (event.target == inputMenu)
    {
        // inputMenu.style.display = "none";

        inputMenu.style.visibility = "hidden";
        inputMenu.style.transition = 'all 0.2s';
        inputMenu.style.opacity = '0';
    }
}

