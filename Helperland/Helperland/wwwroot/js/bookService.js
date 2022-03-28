/*-------------- tab nav control    ----------------------*/
function set_service(evt, level) {


    /*  disable tab*/
    var ch = parseInt(level.charAt(2));

    for (j = ch + 1; j <= 4; j++) {

        document.getElementById("form" + j + "Btn").disabled = true;

    }

    /*  tab click*/
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
        var tabImg = "";
        tabImg = tablinks[i].children[0].src;
        if (tabImg.includes("-")) {

            var tabdashindex = tabImg.lastIndexOf("-");
            var tabpath = tabImg.substring(tabdashindex + 1, tabImg.length);

            tablinks[i].children[0].src = "";
            tablinks[i].children[0].src = (" ../images/" + tabpath);

        }


    }

    document.getElementById(level).style.display = "block";
    evt.currentTarget.className += " active";


    var imgSrc = evt.currentTarget.children[0].src;
    var slashindex = imgSrc.lastIndexOf("/");

    var path = imgSrc.substring(slashindex + 1, imgSrc.length);


    evt.currentTarget.children[0].src = "";
    evt.currentTarget.children[0].src = (" ../images/" + "white-" + path);

}



document.getElementById("defaultOpen").click();

/*--------extrabtnclick ------------*/

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



/*---------------- Invoice dynemic start --------------------*/

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

    selected = $(".ForDate").val();
    document.querySelector('.SIForDate').innerHTML = selected;


    $(".ForDate").on("change", function () {
        selected = $(this).val();

        document.querySelector('.SIForDate').innerHTML = selected;

    });
});








/*---------------- Invoice dynemic end --------------------*/











function ClickFunction(id) {
   
    document.getElementById(id).click();

}

function Disable(id) {
    document.getElementById(id).disabled = true;
}
function Clickable(id) {
    document.getElementById(id).disabled = false;
}

Disable('form2Btn');
Disable('form3Btn');
Disable('form4Btn');





/*--------- Postalsubmit Function-----------*/


function postalSubmit() {

    var data = $("#form1").serialize();


    $.ajax({
        type: 'POST',
        url: '/Customer/ValidPostalCode',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: data,
        success: function (result) {
            if (result.value == "true")
            {
                Clickable("form2Btn");
                ClickFunction("form2Btn");

            }
            else if (result.value == "false")
            {
                document.getElementById("completemodelbtn").click();
                $('#NewServiceAcceptStatus').text("No service avaliable ").css("color", "red");
                $('#Model_SID').text("Please Try again").css("color", "gray");
              
            }
            else
            {
                document.getElementById("completemodelbtn").click();
                $('#NewServiceAcceptStatus').text("Invalid Postal code").css("color", "red");
                $('#Model_SID').text("Please Try again").css("color", "gray");
              
            }
        },
        error: function () {
            document.getElementById("acceptAlert").click();
            $('#NewServiceAcceptStatus').text("failed to receive the data").css("color", "Red");

            //console.log('Failed ');
        }
    });

}











/*--------- scheduleSubmit Function-----------*/




function scheduleSubmit() {

    var data = $("#form2").serialize();
    //console.log(data);



    $.ajax({
        type: 'POST',
        url: '/Customer/ScheduleService',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: data,
        success: function (result) {
            if (result.value == "true") {
                Clickable("form3Btn");
                ClickFunction("form3Btn");
                loadAddress();
            }
            else {

                document.getElementById("completemodelbtn").click();
                $('#NewServiceAcceptStatus').text("").css("color", "Red");
                $('#Model_SID').text("Please Try again").css("color", "gray");

             
            }
        },
        error: function () {
            document.getElementById("acceptAlert").click();
            $('#NewServiceAcceptStatus').text("failed to receive the data").css("color", "Red");
            //console.log('Failed ');
        }
    });
}


/*--------- loadAddress Function-----------*/


