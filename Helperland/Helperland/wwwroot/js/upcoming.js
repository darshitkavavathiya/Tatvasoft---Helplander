
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
if (urlcust.includes("="))
{
    var indexofequl = urlcust.lastIndexOf("=");
    vTabId = urlcust.substring(indexofequl + 1, urlcust.length);
}
document.getElementById(vTabId).click();




/*----------------- js for dashboard ------------*/


/* for row click */


var srId;
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
        srId = serviceRequestId;
    }
    console.log(e);
});

$('div.justify-content-around .customerReschedule').on('click', function () {

    document.getElementById("updateRequestId").value = srId;
});

$('div.justify-content-around .customerCancel').on('click', function () {

    document.getElementById("CancelRequestId").value = srId;
});




/* For update */ 

document.getElementById("RescheduleServiceRequest").addEventListener("click", function () {
    var serviceStartDate = document.getElementById("selected_date").value;
    var serviceTime = document.getElementById("selected_time").value;
    var serviceRequestId = document.getElementById("updateRequestId").value;
    console.log(serviceRequestId);
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
            if (result.value == "true") {
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

/*  for cancle */  /* status 1-created 2-assigned 3-complted 4-cancled  */ 

document.getElementById("CancelRequestBtn").addEventListener("click", function () {

    var ServiceRequestId = document.getElementById("CancelRequestId").value;
    var Comments = document.getElementById("cancelReason").value;
    var data = {};

    data.serviceRequestId = ServiceRequestId;
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
                alert("fail");
            }
        },
        error: function () {
            alert("error");
        }
    });

});

/*-------------all service request Details --------------*/

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
    var dateTime = document.getElementById("CDSDDateTime");
    var duration = document.getElementById("CDSDDuration");
    document.getElementById("CDSDId").innerHTML = serviceRequestId;
    var extra = document.getElementById("CDSDExtra");
    var amount = document.getElementById("CDSDAmount");
    var address = document.getElementById("CDSDAddress");
    var phone = document.getElementById("CDSDPhone");
    var email = document.getElementById("CDSDEmail");
    var comment = document.getElementById("CDSDComment");

    dateTime.innerHTML = result.date.substring(0, 10) + " " + result.startTime + " - " + result.endTime;
    duration.innerHTML = result.duration +" Hrs";
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

