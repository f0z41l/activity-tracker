const menuButton = document.getElementById("menuButton");

const sidebar = document.getElementById("sidebar");

const sidebarOverlay = document.getElementById("sidebarOverlay");


if (menuButton) {

    menuButton.addEventListener("click", () => {

        sidebar.classList.toggle("active");

        sidebarOverlay.classList.toggle("active");

    });

}


if (sidebarOverlay) {

    sidebarOverlay.addEventListener("click", () => {

        sidebar.classList.remove("active");

        sidebarOverlay.classList.remove("active");

    });

}


document.addEventListener("DOMContentLoaded", () => {

    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

});