
/* tab navigation  */
function Sp_TabNav(evt, service) {
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


var vTabId = "NewServiceRequestTabBtn";
document.getElementById(vTabId).click();
$(document).ready(function () {
    
    
   
    var url1 = new URLSearchParams(window.location.search);
    var urlcust = url1.toString();
    if (urlcust.includes("=")) {
        var indexofequl = urlcust.lastIndexOf("=");
        vTabId = urlcust.substring(indexofequl + 1, urlcust.length);
        document.getElementById(vTabId).click();
    }

});


/* ----- new service req  ----- */

$(document).on('click', '#NewServiceRequestTabBtn', function () {
    var url = window.location.href;
    if (url.indexOf('?') > -1) {
        url = url.substring(0, url.indexOf('?'));
    } 
    window.location.href = url;
  
});



/* has pet function */

document.getElementById("newRequestPet").addEventListener("change", function () {


    if (document.getElementById("newRequestPet").checked == true) {

        Newservicerequest.search("").draw();

    }
    else {

        Newservicerequest.search("false").draw();

    }
});



/* table  row click in  new Service req */

var serviceRequestId = "";

$("#SPServiceRequestTable").click(function (e) {


    serviceRequestId = e.target.closest("tr").getAttribute("data-value");


    if (serviceRequestId != null && e.target.classList != "newReqConflictBtn") {

        document.getElementById("spserviceReqdetailsbtn").click();

    }
});
/* all details popup model */

document.getElementById("spserviceReqdetailsbtn").addEventListener("click", function () {

    getAllServiceDetails();

});


function getAllServiceDetails() {
    var data = {};
    data.ServiceRequestId = parseInt(serviceRequestId);
    $.ajax({
        type: 'GET',
        url: '/ServiceProvider/getAllDetails',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: data,
        success: function (result) {
            if (result != null) {

                showAllServiceRequestDetails(result);

            }
            else {
                alert("result is null");
            }

        },
        error: function () {

            alert("error");
        }
    });
}

function showAllServiceRequestDetails(result) {

    var dateTime = document.getElementById("SpServiceReqDatetime");
    var duration = document.getElementById("SpServiceReqDuration");
    document.getElementById("SpServiceReqId").innerHTML = serviceRequestId;
    var extra = document.getElementById("SpServiceReqExtra");
    var amount = document.getElementById("SpServiceReqAmount");
    var customerName = document.getElementById("SpServiceReqCustomerName");
    var address = document.getElementById("SpServiceReqAddress");
    var comment = document.getElementById("SpServiceReqComment");
    var Status = document.getElementById("SpServiceReqStatus");


    dateTime.innerHTML = result.date.substring(0, 10) + " " + result.startTime + " - " + result.endTime;
    duration.innerHTML = result.duration + " Hrs";



    var newServiceBtn = "";
    var upcomingServiceBtn = "";
    switch (result.status) {
        case 1: /*new */

            newServiceBtn = "";
            upcomingServiceBtn = "d-none";

            break;
        case 2: /*pending */

            newServiceBtn = "d-none";
            upcomingServiceBtn = "";
            break;
        case 3: /*completed */

            newServiceBtn = "d-none";
            upcomingServiceBtn = "d-none";
            break;

        default: /*other status */
            alert("invalid status ")

    }

    document.getElementById("detailPopUpNew").className = newServiceBtn;

    document.getElementById("detailPopUpUpComing").className = upcomingServiceBtn;



    var popupcompleteclass = "";
    if (result.complete) {
        popupcompleteclass = "CompleteService";
    } else {
        popupcompleteclass = "d-none";
    }

    document.getElementById("newServiceReqCompleteBtn").className = popupcompleteclass;

    extra.innerHTML = "";
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
    customerName.innerHTML = result.customerName;
    comment.innerHTML = "";

    getMap(result.zipCode);
    if (result.comments != null) {
        comment.innerHTML = result.comments;
    }
}



/*---map ----*/
function getMap(zipcode) {



    var embed = "<iframe width='100%25' height='100%25'  frameborder='0'  scrolling='no' marginheight='0' marginwidth='0'     src='https://maps.google.com/maps?&amp;q=" +
        encodeURIComponent(zipcode) +
        "&amp;output=embed'><a href='https://www.gps.ie/car-satnav-gps/'>sat navs</a></iframe>";

    $('#newServiceReqMap').html(embed);

}

/* accept btn */

$("#newServiceReqAccept").on('click', function () {

    var data = {};

    var url = window.location.href;
    if (url.indexOf('?') > -1) {
        url = url.substring(0, url.indexOf('?'));
    }
  
    data.ServiceRequestId = parseInt(serviceRequestId);
    $.ajax({
        type: 'GET',
        url: '/ServiceProvider/acceptService',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: data,
        success: function (result) {
            if (result == "Suceess") {


                document.getElementById("acceptAlert").click();

                $('#NewServiceAcceptStatus').text("Service accepted").css("color", "Green");

                window.setTimeout(function () {
                    $("#alertPopup").modal("hide");
                    window.location.href = url;
                }, 3000);


            }
            else if (result == "Service Req Not available") {
                document.getElementById("acceptAlert").click();

                $('#NewServiceAcceptStatus').text("Service Req Not available").css("color", "Gray");

                window.setTimeout(function () {
                    $("#alertPopup").modal("hide");
                    window.location.href = url;
                }, 3000);
            } else if (result == "error") {
                document.getElementById("acceptAlert").click();

                $('#NewServiceAcceptStatus').text("error occured").css("color", "Red");

                window.setTimeout(function () {
                    $("#alertPopup").modal("hide");
                    window.location.href = url;
                }, 3000);
            } else {
                document.getElementById("acceptAlert").click();

                $('#NewServiceAcceptStatus').text("Another service request " + result + " has already been assigned which has time overlap with this service request.You can’t pick this one!").css("color", "Red");

                var conflictbtn = "#Conflict" + serviceRequestId;

                $(conflictbtn).removeClass('d-none');
                window.setTimeout(function () {
                    $("#alertPopup").modal("hide");

                }, 3000);
                alert(result);
            }

        },
        error: function () {

            alert("error");
        }
    });

});

/* conflict btn */

$(".newReqConflictBtn").on('click', function () {


    var temp = this.id.toString();
    var id = temp.substring(8, temp.length);
    var data = {};
    data.ServiceRequestId = parseInt(id);

    $.ajax({
        type: 'GET',
        url: '/ServiceProvider/ConflictDetails',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: data,
        success: function (result) {
            document.getElementById("acceptAlert").click();

            $('#NewServiceAcceptStatus').text(result).css("color", "Red");

            //var conflictbtn = "#Conflict" + serviceRequestId;

            //$(conflictbtn).addClass('d-none');
            window.setTimeout(function () {
                $("#alertPopup").modal("hide");

            }, 5000);


        },
        error: function () {

            alert("error");
        }
    });


});




/*  pagination control var */

var pagination = [0, 0, 0];
/* 0-upcoming 1-history  2-rating */

$(document).ready(function () {

    pagination = [0, 0, 0];
});




/*    Upcoming Service Request */


/* get data from server */
$(document).on('click', '#UpcomingServiceTabBtn', function () {
  
    getUpcomingServiceTable();


});


function getUpcomingServiceTable() {


    $.ajax({
        type: "GET",
        url: '/ServiceProvider/getUpcomingService',
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: function (result) {
            $('#UpcomingServiceTbody').empty();

            for (var i = 0; i < result.length; i++) {

                var completeclass = "";
                if (result[i].complete) {
                    completeclass = "CompleteService";
                } else {
                    completeclass = "d-none";
                }

                $('#UpcomingServiceTbody').append('<tr class="text-center" data-value=' + result[i].serviceRequestId + ' ><td data-label="Service ID">'
                    + '<p class="margin">' + result[i].serviceRequestId + '</p></td>'
                    + '<td data-label="Service date"> <div><img src="/Images/calendar2.png" alt="calender">' + result[i].date + ' </div>'
                    + '<div><img src="/Images/layer-14.png" alt="clock">' + result[i].startTime + '-' + result[i].endTime + '</div></td>'
                    + '<td class="text-start" data-lable="Customer Details"><div class= "ms-4">' + result[i].customerName + '</div >'
                    + '<div class="d-flex" ><span><img class="me-0" src="/images/layer-15.png" alt=""></span> <span>' + result[i].address + ' </span></div></td>'
                    + '<td data-label="Completed"> <p class= "margin" >  <button class=' + completeclass + '>Complete</button></P></td >'
                    + '<td data-label="Action"><p class="margin"><button data-bs-toggle="modal" data-bs-target="#SPdeleteModelServiceRequest" class="upcomingcancel">Cancel</button></P>	</td></tr >'
                )
            }





            

            if (pagination[0] == 0) {
                upcomingserviceDatatable();
                pagination[0] = 1;

            }



        },
        error: function (error) {
            console.log(error);
        }
    });

}


/* complete service req */

$(document).on('click', '.CompleteService', function () {

    alert(serviceRequestId);

    var data = {};
    data.ServiceRequestId = parseInt(serviceRequestId);
    alert(data.ServiceRequestId);
    $.ajax({
        type: 'GET',
        url: '/ServiceProvider/CompleteService',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: data,
        success: function (result) {

            if (result == "true") {
                alert("Service Request marked as completed");
                window.location.reload();

            }
            else {
                alert("opps! something went wrong");

            }

        },
        error: function () {

            alert("error");
        }
    });

});


/* row click*/

$("#SPUpcomingServiceTable").click(function (e) {


    serviceRequestId = e.target.closest("tr").getAttribute("data-value");


    if (serviceRequestId != null && e.target.classList != "upcomingcancel" && e.target.classList != "CompleteService") {

        document.getElementById("spserviceReqdetailsbtn").click();

    }
});


/* cancle req*/
document.getElementById("SpCancelRequestBtn").addEventListener("click", function () {





    var data = {};

    data.serviceRequestId = serviceRequestId;


    $.ajax({
        type: 'POST',
        url: '/ServiceProvider/cancelRequest',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: data,
        success: function (result) {
            if (result == "Suceess") {
                window.location.reload();
            }
            else {
                alert("fail");
            }
        },
        error: function () {
            alert("error");
        }
    });

});





/*     Service   history */


/* teble click function */

$("#ServiceHistoryTbody").click(function (e) {


    serviceRequestId = e.target.closest("tr").getAttribute("data-value");

    document.getElementById("spserviceReqdetailsbtn").click();


});


/* get data from server */

$(document).on('click', '#ServiceHistoryTabBtn', function () {

    getServiceHistoryTable();

});



function getServiceHistoryTable() {



    $.ajax({
        type: "GET",
        url: '/ServiceProvider/getServiceHistory',
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: function (result) {
            $('#ServiceHistoryTbody').empty();

            for (var i = 0; i < result.length; i++) {

                var completeclass = "";
                if (result[i].complete) {
                    completeclass = "CompleteService";
                } else {
                    completeclass = "d-none";
                }

                $('#ServiceHistoryTbody').append(' <tr class= "text-center" data-value=' + result[i].serviceRequestId + ' > <td data-label="Service ID">'
                    + '<p class="margin">' + result[i].serviceRequestId + '</p></td>'
                    + '<td data-label="Service date"> <div><img src="/Images/calendar2.png" alt="calender">' + result[i].date + ' </div>'
                    + '<div><img src="/Images/layer-14.png" alt="clock">' + result[i].startTime + '-' + result[i].endTime + '</div></td>'
                    + '<td class="text-start" data-lable="Customer Details"><div class= "ms-4">' + result[i].customerName + '</div >'
                    + '<div class="d-flex" ><span><img class="me-0" src="/images/layer-15.png" alt=""></span> <span>' + result[i].address + ' </span>'
                    + '</div></td></tr>');

            }


            if (pagination[1] == 0) {
                ServiceHistoryDatatable();
                pagination[1] = 1;

            }



        },
        error: function (error) {
            console.log(error);
        }
    });

}


/* export btn */

document.getElementById('export').addEventListener('click', () => {

    var type = 'xlsx';
    var data = document.getElementById('SPServiceHistoryTable');
    var file = XLSX.utils.table_to_book(data, { sheet: "sheet1" });
    XLSX.write(file, { bookType: type, bookSST: true, type: 'base64' });
    XLSX.writeFile(file, 'ServiceHistory.' + type);
});





/* spsettings */


/* year selection box */
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

/* get data  */

$(document).on('click', '#SettingsTabBtn', function () {

    getsettingsdata();
    
});

function getsettingsdata() {

    $.ajax({
        type: 'GET',
        url: '/ServiceProvider/GetSpData',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',

        success: function (result) {

            var MSfirstname = document.getElementById("SPSettingsfirstname");
            var MSlastname = document.getElementById("SPSettingslastname");
            var MSemail = document.getElementById("SPSettingsemailaddress");
            var Msphoneno = document.getElementById("SPSettingsphonenumber");
            var MsStreet = document.getElementById("SPSettingsstreetname");
            var Mshouseno = document.getElementById("SPSettingshousenumber");
            var Mspincode = document.getElementById("SPSettingspincode");
            var Mscity = document.getElementById("SPSettingscity");

            MSfirstname.value = result.user.firstName;
            MSlastname.value = result.user.lastName;
            MSemail.value = result.user.email;
            Msphoneno.value = result.user.mobile;

            if (result.address != null) {
                MsStreet.value = result.address.addressLine2;
                Mspincode.value = result.address.postalCode;
                Mscity.value = result.address.city;
                Mshouseno.value = result.address.addressLine1;

                getCityFromPostalCode(result.address.postalCode);
            }


            if (result.user.dateOfBirth != null) {

                var dateOfBirth = result.user.dateOfBirth.split('T');
                var dateOfBirthArray = dateOfBirth[0].split("-");
                console.log(dateOfBirthArray);
                $("#dateofbirth").val(dateOfBirthArray[2]);
                $("#dateofmonth").val(dateOfBirthArray[1]);
                $("#dobyear").val(dateOfBirthArray[0]);
            }

            if (result.user.nationalityId != null) {

                $("#SPnationalityid").val(result.user.nationalityId);

            }

            if (result.user.gender != null) {

                $("input[name=gender][value='" + result.user.gender + "']").prop("checked", true);
            }

            if (result.user.userProfilePicture != null) {
                $("input[name=avtar][value='" + result.user.userProfilePicture + "']").prop("checked", true);
            }


        },
        error: function () {
            alert("error");
        }
    });
}

/*  city from postal code*/
$("#SPSettingspincode").keyup(function () {
    console.log($("#SPSettingspincode").val());
    if ($("#SPSettingspincode").val().length == 6) {
        getCityFromPostalCode($("#SPSettingspincode").val());
    }
});
function getCityFromPostalCode(zip) {
    $.ajax({
        method: "GET",
        url: "https://api.postalpincode.in/pincode/" + zip,
        dataType: 'json',
        cache: false,
        success: function (result) {
            if (result[0].status == "Error" || result[0].status == "404") {
                $("#mSmyDetailsAlert").removeClass("alert-success d-none").addClass("alert-danger").text("Enter Valid PostalCode.");

            }
            else {
                console.log(result);
                $("#SPSettingscity").val(result[0].PostOffice[0].District).prop("disabled", true);
                $("#SPSettingsState").val(result[0].PostOffice[0].State).prop("disabled", true);
                
              
            }
        },
        error: function (error) {

        }
    });
}

/*  update user data */


$("#SPSaveChange").on('click', function () {


    var data = {};
    data.user = {};
    data.address = {};

    data.user.firstName = document.getElementById("SPSettingsfirstname").value;
    data.user.lastName = document.getElementById("SPSettingslastname").value;
    data.user.email = document.getElementById("SPSettingsemailaddress").value;
    data.user.mobile = document.getElementById("SPSettingsphonenumber").value;
    data.user.dateOfBirth = $("#dateofbirth").val() + "/" + $("#dateofmonth").val() + "/" + $("#dobyear").val();
   
    data.user.nationalityId = $("#SPnationalityid").val();
    data.user.gender = document.querySelector('input[name="gender"]:checked').value;
    data.user.userProfilePicture = document.querySelector('input[name="avtar"]:checked').value;
    data.address.addressLine2 = document.getElementById("SPSettingsstreetname").value;
    data.address.addressLine1 = document.getElementById("SPSettingshousenumber").value;
    data.address.postalCode = document.getElementById("SPSettingspincode").value;
    data.address.city = document.getElementById("SPSettingscity").value;
    data.address.state = document.getElementById("SPSettingsState").value;
    data.address.email = document.getElementById("SPSettingsemailaddress").value;
    data.address.mobile = document.getElementById("SPSettingsphonenumber").value;

    
    var testnumber = /^[0-9]{10}$/;
    var testpin = /^[1-9][0-9]{5}$/;


    window.setTimeout(function () {
        $('#mSmyDetailsAlert').addClass('d-none');
    }, 5000);

    if (data.user.firstName == "") {
        $("#mSmyDetailsAlert").removeClass("alert-success d-none").addClass("alert-danger").text("Firstname is Required.");
        $("#SPSettingsfirstname").focus();
    }
    else if (data.user.lastName == "") {
        $("#mSmyDetailsAlert").removeClass("alert-success d-none").addClass("alert-danger").text("Lastname is Required.");
        $("#SPSettingslastname").focus();
    }
   

    else if ($("#dateofbirth").val() == 00 || $("#dateofmonth").val() == 00 || $("#dobyear").val() == 0000) {
        $("#mSmyDetailsAlert").removeClass("alert-success d-none").addClass("alert-danger").text("select valid birthdate.");

    }
    else if ($("#SPnationalityid").val() == 0) {

        $("#mSmyDetailsAlert").removeClass("alert-success d-none").addClass("alert-danger").text("select nationality.");

    } else if (data.address.addressLine1 == "") {
        $("#mSmyDetailsAlert").removeClass("alert-success d-none").addClass("alert-danger").text("House no. is Required.");
        $("#SPSettingshousenumber").focus();
    }
    else if (data.address.addressLine2 == "") {
        $("#mSmyDetailsAlert").removeClass("alert-success d-none").addClass("alert-danger").text("Street name is Required.");
        $("#SPSettingsstreetname").focus();
    }

    else if (!testnumber.test(data.user.mobile)) {
        $("#mSmyDetailsAlert").removeClass("alert-success d-none").addClass("alert-danger").text("Mobile is Invalid.");
        $("#SPSettingsphonenumber").focus();
    }
    else if (!testpin.test(data.address.postalCode)) {
        $("#mSmyDetailsAlert").removeClass("alert-success d-none").addClass("alert-danger").text("postalcode  is Invalid.");
        $("#SPSettingspincode").focus();
    }
       
    else {
        $.ajax({
            type: 'POST',
            url: '/ServiceProvider/UpdateSPData',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            data: data,
            success: function (result) {
                if (result.value == "true") {

                    

                    $("#mSmyDetailsAlert").removeClass("alert-danger d-none").addClass("alert-success").text("User is updated.");
                    window.setTimeout(function () {
                        window.location.reload();
                    }, 4000);

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







/* change password */

$("#SPChangePassword").on('click', function () {

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
            url: "/ServiceProvider/ChangePassword",
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





//rating

$(document).on('click', '#MyRatingTabBtn', function () {

    $.ajax({
        type: 'GET',
        url: '/ServiceProvider/getRatingData',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',

        success: function (result) {

            $('#RatingList').empty();

            for (var i = 0; i < result.length; i++) {

                var star = "";


                for (var j = 1; j < 6; j++) {

                    if (j <= result[i].rating) {

                        star += '<i class="fa fa-star " style="color:#ECB91C; "></i>';

                    }
                    else {
                        star += '<i class="fa fa-star " style="color:silver;"></i>'
                    }




                }

                star += '<span> &nbsp;' + result[i].remarks + '</span>'




                $('#RatingList').append('<div class="row  rating-row"><div class="row"><div class="col-3">'
                    + '<p>' + result[i].serviceRequestId + '</p>'
                    + '<p>' + result[i].customerName + '</p></div><div class="col-5">'
                    + '<p> <span><img src="/image/calendar2.png" alt=""></span> <span class="upcoming-date"><b>' + result[i].serviceDate + '</b></span></p>'
                    + ' <p><span><img src="/image/layer-14.png" alt=""></span><span>' + result[i].startTime + ' - ' + result[i].endTime + '</span></p></div>'
                    + '<div class="col-4"><p>Rating</p>'
                    + '<div class="star-ratingmodel text-start">' + star + '</div></div></div><hr />'
                    + '<div class="row"><p><b>Customer Comments</b></p><p>' + result[i].comments + '</p></div></div>'







                );


            }


        },
        error: function () {
            alert("error");
        }
    });




});







/*Block customer*/



/* data from server */

$(document).on('click', '#BlockCustomerTabBtn', function () {



    $.ajax({
        type: "GET",
        url: '/ServiceProvider/getCustomer',
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: function (result) {
            $('#customerGrid').empty();



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



                $('#customerGrid').append('<div  class="col-4 blockCard ">' +
                    '<div>' +
                    '<img class= "cap-icon" src = "/images/cap.png " alt = ".." >' +
                    '</div >' +
                    '<br/>' +
                    '<h3> ' + result[i].user.firstName + '  </h3>' +
                    '<br/>' +
                    '<button id="' + result[i].user.userId + 'B" class="' + block + ' block-cust-btn">Block</button>' +
                    '<button id="' + result[i].user.userId + 'U" class="' + unblock + ' block-cust-btn">Un-Block</button>' +
                    '</div >'
                )
            }








        },
        error: function (error) {
            console.log(error);
        }
    });





});

/* block cust btn click */


$(document).on('click', '.block-cust-btn', function () {

    var combine = this.id;


    var req = combine.substring(combine.length - 1, combine.length);
    var Id = combine.substring(0, combine.length - 1);



    var data = {};
    data.Id = parseInt(Id);
    data.Req = req;


    $.ajax({
        type: 'GET',
        url: '/ServiceProvider/BlockUnblockCustomer',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: data,
        success: function (result) {

            document.getElementById("BlockCustomerTabBtn").click();

            document.getElementById("acceptAlert").click();

            $('#NewServiceAcceptStatus').text(result).css("color", "Grey");




            window.setTimeout(function () {
                $("#alertPopup").modal("hide");




            }, 7000);





        },
        error: function () {

            alert("error");
        }
    });



});








/*pagination for new service req*/



var Newservicerequest = new DataTable("#SPServiceRequestTable", {
    dom: 't<"pagenum d-flex justify-content-between "<"pagenum-left"li><"pagenum-right"p>>',
    responsive: true,
    pagingType: "full_numbers",
    language: {
        paginate: {
            first: "<img src='/Images/pagination-first.png'  'alt='first'/>",
            previous: "<img src='/Images/pagination-left.png' alt='previous'  />",
            next: "<img src='/Images/pagination-left.png' alt='next' style='transform: rotate(180deg)'  />",
            last: "<img src='/Images/pagination-first.png' alt='first' style='transform: rotate(180deg) '  />",
        },

        info: "Total Records : _MAX_",

        lengthMenu: "Show  _MENU_  Entries",


    },
    iDisplayLength: 7,
    aLengthMenu: [[7, 10, 15, -1], [7, 10, 15, "All"]],

    columnDefs: [{ orderable: false, targets: 4 }],
});





/*ServiceHistoryDatatable  */

function ServiceHistoryDatatable() {
    $("#SPServiceHistoryTable").DataTable({

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
        iDisplayLength: 7,
        aLengthMenu: [[7, 10, 15, -1], [7, 10, 15, "All"]],

        columnDefs: [{ orderable: false, targets: 2 }],

    });

}


//upcomingserviceDatatable()




function upcomingserviceDatatable() {
    $("#SPUpcomingServiceTable").DataTable({

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
        iDisplayLength: 7,
        aLengthMenu: [[7, 10, 15, -1], [7, 10, 15, "All"]],

        columnDefs: [{ orderable: false, targets: 4 }],

    });

}