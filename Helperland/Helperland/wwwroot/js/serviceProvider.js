

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


var url1 = new URLSearchParams(window.location.search);
var urlcust = url1.toString();
if (urlcust.includes("=")) {
	var indexofequl = urlcust.lastIndexOf("=");
	vTabId = urlcust.substring(indexofequl + 1, urlcust.length);
}
document.getElementById(vTabId).click();



/* ----- new service req server triger ----- */


$(document).on('click', '#NewServiceRequestTabBtn', function () {

	window.location.reload();

	//$.ajax({
	//    url: '/ServiceProvider/SPServiceRequest',
	//    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
	//});


});

/* ---- new serviceereq ----------   */
/*  row click in  new Service req */
var serviceRequestId = "";

$("#SPServiceRequestTable").click(function (e) {


	serviceRequestId = e.target.closest("tr").getAttribute("data-value");


	if (serviceRequestId != null && e.target.classList != "newReqConflictBtn") {

		document.getElementById("spserviceReqdetailsbtn").click();

	}
});


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



	var dashbtn = "";
	var servicehistorybtn = "";
	switch (result.status) {
		case 1: /*new */

			dashbtn = "";
			servicehistorybtn = "d-none";

			break;
		case 2: /*pending */

			dashbtn = "d-none";
			servicehistorybtn = "";
			break;
		//case 3: /*completed */

		//    dashbtn = "d-none";
		//    servicehistorybtn = "";
		//    break;
		//case 4: /*cancelled*/

		//    dashbtn = "d-none";
		//    servicehistorybtn = "d-none";
		//    break;
		default: /*other status */
			alert("invalid status ")

	}

	document.getElementById("detailPopUpNew").className = dashbtn;

	document.getElementById("detailPopUpUpComing").className = servicehistorybtn;





















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


$("#newServiceReqAccept").on('click', function () {

	var data = {};
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
					window.location.reload();
				}, 3000);


			}
			else if (result == "Service Req Not available")
			{
				document.getElementById("acceptAlert").click();

				$('#NewServiceAcceptStatus').text("Service Req Not available").css("color", "Gray");

				window.setTimeout(function () {
					$("#alertPopup").modal("hide");
					window.location.reload();
				}, 3000);
			} else if (result == "error")
			{
				document.getElementById("acceptAlert").click();

				$('#NewServiceAcceptStatus').text("error occured").css("color", "Red");

				window.setTimeout(function () {
					$("#alertPopup").modal("hide");
					window.location.reload();
				}, 3000);
			} else {
				document.getElementById("acceptAlert").click();

				$('#NewServiceAcceptStatus').text("Another service request "+ result+" has already been assigned which has time overlap with this service request.You can’t pick this one!").css("color", "Red");

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





/*    Upcoming Service Request */



$(document).on('click', '#UpcomingServiceTabBtn', function () {

	getUpcomingServiceTable()

});


function getUpcomingServiceTable() {


	$.ajax({
		type: "GET",
		url: '/ServiceProvider/getUpcomingService',
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		success: function (result) {
			$('#UpcomingServiceTbody').empty();

			for (var i = 0; i < result.length; i++) {

				$('#UpcomingServiceTbody').append('<tr class="text-center" data-value=' + result[i].serviceRequestId + ' ><td data-label="Service ID">'
					+ '<p class="margin">' + result[i].serviceRequestId + '</p></td>'
					+ '<td data-label="Service date"> <div><img src="/Images/calendar2.png" alt="calender">' + result[i].date + ' </div>'
					+ '<div><img src="/Images/layer-14.png" alt="clock">' + result[i].startTime + '-' + result[i].endTime +'</td></div>'
					+ '<td class="text-start" data-lable="Customer Details"><div class= "ms-4">' + result[i].customerName + '</div >'
					+ '<div class="d-flex" ><span><img class="me-0" src="/images/layer-15.png" alt=""></span> <span>' + result[i].address + ' </span></div></td>'
					+ '<td data-label="Completed"> <p class= "margin" > <button class="CompleteService d-none">Complete</button></P></td >'
					+'<td data-label="Action"><p class="margin"><button data-bs-toggle="modal" data-bs-target="#SPdeleteModelServiceRequest" class="upcomingcancel">Cancel</button></P>	</td></tr >'
				)
			}



			upcomingserviceDatatable();




		},
		error: function (error) {
			console.log(error);
		}
	});

}



































$("#SPUpcomingServiceTable").click(function (e) {


	serviceRequestId = e.target.closest("tr").getAttribute("data-value");


	if (serviceRequestId != null && e.target.classList != "upcomingcancel") {

		document.getElementById("spserviceReqdetailsbtn").click();

	}
});

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




























































/*pagination for new service req*/

const Newservicerequest = new DataTable("#SPServiceRequestTable", {
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