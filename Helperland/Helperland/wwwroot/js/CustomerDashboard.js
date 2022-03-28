/*tab btn click start */
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

var vTabId = "dashboardTabBtn";


var url1 = new URLSearchParams(window.location.search);
var urlcust = url1.toString();
if (urlcust.includes("=")) {
    var indexofequl = urlcust.lastIndexOf("=");
    vTabId = urlcust.substring(indexofequl + 1, urlcust.length);
}
document.getElementById(vTabId).click();

/* tab btn click end */



/*----------------- js for dashboard ------------*/


/* for row click in dashboard */



var serviceRequestId = "";
$("#dashbordTable").click(function (e) {


    serviceRequestId = e.target.closest("tr").getAttribute("data-value");

    if (e.target.classList == "customerReschedule") {
      
     
        document.getElementById("updateRequestId").value = e.target.value;
        

    }
    if (e.target.classList == "customerCancel") {
        document.getElementById("CancelRequestId").value = e.target.value;
    }

    if (serviceRequestId != null && (e.target.classList != "customerCancel" && e.target.classList != "customerReschedule")) {


        document.getElementById("serviceReqdetailsbtn").click();
      
    }
    //console.log(e);
});

/* for row click in cs */


$("#ServiceHistoryTable").click(function (e) {
    serviceRequestId = e.target.closest("tr").getAttribute("data-value");

    if (serviceRequestId != null && e.target.classList != "rateactive") {


        document.getElementById("serviceReqdetailsbtn").click();
       
    }
});



$('.mobileview ').on('click', function (e) {

    serviceRequestId = e.target.closest("div.card-body").getAttribute("data-value");
 

    if (serviceRequestId != null && (e.target.classList != "customerCancel" && e.target.classList != "customerReschedule" && e.target.classList != "rateactive")) {

        document.getElementById("serviceReqdetailsbtn").click();
    }
});




$(' .customerReschedule').on('click', function () {
    document.getElementById("updateRequestId").value = serviceRequestId;
});


$(' .customerCancel').on('click', function () {
    document.getElementById("CancelRequestId").value = serviceRequestId;
});






/* For update or reshedule */


document.getElementById("RescheduleServiceRequest").addEventListener("click", function () {
    var serviceStartDate = document.getElementById("selected_date").value;
    var serviceTime = document.getElementById("selected_time").value;
    //console.log(serviceRequestId);
    var data = {};
    data.Date = serviceStartDate;
    data.startTime = serviceTime;
    data.serviceRequestId = serviceRequestId;
   

    $.ajax({
        type: 'POST',
        url: '/Customer/RescheduleServiceRequest',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: data,
        success: function (result) {
            if (result == "true") {
                window.location.reload();

               

            }
            else {
                document.getElementById("acceptAlert").click();
                $('#NewServiceAcceptStatus').text(result).css("color", "Red");
                $('#Model_SID').text("Please Try again").css("color", "gray");
              
            }
        },
        error: function () {
            alert("error");
        }
    });
});

/*  for cancle */  /* status 1-created 2-assigned 3-complted 4-cancled  */

document.getElementById("CancelRequestBtn").addEventListener("click", function () {

    var Comments = document.getElementById("cancelReason").value;
    var data = {};

    data.serviceRequestId = serviceRequestId;
    data.comments = Comments;

    $.ajax({
        type: 'POST',
        url: '/Customer/CancelServiceRequest',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: data,
        success: function (result) {
            if (result.value == "true") {
                window.location.reload();
            }
            else {
                document.getElementById("acceptAlert").click();
                $('#NewServiceAcceptStatus').text("fail").css("color", "Red");
                
            }
        },
        error: function () {
            alert("error");
        }
    });

});



/*-------------all service request Details --------------*/

