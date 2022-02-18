
const hamburger = document.querySelector(".hamburger");
const vtab = document.querySelector(".tab");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    vtab.classList.toggle("active");
})

document.querySelectorAll(".tablinks").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    vtab.classList.remove("active");
}))





function upcoming_service(evt, service) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-contant");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(service).style.display = "block";
    evt.currentTarget.className += " active";
}
document.getElementById("defaultOpen").click();