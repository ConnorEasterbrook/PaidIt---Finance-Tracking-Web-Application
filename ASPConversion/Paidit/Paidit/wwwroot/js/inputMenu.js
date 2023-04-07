function ShowInputMenu()
{
    var inputMenu = document.getElementById("inputMenu");
    inputMenu.style.visibility = "visible";
    inputMenu.style.transition = 'all 0.2s';
    inputMenu.style.opacity = '1';
}

function HideInputMenu()
{
    var inputMenu = document.getElementById("inputMenu");
    inputMenu.style.visibility = "hidden";
    inputMenu.style.transition = 'all 0.2s';
    inputMenu.style.opacity = '0';
}