/* ajax code*/
function getAllServiceDetails() {
    var data = {};
    data.ServiceRequestId = parseInt(serviceRequestId);
    $.ajax({
        type: 'GET',
        url: '/Customer/DashbordServiceDetails',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: data,
        success: function (result) {
            if (result != null) {
                result.st
                showAllServiceRequestDetails(result);

            }
            else {
                document.getElementById("acceptAlert").click();
                $('#NewServiceAcceptStatus').text("result is null").css("color", "Red");
            }

        },
        error: function () {

            alert("error");
        }
    });
}
/*diplay */
function showAllServiceRequestDetails(result) {
    var dateTime = document.getElementById("CDSDDateTime");
    var duration = document.getElementById("CDSDDuration");
    document.getElementById("CDSDId").innerHTML = serviceRequestId;
    var extra = document.getElementById("CDSDExtra");
    var amount = document.getElementById("CDSDAmount");
    var address = document.getElementById("CDSDAddress");
    var phone = document.getElementById("CDSDPhone");
    var email = document.getElementById("CDSDEmail");
    var comment = document.getElementById("CDSDComment");
    var Status = document.getElementById("CDSDStatus");
    dateTime.innerHTML = result.date.substring(0, 10) + " " + result.startTime + " - " + result.endTime;
    duration.innerHTML = result.duration + " Hrs";
    extra.innerHTML = "";
    var varStatus = "";
    var dashbtn = "";
    var servicehistorybtn = "";
    switch (result.status) {
        case 1: /*new */
            varStatus = "new";
            dashbtn = "";
            servicehistorybtn = "d-none";

            break;
        case 2: /*pending */
            varStatus = "pending";
            dashbtn = "";
            servicehistorybtn = "d-none";
            break;
        case 3: /*completed */
            varStatus = "completed";
            dashbtn = "d-none";
            servicehistorybtn = "";
            break;
        case 4: /*cancelled*/
            varStatus = "cancelled";
            dashbtn = "d-none";
            servicehistorybtn = "d-none";
            break;
        default: /*other status */
            alert("invalid status ")

    }

    document.getElementById("customerdashboardbtn").className = dashbtn;

    document.getElementById("customerServiceHistorybtn").className = servicehistorybtn;

    Status.innerHTML = " Status: <button disabled class=" + varStatus + ">" + varStatus + "</button > "


    if (result.cabinet == true) {
        extra.innerHTML += "<div class='extraElement '> Inside Cabinet </div> ";
    }
    if (result.laundry == true) {

        extra.innerHTML += "<div class='extraElement'>  Laundry Wash & dry </div> ";
    }
    if (result.oven == true) {
        extra.innerHTML += "<div class='extraElement'>  Inside Oven  </div> ";
    }
    if (result.fridge == true) {
        extra.innerHTML += " <div class='extraElement'> Inside </div>  ";
    }
    if (result.window == true) {
        extra.innerHTML += "<div class='extraElement'>  Interior Window</div> ";
    }
    amount.innerHTML = result.totalCost + " &euro;";
    address.innerHTML = result.address;
    phone.innerHTML = result.phoneNo;
    email.innerHTML = result.email;
    comment.innerHTML = "";
    if (result.comments != null) {
        comment.innerHTML = result.comments;
    }
}


document.getElementById("serviceReqdetailsbtn").addEventListener("click", function () {

    getAllServiceDetails();

});




/*Service history page started */

/* export btn js*/




document.getElementById('export').addEventListener('click', () => {

    var type = 'xlsx';
    var data = document.getElementById('ServiceHistoryTable');
    var file = XLSX.utils.table_to_book(data, { sheet: "sheet1" });
    XLSX.write(file, { bookType: type, bookSST: true, type: 'base64' });
    XLSX.writeFile(file, 'ServiceHistory.' + type);
});


/* rating */


/*rate submit btn */

document.getElementById("confirm_rating").addEventListener("click", function () {

    var data = {};
    data.onTimeArrival = $(".infomsg").text();
    data.friendly = $(".friendlymsg").text();
    data.qualityOfService = $(".qualitymsg").text();
    data.ratings = parseFloat((parseFloat(data.onTimeArrival) + parseFloat(data.friendly) + parseFloat(data.qualityOfService)) / 3);

    data.comments = $("#feedbackcomment").val();
    data.serviceRequestId = serviceRequestId;

    $.ajax({

        type: "POST",
        url: "/Customer/RateServiceProvider",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        data: data,
        success: function (result) {
            if (result.value == "true") {
                $("#myRatingModal").modal("hide");
                //console.log("submited");

            }
            else {
                document.getElementById("acceptAlert").click();
                $('#NewServiceAcceptStatus').text("you have alredy given rating").css("color", "Green");
                $('#Model_SID').text("Please Try again").css("color", "gray");

              
            }
        },
        error: function (error) {
            alert("error");
        }

    });


});



/*get rating from db */