function loadAddress() {
    var data = $("#form1").serialize();
    $.ajax({
        type: 'get',
        url: '/customer/detailsservice',
        contenttype: 'application/x-www-form-urlencoded; charset=utf-8',
        data: data,
        success: function (result) {
            var address = $("#address");
            address.empty();
            address.append('<h2>Please select your address:</h2>');
            if (result.length == 0) {
                ClickFunction("addAddressBtn");
            }
            var isdefaultaddress = false;



            var checked = "checked";




            for (let i = 0; i < result.length; i++) {
               
               
                if (result[i].isDefault == true) {
                    checked = "checked";
                    isdefaultaddress = true;
                }
                //if (i == (result.length - 1)) {
                //    if (isdefaultaddress == false) {
                //        checked = "checked";
                //    }
                //}


                address.append(' <div class="row radiobutton">' +
                    '<div style="max-width: 10px" class="col-1"><input type="radio" id=" ' + i + ' " ' + checked + ' name="address" value="' + result[i].addressId + '" /></div>' +
                    ' <div class="col-11"><label for="' + i + '"><span>Address:</span><br><span>' + result[i].addressLine1 + '</span>,&nbsp;<span>' + result[i].addressLine2 + '</span><br><span>' + result[i].city + '</span>&nbsp;<span>' + result[i].postalCode + '</span>' +
                    '<br><span>PHONE NUMBER:</span> ' + result[i].mobile + ' <span></span></label></div> </div>');


                checked = "";
              
            } 
            //console.log(result);
        },
        error: function () {
            document.getElementById("acceptAlert").click();
            $('#NewServiceAcceptStatus').text("failed to receive the data").css("color", "Red");
            //console.log('failed ');
        }
    });
}


/*--------- addAddressdiv Function-----------*/
function getCityFromPostalCode(zip) {

    $.ajax({
        method: "GET",
        url: "https://api.postalpincode.in/pincode/" + zip,
        dataType: 'json',
        cache: false,
        success: function (result) {
            if (result[0].status == "Error" || result[0].status == "404") {
                $("#mSaddAddressAlert").removeClass("alert-success d-none").addClass("alert-danger").text("Enter Valid PostalCode.");

            }
            else {
                //console.log(result);
                $("#City").val(result[0].PostOffice[0].District);
                $("#State").val(result[0].PostOffice[0].State).prop("disabled", true);
                $("#City").prop("disabled", true);
            }
        },
        error: function (error) {

        }
    });
}

function addAddressdiv() {
   
    document.getElementById('addAddressBtn').style.display = "none";
    document.getElementById('addNewaddressDiv').style.display = "block";
    document.getElementById('addAddressPostalCode').value = document.getElementById("postalcode").value;
    document.getElementById('addAddressPostalCode').disabled = true;
    getCityFromPostalCode(document.getElementById("postalcode").value);

}










/*----------------Validation For form-3------------*/
var saveaddvalidation = {};

$(document).ready(function () {


    // Street Validation
    $('.street').on('focusout change keyup', function () {
        var Streetname = $(this).val();
        var validName = /^[a-zA-Z ]*$/;
        if (Streetname.length == 0) {
            $('.street-msg').addClass('Validation-Error').text("Street is required")

            saveaddvalidation.street = false;
        }
        else if (!validName.test(Streetname)) {
            $('.street-msg').addClass('Validation-Error').text('please enter valid input');

            saveaddvalidation.street = false;
        }
        else {
            $('.street-msg').empty();
            saveaddvalidation.street = true;
        }
    });




    //   Phone Number validation
    $('.mobilenum').on('focusout change keyup', function () {
        var mobileNum = $(this).val();
        var validNumber = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
        if (mobileNum.length == 0) {
            $('.mobile-msg').addClass('Validation-Error').text('Mobile Number is required');
            saveaddvalidation.mobileNum = false;
        }
        else if (!validNumber.test(mobileNum)) {
            saveaddvalidation.mobileNum = false;
            $('.mobile-msg').addClass('Validation-Error').text('Invalid Mobile Number');
        }
        else {
            $('.mobile-msg').empty();
            saveaddvalidation.mobileNum = true;
        }
    });


    //   house Number validation
    $('.houseno').on('focusout change keyup', function () {
        var houseNum = $(this).val();
        var validNumber = /^\d*$/;
        if (houseNum.length == 0) {
            saveaddvalidation.house = false;
            $('.house-msg').addClass('Validation-Error').text('House Number is required');

        }
        else if (!validNumber.test(houseNum)) {
            saveaddvalidation.house = false;
            $('.house-msg').addClass('Validation-Error').text('Enter Valid House Number');
        }
        else {
            $('.house-msg').empty();
            saveaddvalidation.house = true;
        }
    });
});












/*----------saveAddress Function-----------*/


