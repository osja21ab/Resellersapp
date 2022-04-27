window.addEventListener('DOMContentLoaded', (event) => {
    //Tjek om brugeren der er logget ind (i localstorage) er Status_id 2 (Admin)
    if (JSON.parse(localStorage.getItem('user')).Status_id == 2) {
        document.getElementById('menuitems').innerHTML += "<li class='nav-item'><a class='nav-link' href='adminupdateuser'>Admin - Opdater Bruger</a></li>"
        document.getElementById('menuitems').innerHTML += "<li class='nav-item'><a class='nav-link' href='admindeleteuser'>Admin - Slet Bruger</a></li>"
        document.getElementById('menuitems').innerHTML += "<li class='nav-item'><a class='nav-link' href='brugsstatistikker'>Admin - Brugsstatistikker</a></li>"

    }
})