$(document).on('click', '.rateactive', function () {

    var data = {};
    data.ServiceRequestId = parseInt(serviceRequestId);
    $.ajax({
        type: 'GET',
        url: '/customer/GetRating',
        contenttype: 'application/x-www-form-urlencoded; charset=utf-8',
        data: data,
        success: function (result) {
            if (result == null) {
                document.getElementById("show_rating_model").className = "d-none";

            } else {
                document.getElementById("show_rating_model").className = "show_rating_model";
                var rating = parseInt(result.averageRating);
                $('.star-ratingmodel').html("");

             
                $('.service-provider-ratingmodel').html(result.serviceProvider);
                $("#show_rating_model img.spavtar").attr("src", result.userProfilePicture);
                for (var i = 0; i < 5; i++) {
                    if (i < rating) {
                        $('.star-ratingmodel').append('<i class="fa fa-star " style="color:#ECB91C;" ></i>');
                    } else {
                        $('.star-ratingmodel').append('<i class="fa fa-star " style="color:silver;"></i>');
                    }
                }
                $('.star-ratingmodel').append(result.averageRating);
            }
        },
        error: function () {

            document.getElementById("acceptAlert").click();
            $('#NewServiceAcceptStatus').text("failed to receive the data").css("color", "Red");
    
            //console.log('failed ');
        }
    });
});



/* rating star hover */


$(document).ready(function () {

    $("#myRatingModal .modal-body .fa-star").css("color", "silver");
    $("#myRatingModal .modal-body").hover(function () {
        $(".ratingfortimearrival").hover(function () {

            $("#ontime1").click(function () {
                $("#ontime2,#ontime3,#ontime4,#ontime5").css("color", "silver");
                $("#ontime1").css("color", "#ECB91C");
                $(".infomsg").text("1");
            });
            $("#ontime2").click(function () {
                $("#ontime3,#ontime4,#ontime5").css("color", "silver");
                $("#ontime1,#ontime2").css("color", "#ECB91C");
                $(".infomsg").text("2");
            });
            $("#ontime3").click(function () {
                $("#ontime4,#ontime5").css("color", "silver");
                $("#ontime1,#ontime2,#ontime3").css("color", "#ECB91C");
                $(".infomsg").text("3");
            });

            $("#ontime4").click(function () {
                $("#ontime5").css("color", "silver");
                $("#ontime1,#ontime2,#ontime3,#ontime4").css("color", "#ECB91C");
                $(".infomsg").text("4");
            });

            $("#ontime5").click(function () {
                $("#ontime1,#ontime2,#ontime3,#ontime4,#ontime5").css("color", "#ECB91C");
                $(".infomsg").text("5");
            });

        });

        $(".ratingforfriendly").hover(function () {

            $("#friendly1").click(function () {
                $("#friendly2,#friendly3,#friendly4,#friendly5").css("color", "silver");
                $("#friendly1").css("color", "#ECB91C");
                $(".friendlymsg").text("1");
            });
            $("#friendly2").click(function () {
                $("#friendly3,#friendly4,#friendly5").css("color", "silver");
                $("#friendly1,#friendly2").css("color", "#ECB91C");
                $(".friendlymsg").text("2");
            });
            $("#friendly3").click(function () {
                $("#friendly4,#friendly5").css("color", "silver");
                $("#friendly1,#friendly2,#friendly3").css("color", "#ECB91C");
                $(".friendlymsg").text("3");
            });

            $("#friendly4").click(function () {
                $("#friendly5").css("color", "silver");
                $("#friendly1,#friendly2,#friendly3,#friendly4").css("color", "#ECB91C");
                $(".friendlymsg").text("4");
            });

            $("#friendly5").click(function () {
                //    $(".fa-star").css("color", "silver");
                $("#friendly1,#friendly2,#friendly3,#friendly4,#friendly5").css("color", "#ECB91C");
                $(".friendlymsg").text("5");
            });
        });
        $(".ratingforquality").hover(function () {

            $("#quality1").click(function () {
                $("#quality2,#quality3,#quality4,#quality5").css("color", "silver");
                $("#quality1").css("color", "#ECB91C");
                $(".qualitymsg").text("1");
            });
            $("#quality2").click(function () {
                $("#quality3,#quality4,#quality5").css("color", "silver");
                $("#quality1,#quality2").css("color", "#ECB91C");
                $(".qualitymsg").text("2");
            });
            $("#quality3").click(function () {
                $("#quality4,#quality5").css("color", "silver");
                $("#quality1,#quality2,#quality3").css("color", "#ECB91C");
                $(".qualitymsg").text("3");
            });

            $("#quality4").click(function () {
                $("#quality5").css("color", "silver");
                $("#quality1,#quality2,#quality3,#quality4").css("color", "#ECB91C");
                $(".qualitymsg").text("4");
            });

            $("#quality5").click(function () {
                //    $(".fa-star").css("color", "silver");
                $("#quality1,#quality2,#quality3,#quality4,#quality5").css("color", "#ECB91C");
                $(".qualitymsg").text("5");
            });


        });
    })




});




