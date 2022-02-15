function set_service(evt, level) {
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


function extrabtnclick(id, i) {

    var discount = parseInt(document.getElementById("discount").innerHTML)
    if (document.getElementById(id).checked) {
        document.getElementById(id + "Img").src = (" ../images/" + i + "-green.png");

        document.getElementById("extra" + i).style.display = "block";

        var total_time = parseFloat(document.getElementById("total_hours").innerHTML);
        document.getElementById("total_hours").innerHTML = total_time + 0.5;
        var total_price = parseFloat(document.getElementById("total_price").innerHTML);
        document.getElementById("total_price").innerHTML = total_price + 5;
        document.getElementById("priceAfterDiscount").innerHTML = total_price + 5 - discount;
        document.getElementById("priceAfterPromo").innerHTML = total_price + 5 - discount-10;
        

    } else {
        document.getElementById(id + "Img").src = (" ../images/" + i + ".png");

        document.getElementById("extra" + i).style.display = "none";

        var total_time = parseFloat(document.getElementById("total_hours").innerHTML);
        document.getElementById("total_hours").innerHTML = total_time - 0.5;
        var total_price = parseFloat(document.getElementById("total_price").innerHTML);
        document.getElementById("total_price").innerHTML = total_price - 5;
        document.getElementById("priceAfterDiscount").innerHTML = total_price - 5 - discount;
        document.getElementById("priceAfterPromo").innerHTML = total_price - 5 - discount - 10;

    }
}