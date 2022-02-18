
function set_service(evt, level) {

    var ch = parseInt(level.charAt(2));

    for (j = ch + 1; j <= 4; j++) {

        document.getElementById("form" + j + "Btn").disabled = true;

    }


    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(level).style.display = "block";
    evt.currentTarget.className += " active";
}
document.getElementById("defaultOpen").click();



function extrabtnclick(id, i) {

    var discount = parseInt(document.getElementById("discount").innerHTML);
    var promo = parseInt(document.getElementById("promo").innerHTML);
    if (

        document.getElementById(id).checked) {
        document.getElementById(id + "Img").src = (" ../images/" + i + "-green.png");
        document.getElementById("extra" + i).style.display = "block";
        var total_time = parseFloat(document.getElementById("total_hours").innerHTML);
        document.getElementById("total_hours").innerHTML = total_time + 0.5;
        var total_price = parseFloat(document.getElementById("total_price").innerHTML);
        document.getElementById("total_price").innerHTML = total_price + 12.5;
        document.getElementById("priceAfterDiscount").innerHTML = total_price + 12.5 - discount;
        document.getElementById("priceAfterPromo").innerHTML = total_price + 12.5 - discount - promo;

    } else {

        document.getElementById(id + "Img").src = (" ../images/" + i + ".png");
        document.getElementById("extra" + i).style.display = "none";
        var total_time = parseFloat(document.getElementById("total_hours").innerHTML);
        document.getElementById("total_hours").innerHTML = total_time - 0.5;
        var total_price = parseFloat(document.getElementById("total_price").innerHTML);
        document.getElementById("total_price").innerHTML = total_price - 12.5;
        document.getElementById("priceAfterDiscount").innerHTML = total_price - 12.5 - discount;
        document.getElementById("priceAfterPromo").innerHTML = total_price - 12.5 - discount - promo;

    }
}





$(document).ready(function () {


    var ServiceTime = $(".ForTime option:selected").text();
    document.querySelector(".SIForTime").innerHTML = ServiceTime;

    $(".ForTime").on("change", function () {
        var ChangeServiceTime = $(".ForTime option:selected").text();
        document.querySelector(".SIForTime").innerHTML = ChangeServiceTime;

    });

});




$(document).ready(function () {


    var Duration = $(".ForDuration option:selected").val();
    document.querySelector(".SIForDuration").innerHTML = Duration;

    $(".ForDuration").on("change", function () {
        var basic_time = $(".SIForDuration").text();
        var total_time = $("#total_hours").text();
        var extra_time = parseFloat(total_time - basic_time);
        var ChangeDuration = $(".ForDuration option:selected").val();
        var newtotal_time = parseFloat(ChangeDuration) + extra_time;
        var discount = parseInt(document.querySelector("#discount").innerHTML);
        var promo = parseInt(document.querySelector("#promo").innerHTML);
        var new_price = newtotal_time * 25;
        document.querySelector(".SIForDuration").innerHTML = ChangeDuration;
        document.querySelector("#total_hours").innerHTML = newtotal_time;
        document.querySelector("#total_price").innerHTML = new_price;
        document.querySelector('#priceAfterDiscount').innerHTML = new_price - discount;
        document.querySelector('#priceAfterPromo').innerHTML = new_price - discount - promo;

    });

});







$(document).ready(function () {
    //var currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    //var day = currentDate.getDate();
    //var month = currentDate.getMonth() + 1;
    //var year = currentDate.getFullYear();
    //var tomorrow_date = day + "/" + month + "/" + year;
    //document.querySelector('.SIForDate').innerHTML = tomorrow_date;

    //$(".ForDate").datepicker({
    //    dateFormat: "dd/mm/yy",
    //    minDate: "+1d",

    //});

    selected = $(".ForDate").val();
    document.querySelector('.SIForDate').innerHTML = selected;


    $(".ForDate").on("change", function () {
        selected = $(this).val();

        document.querySelector('.SIForDate').innerHTML = selected;

    });
});