/*----------------  for my settings js -----------      */


/* code for year in settings */

$(document).ready(function () {
    var currentYear = (new Date()).getFullYear();

    $('#dobyear').append(' <option value="0000">Year</option> ');
    for (var i = 1950; i <= (currentYear); i++) {
        var option = $("<option />");
        option.html(i);
        option.val(i);
        $('#dobyear').append(option);
    }
});


/* get data for user from db */


$(document).ready(function () {


    $.ajax({
        type: 'GET',
        url: '/Customer/GetCustomerData',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',

        success: function (result) {





            var MSfirstname = document.getElementById("mSfirstname");
            var MSlastname = document.getElementById("mSlastname");
            var MSemail = document.getElementById("mSemailaddress");
            var Msphoneno = document.getElementById("mSphonenumber");

            MSfirstname.value = result.firstName;
            MSlastname.value = result.lastName;
            MSemail.value = result.email;
            Msphoneno.value = result.mobile;


            //console.log(result.dateOfBirth);

            if (result.dateOfBirth != null) {
                var dateOfBirth = result.dateOfBirth.split('T');
                var dateOfBirthArray = dateOfBirth[0].split("-");
                //console.log(dateOfBirthArray);
                $("#dobday").val(dateOfBirthArray[2]);
                $("#dobmonth").val(dateOfBirthArray[1]);
                $("#dobyear").val(dateOfBirthArray[0]);
            }


        },
        error: function () {
            alert("error");
        }
    });
});


/*update data */


$("#CSSaveDetails").on('click', function () {



    var data = {};
    data.firstName = document.getElementById("mSfirstname").value;
    data.lastName = document.getElementById("mSlastname").value;
    data.email = document.getElementById("mSemailaddress").value;
    data.mobile = document.getElementById("mSphonenumber").value;
    data.dateOfBirth = $("#dobday").val() + "-" + $("#dobmonth").val() + "-" + $("#dobyear").val();

    //console.log(data.dateOfBirth);
    window.setTimeout(function () {
        $('#mSmyDetailsAlert').addClass('d-none');
    }, 5000);

    if (data.firstName == "") {
        $("#mSmyDetailsAlert").removeClass("alert-success d-none").addClass("alert-danger").text("Firstname is Required.");
        $("#mSfirstname").focus();
    }
    else if (data.lastName == "") {
        $("#mSmyDetailsAlert").removeClass("alert-success d-none").addClass("alert-danger").text("Lastname is Required.");
        $("#mSlastname").focus();
    }
    else if (data.mobile == "") {
        $("#mSmyDetailsAlert").removeClass("alert-success d-none").addClass("alert-danger").text("Mobile is Required.");
        $("#mSphonenumber").focus();
    }

    else if ($("#dobday").val() == 00 || $("#dobmonth").val() == 00 || $("#dobyear").val() == 0000) {
        $("#mSmyDetailsAlert").removeClass("alert-success d-none").addClass("alert-danger").text("select valid birthdate.");

    }
    else {
        $.ajax({
            type: 'POST',
            url: '/Customer/UpdateCustomerData',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            data: data,
            success: function (result) {
                if (result.value == "true") {
                    $("#mSmyDetailsAlert").removeClass("alert-danger d-none").addClass("alert-success").text("User is updated.");
                    window.setTimeout(function () {
                        window.location.reload();
                    }, 2000);

                }
                else {
                    $("#mSmyDetailsAlert").removeClass("alert-success d-none").addClass("alert-danger").text("Something went wrong! please try again later.");
                }
            },
            error: function () {
                alert("error");
            }
        });
    }

});


















/* settings addresss starts  */



/*get address */

$(document).ready(function () {

    getAddress();

});

function getAddress() {
    $.ajax({
        type: 'GET',
        url: '/Customer/GetUserAddress',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',

        success: function (result) {
            if (result != false) {
                //console.log(result);

                $("#alladdress").empty();
                for (var i = 0; i < result.length; i++) {

                    $("#alladdress").append(
                        '<tr data-value=' + result[i].addressId + ' >'
                        + '<td><p><strong> Address: </strong>' + result[i].addressLine1 + ", " + result[i].addressLine2 + ', ' + result[i].city + ' - ' + result[i].postalCode + '</p>'
                        + '<p><strong>Phone number: </strong>' + result[i].mobile + '</p></td>'
                        + '<td class="myAddressBtns"><button class="myAddressButton myAddressEditBtn" data-value=' + result[i].addressId + '>'
                        + '<img src="/Images/edit.jpg" />  </button > '
                        + '<button class="myAddressButton myAddressDeleteBtn" data-value=' + result[i].addressId + '>'
                        + ' <img src="/Images/deleteiconadd.png" class="deleteiconimg" /> </button> </td > </tr > '
                    );
                }


            }
           
        },
        error: function () {
            alert("error");
        }
    });
}