function saveAddress() {
    var data = {};
    data.AddressLine1 = document.getElementById("AddressLine1").value;
    data.AddressLine2 = document.getElementById("AddressLine2").value;
    data.PostalCode = document.getElementById("addAddressPostalCode").value;
    data.City = document.getElementById("City").value;
    data.Mobile = document.getElementById("Mobile").value;
    data.state = document.getElementById("State").value;


    if (saveaddvalidation.mobileNum == true && saveaddvalidation.house == true && saveaddvalidation.street == true) {

        $.ajax({
            type: 'POST',
            url: '/Customer/AddNewAddress',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            data: data,
            success: function (result) {
                if (result.value == "true") {

                    ClickFunction("addressCancelBtn");
                    loadAddress();

                }
                else {
                    $("#detailServiceAlert").removeClass("d-none").text("Sorry! Something went wrong please try again later.");
                }
            },
            error: function () {
                document.getElementById("acceptAlert").click();
                $('#NewServiceAcceptStatus').text("failed to receive the data").css("color", "Red");
                //console.log('Failed ');
            }
        });
    }
}




//$("#addAddressPostalCode").keyup(function () {
//    //console.log($("#addAddressPostalCode").val());
//    if ($("#addAddressPostalCode").val().length == 6) {
//        getCityFromPostalCode($("#addAddressPostalCode").val());
//    }
//});



/*----------cancelAddress Function------------*/


function cancelAddress() {
    document.getElementById("addNewaddressDiv").style.display = "none";
    document.getElementById('addAddressBtn').style.display = "block";
}



/*-----------completeBookService Function-----------*/

function completeBookService() {

    if (!$('#tac').is(':checked')) {
        document.getElementById("acceptAlert").click();
        $('#NewServiceAcceptStatus').text("please accept terms and condition").css("color", "Red");
        $('#Model_SID').text("").css("color", "gray");
       
    } else {



        var data = {};
        var extrahour = 0;
        var cabinet = document.getElementById("InsideCabinat");
        var window = document.getElementById("InsideWindow");
        var fridge = document.getElementById("InsideFridge");
        var oven = document.getElementById("InsideOven");
        var laundry = document.getElementById("InsideLaundry");
        if (cabinet.checked == true) {
            extrahour += 0.5;
            data.cabinet = true;
        }
        if (window.checked == true) {
            extrahour += 0.5;
            data.window = true;
        }
        if (fridge.checked == true) {
            extrahour += 0.5;
            data.fridge = true;
        }
        if (oven.checked == true) {
            extrahour += 0.5;
            data.oven = true;
        }
        if (laundry.checked == true) {
            extrahour += 0.5;
            data.laundry = true;
        }
        data.postalCode = document.getElementById("postalcode").value;



        var temp = document.getElementById("Date").value;
        data.serviceStartDate = temp + " " + document.getElementById("Time").value;



        data.serviceHours = document.getElementById("Duration").value;
        data.extraHours = extrahour;
        var duration = parseFloat(document.getElementById("Duration").value);
        var extra = parseFloat(extrahour);
        data.subTotal = (extra + duration) * 25;
        data.totalCost = data.subTotal; //Discount 0(out of scope)
        data.comments = document.getElementById("comments").value;
        data.HasPet = document.getElementById("flexCheckDefault").checked;


        data.addressId = document.querySelector('input[name="address"]:checked').value;


        $.ajax({
            type: 'post',
            url: '/customer/completebooking',
            contenttype: 'application/x-www-form-urlencoded; charset=utf-8',
            data: data,
            success: function (result) {
                if (result.value == "false") {
                    $('#NewServiceAcceptStatus').text("Opps! Something Went wrong").css("color", "red");
                    $('#Model_SID').text("Please Try again");
                    ClickFunction("acceptAlert");

                }
                else {


                    $('#NewServiceAcceptStatus').text("Service Request has been Created Successfully").css("color", "Green");
                    $('#Model_SID').text("Your service id : " + result.value);
           
                    ClickFunction("defaultOpen");
                  
                    ClickFunction("acceptAlert");
                  
                 
                   
                }
            },
            error: function () {
                document.getElementById("acceptAlert").click();
                $('#NewServiceAcceptStatus').text("failed to receive the data").css("color", "Red");
         
                //console.log('failed ');
            }
        });
    }
}