/*---------add new address settings----------*/


/* ---addaddressbtn click---- */


$("#addNewaddressbtn").click(function () {
    $("#updateAddressSubmit").addClass("d-none");
    $("#addAddressSubmit").removeClass("d-none");
    document.getElementById("addressCancelBtn").click();
    $("#settingsaddressmodeltitel").text("Add New Address");

});

/* -----   addadress submit ---- */


/* get city name from pin code */
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
               // $("#State").prop("disabled", true);
            }
        },
        error: function (error) {

        }
    });
}

$("#addAddressPostalCode").keyup(function () {
    //console.log($("#addAddressPostalCode").val());
    if ($("#addAddressPostalCode").val().length == 6) {
        getCityFromPostalCode($("#addAddressPostalCode").val());
    }
});

$("#addAddressSubmit").on('click', function () {



    var data = {};
    data.addressLine1 = document.getElementById("AddressLine1").value;
    data.addressLine2 = document.getElementById("AddressLine2").value;
    data.postalCode = document.getElementById("addAddressPostalCode").value;
    data.city = document.getElementById("City").value;
    data.mobile = document.getElementById("Mobile").value;
    data.state = document.getElementById("State").value;
    var testnumber = /^ [0 - 9]{ 10}$/;
    window.setTimeout(function () {
        $('#mSaddAddressAlert').addClass('d-none');
    }, 5000);

    if (data.addressLine1 == "" && data.addressLine2 == "" && data.postalCode == "" && data.city == "" && data.mobile == "") {
        $("#mSaddAddressAlert").removeClass("alert-success d-none").addClass("alert-danger").text("All Fields are Required.");
        $("#AddressLine1").focus();
    }
    else if (data.addressLine1 == "") {
        $("#mSaddAddressAlert").removeClass("alert-success d-none").addClass("alert-danger").text("House no. is Required.");
        $("#AddressLine1").focus();
    }
    else if (data.addressLine2 == "") {
        $("#mSaddAddressAlert").removeClass("alert-success d-none").addClass("alert-danger").text("Street name is Required.");
        $("#AddressLine2").focus();
    }
    else if (data.postalCode == "") {
        $("#mSaddAddressAlert").removeClass("alert-success d-none").addClass("alert-danger").text("Postalcode is Required.");
        $("#addAddressPostalCode").focus();
    }
    else if (data.city == "") {
        $("#mSaddAddressAlert").removeClass("alert-success d-none").addClass("alert-danger").text("City is Required.");
        $("#City").focus();
    }
    else if (data.mobile == "") {
        $("#mSaddAddressAlert").removeClass("alert-success d-none").addClass("alert-danger").text("Mobile is Required.");
        $("#Mobile").focus();
    }
    else if (testnumber.test(data.mobile)) {
        $("#mSaddAddressAlert").removeClass("alert-success d-none").addClass("alert-danger").text("Mobile is Invalid.");
        $("#Mobile").focus();
    }
    else {
        $.ajax({
            type: "POST",
            url: "/Customer/AddNewUserAddress",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            data: data,
            success: function (result) {
                if (result.value == "true") {
                    getAddress();
                    document.getElementById("addressCancelBtn").click();
                    $("#addNewaddressModel").modal("hide");
                }
                else {

                    document.getElementById("acceptAlert").click();
                    $('#NewServiceAcceptStatus').text("not saved").css("color", "Red");
                    
                }

            },
            error: function (error) {
                alert(error);
            }

        });
    }
});





var addressId;

$("#address").on('click', function (e) {
    var element = e.target.closest("button");

    //console.log(element);
    if (element != null) {
        if (element.classList.contains("myAddressEditBtn")) {
            addressId = element.getAttribute("data-value");
            //console.log("editaddress");

            //------------- Get Address Data To Modal -----------------

            var data = {};
            data.addressId = addressId;

            $.ajax({
                type: 'GET',
                url: '/Customer/EditAddressModel',
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                data: data,
                success: function (result) {
                    if (result != false) {

                        document.getElementById("AddressLine1").value = result.addressLine1;
                        document.getElementById("AddressLine2").value = result.addressLine2;
                        document.getElementById("addAddressPostalCode").value = result.postalCode;
                        document.getElementById("City").value = result.city;
                        document.getElementById("Mobile").value = result.mobile;
                        getCityFromPostalCode(result.postalCode);
                    }
                },
                error: function (error) {
                    alert(error);
                }
            })



            $("#updateAddressSubmit").removeClass("d-none");
            $("#addAddressSubmit").addClass("d-none");
            $("#settingsaddressmodeltitel").text("Edit Address");
            //console.log(addressId);
            $("#addNewaddressModel").modal("show");



        }
        if (element.classList.contains("myAddressDeleteBtn")) {
            //console.log("delete");
            addressId = element.getAttribute("data-value");
            $("#MSDeleteAddressModalBtn").click();
        }
    }

});






$("#updateAddressSubmit").on('click', function () {


    var data = {};
    var testnumber = /^ [0 - 9]{ 10}$/;
    data.addressId = addressId;
    data.addressLine1 = document.getElementById("AddressLine1").value;
    data.addressLine2 = document.getElementById("AddressLine2").value;
    data.postalCode = document.getElementById("addAddressPostalCode").value;
    data.city = document.getElementById("City").value;
    data.mobile = document.getElementById("Mobile").value;
    data.state = document.getElementById("State").value;




    
    window.setTimeout(function () {
        $('#mSaddAddressAlert').addClass('d-none');
    }, 5000);

    if (data.addressLine1 == "" && data.addressLine2 == "" && data.postalCode == "" && data.city == "" && data.mobile == "") {
        $("#mSaddAddressAlert").removeClass("alert-success d-none").addClass("alert-danger").text("All Fields are Required.");
        $("#AddressLine1").focus();
    }
    else if (data.addressLine1 == "") {
        $("#mSaddAddressAlert").removeClass("alert-success d-none").addClass("alert-danger").text("House no. is Required.");
        $("#AddressLine1").focus();
    }
    else if (data.addressLine2 == "") {
        $("#mSaddAddressAlert").removeClass("alert-success d-none").addClass("alert-danger").text("Street name is Required.");
        $("#AddressLine2").focus();
    }
    else if (data.postalCode == "") {
        $("#mSaddAddressAlert").removeClass("alert-success d-none").addClass("alert-danger").text("Postalcode is Required.");
        $("#addAddressPostalCode").focus();
    }
    else if (data.city == "") {
        $("#mSaddAddressAlert").removeClass("alert-success d-none").addClass("alert-danger").text("City is Required.");
        $("#City").focus();
    }
    else if (data.mobile == "") {
        $("#mSaddAddressAlert").removeClass("alert-success d-none").addClass("alert-danger").text("Mobile is Required.");
        $("#Mobile").focus();
    }
    else if (testnumber.test(data.mobile)) {
        $("#mSaddAddressAlert").removeClass("alert-success d-none").addClass("alert-danger").text("Mobile is Invalid.");
        $("#Mobile").focus();
    }
    else {
        $.ajax({
            type: "POST",
            url: "/Customer/EditUserAddress",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            data: data,
            success: function (result) {
                if (result.value == "true") {
                    getAddress();
                    
                   
                    $("#mSaddAddressAlert").removeClass("alert-danger d-none").addClass("alert-success").text("Address is updated successfully.");

                    window.setTimeout(function () {
                        $("#addNewaddressModel").modal("hide");
                        document.getElementById("addressCancelBtn").click();
                    }, 500);
                    
                }
                else {
                    document.getElementById("acceptAlert").click();
                    $('#NewServiceAcceptStatus').text("not saved").css("color", "Red");
                 
                }
                $("#updateAddressSubmit").addClass("d-none");
                $("#addAddressSubmit").removeClass("d-none");

            },
            error: function (error) {
                $("#updateAddressSubmit").addClass("d-none");
                $("#addAddressSubmit").removeClass("d-none");
                alert(error);
            }

        });
    }

});







/* delete address-*/

$("#MSDeleteAddress").click(function () {
    var data = {};
    data.addressId = addressId;
    $.ajax({
        type: "POST",
        url: "/Customer/DeleteUserAddress",
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: data,
        success: function (result) {
            if (result == true) {

                getAddress();
            }
            else {
                alert("fail");
            }
        },
        error: function (error) {

        }
    });

});









/* change password  */


$("#CSChangePassword").on('click', function () {

    var data = {};
    data.oldPassword = document.getElementById("mSoldpassword").value;
    data.newPassword = document.getElementById("mSnewpassword").value;
    data.confirmPassword = document.getElementById("mSconfirmpassword").value;


    window.setTimeout(function () {
        $('#mSchangePasswordAlert').addClass('d-none');
    }, 5000);



    /*
             r'^
          (?=.*[A-Z])       // should contain at least one upper case
          (?=.*[a-z])       // should contain at least one lower case
          (?=.*?[0-9])      // should contain at least one digit
          (?=.*?[!@#\$&*~]) // should contain at least one Special character
          .{8,}             // Must be at least 8 characters in length
        $
     
     */
    var paswordtest = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{6,14}$/;

    if (data.oldPassword == "" && data.newPassword == "" && data.confirmPassword == "") {
        $("#mSchangePasswordAlert").removeClass("alert-success d-none").addClass("alert-danger").text("All Fields are Required.");
        $("mSoldpassword").focus();
    }
    else if (data.oldPassword == "") {
        $("#mSchangePasswordAlert").removeClass("alert-success d-none").addClass("alert-danger").text("Old password is Required.");
        $("mSoldpassword").focus();
    }
    else if (data.newPassword == "") {
        $("#mSchangePasswordAlert").removeClass("alert-success d-none").addClass("alert-danger").text("New password is Required.");
        $("mSnewpassword").focus();
    }
    else if (!paswordtest.test(data.newPassword)) {
        $("#mSchangePasswordAlert").removeClass("alert-success d-none").addClass("alert-danger").text("please enter strong password.");
        $("mSnewpassword").focus();
    }
    else if (data.confirmPassword == "") {
        $("#mSchangePasswordAlert").removeClass("alert-success d-none").addClass("alert-danger").text("Confirm password is Required.");
        $("#mSconfirmpassword").focus();
    }
    else if (data.newPassword != data.confirmPassword) {
        $("#mSchangePasswordAlert").removeClass("alert-success d-none").addClass("alert-danger").text("New Password and Confirm Password must be same.");
        $("#mSconfirmpassword").focus();
    }
    else {
        $.ajax({
            type: "POST",
            url: "/Customer/ChangePassword",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            data: data,
            success: function (result) {
                if (result.value == "true") {
                    $("#mSchangePasswordAlert").removeClass("alert-danger d-none").addClass("alert-success").text("Password Changed Successfully.");
                }
                else if (result.value == "wrong password") {
                    $("#mSchangePasswordAlert").removeClass("alert-success d-none").addClass("alert-danger").text("Current(Old) Password is wrong! Please try again.");
                }
            },
            error: function (error) {
                $("#mSchangePasswordAlert").removeClass("alert-success d-none").addClass("alert-danger").text("Something went wrong! Please try again leter.");
            }
        });
    }

});




const dashbordTablepagination = new DataTable("#dashbordTable", {
    dom: 't<"pagenum d-flex justify-content-between "<"pagenum-left"li><"pagenum-right"p>>',
    responsive: true,
    pagingType: "full_numbers",
    language: {
        paginate: {
            first: "<img src='/Images/pagination-first.png' alt='first'/>",
            previous: "<img src='/Images/pagination-left.png' alt='previous' />",
            next: "<img src='/Images/pagination-left.png' alt='next' style='transform: rotate(180deg)' />",
            last: "<img src='/Images/pagination-first.png' alt='first' style='transform: rotate(180deg) ' />",
        },
        info: "Total Records : _MAX_",
        lengthMenu: "Show  _MENU_  Entries",
    },

    columnDefs: [{ orderable: false, targets: 4 }],
});

const ServiceHistoryTablepagination = new DataTable("#ServiceHistoryTable", {
    dom: 't<"pagenum d-flex justify-content-between "<"pagenum-left"li><"pagenum-right"p>>',
    responsive: true,
    pagingType: "full_numbers",
    language: {
        paginate: {
            first: "<img src='/Images/pagination-first.png' alt='first'/>",
            previous: "<img src='/Images/pagination-left.png' alt='previous' />",
            next: "<img src='/Images/pagination-left.png' alt='next' style='transform: rotate(180deg)' />",
            last: "<img src='/Images/pagination-first.png' alt='first' style='transform: rotate(180deg) ' />",
        },
        info: "Total Records : _MAX_",
        lengthMenu: "Show  _MENU_  Entries",
    },

    columnDefs: [{ orderable: false, targets: 4 }],
});




/*         nice to have */




//Block-fav Sp


$(document).on('click', '#favouriteProsTabBtn', function () {



    $.ajax({
        type: "GET",
        url: '/Customer/getSP',
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: function (result) {
            $('#favouriteProsGrid').empty();



            for (var i = 0; i < result.length; i++) {

                var unblock = "d-none";
                var block = ""
                if (result[i].favoriteAndBlocked != null) {

                    var status = result[i].favoriteAndBlocked.isBlocked;

                    if (status == true) {
                        block = "d-none";
                        unblock = "";

                    }


                }


                var fav = "";
                var unfav = "d-none"
                if (result[i].favoriteAndBlocked != null) {

                    var status = result[i].favoriteAndBlocked.isFavorite;

                    if (status == true) {

                        fav = "d-none";
                        unfav = "";

                    }


                }


                //for (var i = 0; i < 5; i++) {
                //    if (i < rating) {
                //        SpRating +='<i class="fa fa-star " style="color:#ECB91C;" ></i>';
                //    } else {
                //        SpRating +='<i class="fa fa-star " style="color:silver;"></i>';
                //    }
                //}
                //SpRating +=result.averageRating);



                $('#favouriteProsGrid').append('<div  class="col-4 blockCard ">' +
                    '<div>' +
                    '<img class= "cap-icon" src = "/images/' + result[i].user.userProfilePicture+' " alt = ".." >' +
                    '</div >' +
                 
                    '<h3 class="mt-2"> ' + result[i].user.firstName + '  </h3>' +

                   /* '<div>' + result[i].averageRating+'</div>'+*/
                    '<br/>' +
                    '<button id="' + result[i].user.userId + 'F" class="' + fav + ' spFBBtn fav-sp-btn">Favourite</button>' +
                    '<button id="' + result[i].user.userId + 'N" class="' + unfav + ' spFBBtn fav-sp-btn">Un-Favourite</button>' +
                    '<button id="' + result[i].user.userId + 'B" class="' + block + ' spFBBtn block-sp-btn">Block</button>' +
                    '<button id="' + result[i].user.userId + 'U" class="' + unblock + ' spFBBtn block-sp-btn">Un-Block</button>' +

                    '</div >'
                )
            }








        },
        error: function (error) {
            console.log(error);
        }
    });





});




$(document).on('click', '.spFBBtn', function () {

    var combine = this.id;


    var req = combine.substring(combine.length - 1, combine.length);
    var Id = combine.substring(0, combine.length - 1);



    var data = {};
    data.Id = parseInt(Id);
    data.Req = req;


    $.ajax({
        type: 'GET',
        url: '/Customer/BlockUnblockFavUnFavSp',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: data,
        success: function (result) {

            document.getElementById("favouriteProsTabBtn").click();

            document.getElementById("acceptAlert").click();



            if (result == "UnFavourite Success" || result == "Block Success") {
                $('#NewServiceAcceptStatus').text(result).css("color", "red");
            } else {
                $('#NewServiceAcceptStatus').text(result).css("color", "green");
            }

         



            window.setTimeout(function () {
                $("#alertPopup").modal("hide");

            }, 7000);





        },
        error: function () {

            alert("error");
        }
    });



});











//service schedule


$(document).on('click', '#serviceScheduleTabBtn', function () {
   
    addServiceSchedule();
});




var calendarEl = document.getElementById('calendar');
var calendar;

function addServiceSchedule() {

    $.ajax({
        type: 'GET',
        url: "/Customer/GetServiceSchedule",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",

        success: function (result) {
            console.log(result);
            var events = [];
            if (result != "false") {

                for (let i = 0; i < result.length; i++) {
                    var bgColor = "#555";
                    if (result[i].status == 3) {
                        bgColor = "#146371";
                    }

                    events.push({
                        id: result[i].serviceRequestId,
                        start: result[i].date,
                        title: result[i].startTime + "-" + result[i].endTime,
                        backgroundColor: bgColor,
                        borderColor: "#fff",
                    });
                }

                console.log(events);

                calendar = new FullCalendar.Calendar(calendarEl, {
                    initialView: 'dayGridMonth',

                    headerToolbar: {
                        left: 'prev,next',
                        center: 'title',
                        right: ''
                    },
                    events: events,
                    eventClick: function (info) {

                        console.log(info.event.id);
                        serviceRequestId = info.event.id;
                        $("#serviceReqdetailsbtn").click();
                    },
                });
                calendar.render();
            }
            else {
                document.getElementById("acceptAlert").click();
                $('#NewServiceAcceptStatus').text("something went wrong!").css("color", "Red");
              
            }
        },
        error: function (error) {
            alert(error);
        },


    });
}


