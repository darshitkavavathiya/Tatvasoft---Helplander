
function reply_click(clicked_id) {
    var id = clicked_id + "_popup";

    var popuphide = document.getElementsByClassName("popuptext show");


    for (i = 0; i < popuphide.length; i++) {

        popuphide[i].classList.remove("show");
    }

    var obj = document.getElementById(id);

    obj.classList.toggle("show");


}










$("#adminservicereqtable").click(function (e) {

    if (e.target.classList != "popup") {
        var popuphide = document.getElementsByClassName("popuptext show");


        for (i = 0; i < popuphide.length; i++) {

            popuphide[i].classList.remove("show");
        }
    }

});


function reply(clicked_id) {
    var id = clicked_id + "_popup"
    var obj = document.getElementById(id);

    obj.classList.toggle("show");
}




/* function */
function adminTab(evt, service) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("col-10  table-col tab-contant");
    for (i = 0; i < tabcontent.length; i++) {

        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" Active", "");
    }
    document.getElementById(service).style.display = "block";
    evt.currentTarget.className += " Active";
}

$(document).ready(function () {

    document.getElementById("servicertabbtn").click();


})












$(document).on("click", "#servicertabbtn", function () {
    console.log("45 get adminservicereq()");
    if ($.fn.DataTable.isDataTable("#adminservicereqtable")) {
        $('#adminservicereqtable').DataTable().clear().destroy();
    }
    getadminservicereq();

});


$(document).on("click", "#filterSubmit", function () {
    console.log("83 submit get adminservicereq()");
    if ($.fn.DataTable.isDataTable("#adminservicereqtable")) {
        $('#adminservicereqtable').DataTable().clear().destroy();
    }
    getadminservicereq();

});

$(document).on("click", "#filterclear", function () {
    console.log("83 submit get adminservicereq()");
    if ($.fn.DataTable.isDataTable("#adminservicereqtable")) {
        $('#adminservicereqtable').DataTable().clear().destroy();
    }
    window.setTimeout(function () {
        getadminservicereq();
    }, 500);


});



function getadminservicereq() {

    var data = {};
    data.serviceRequestId = document.getElementById("filterServiceReqId").value;
    data.zipCode = document.getElementById("filterPincode").value;
    data.email = document.getElementById("filterEmail").value;
    data.customerName = document.getElementById("filterCustomer").value;
    data.serviceProviderName = document.getElementById("filterSp").value;
    data.status = document.getElementById("filterStatus").value;
    data.fromDate = document.getElementById("filterFromdate").value;
    data.toDate = document.getElementById("filterTodate").value;
    console.log(data.serviceRequestId + data.zipCode + data.email + data.customerName + data.serviceProviderName + data.status + data.fromDate + data.toDate);
    $.ajax({
        type: 'GET',
        url: '/Admin/GetServiceRequest',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: data,
        success: function (result) {




            $("#adminServicereqTbody").empty();



            for (var i = 0; i < result.length; i++) {

                var varStatus = "";
                var star = "";
                var popupfield = "";
                var display = "";

                if (result[i].userProfilePicture == null) {
                    result[i].userProfilePicture = "cap.png";
                }

                if (result[i].serviceProvider == null) {
                    display = "d-none";
                    result[i].serviceProvider = "";
                }

                for (var j = 1; j < 6; j++) {

                    if (j <= result[i].averageRating) {

                        star += '<i class="fa fa-star " style="color:#ECB91C; "></i>';

                    }
                    else {
                        star += '<i class="fa fa-star " style="color:silver;"></i>'
                    }

                }
                star += " " + result[i].averageRating;



                switch (result[i].status) {

                    case 1: /*new */
                        varStatus = "new";
                        popupfield = ' <p  class="AdminEdit" data-value=' + result[i].serviceRequestId + '>Edit & Reschedule </p>   '
                            + '<p class="AdminCancle" data-value=' + result[i].serviceRequestId + '> Cancel </p>  ';
                        break;
                    case 2: /*pending */
                        varStatus = "pending";
                        popupfield = ' <p  class="AdminEdit" data-value=' + result[i].serviceRequestId + '>Edit & Reschedule </p> '
                            + '<p class="AdminCancle" data-value=' + result[i].serviceRequestId + '> Cancel </p>  ';
                        break;
                    case 3: /*completed */
                        varStatus = "completed";
                        popupfield = '    <p> Refund</p>  ';
                        break;
                    case 4: /*cancelled*/
                        varStatus = "cancelled";
                        popupfield = '    <p> Refund</p>  ';
                        break;
                    default: /*other status */
                        varStatus = "invalid";
                }

                var html = '' +
                    '<tr >' +
                    '    <td data-label="Service ID" class="text-center">' +
                    '        ' + result[i].serviceRequestId +
                    '    </td>' +
                    '    <td data-label="Service date">' +
                    '        <p>' +
                    '            <img src="/Images/calendar2.png" alt="calender">' +
                    '                ' + result[i].date + ' <br>' +
                    '                    <img src="/Images/layer-14.png" alt="clock">' +
                    '                      ' + result[i].startTime + '-' + result[i].endTime + '</p>' +
                    '                                </td>' +
                    '                <td data-label="Customers details">' +
                    '                    <p>' +
                    '                       ' + result[i].customerName + ' <br>' +
                    '                            <img src="/Images/layer-15.png"' +
                    '                                alt="home">' + result[i].address + '' +
                    '                                    </p>' +
                    '                                </td>' +
                    '                        <td>' +
                    '                            <div class="cap-icon ' + display + '">' +
                    '                                <img src="/Images/' + result[i].userProfilePicture + '"' +
                    '                                    alt="..">' +
                    '                                    </div>' + result[i].serviceProvider +
                    '                                <div class=' + display + '>' + star +
                    '                                </div>' +
                    '                        </td>' +
                    '                            <td data-label="Price"> ' + result[i].totalCost + ' &euro;  </td>' +
                    '                            <td data-label=" Status">' +
                    '                                <button class="' + varStatus + '">' + varStatus + '</button>' +
                    '                            </td>' +
                    '                            <td data-label="Actions">' +
                    '                                <div class="popup" onclick="reply_click(this.id)"' +
                    '                                    id="' + result[i].serviceRequestId + '">' +
                    '                                    <img src="/Images/group-38.png" alt="...">' +
                    '                                        <div class="popuptext" id="' + result[i].serviceRequestId + '_popup">' + popupfield +
                    '                                        </div>' +
                    '                                    </div>' +
                    '                                </td>' +
                    '                            </tr>';





                $("#adminServicereqTbody").append(html);
            }




            adminserviceDatatable();



        },
        error: function () {
            alert("error");
        }
    });
}


var serviceReqId;
var state;
$(document).on('click', '.AdminEdit', function () {

    console.log("edit click 241");
    $("#AdminEditModelBtn").click();
    serviceReqId = this.getAttribute("data-value");
    console.log(serviceReqId);
    FillEditPopup();
});






function FillEditPopup() {

    var data = {};
    data.ServiceRequestId = parseInt(serviceReqId);

    $.ajax({
        type: 'GET',
        url: '/Admin/GetEditPopupData',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: data,
        success: function (result) {







            console.log("suceess" + result.startTime);
            console.log("suceess" + result.date);
            console.log("suceess" + result.address.addressLine1);



            document.querySelector('option[value="' + result.startTime + '"]').selected = true;

            var temp = new Date(result.date);
            console.log("suceess" + temp);


            temp.setDate(temp.getDate() + 1);
            console.log("suceessful" + temp);
            document.getElementById('AdminEditPopupDate').valueAsDate = temp;






            document.getElementById('AdminEditPopupStreet').value = result.address.addressLine2;
            document.getElementById('AdminEditPopupHouse').value = result.address.addressLine1;
            document.getElementById('AdminEditPopupPostalCode').value = result.address.postalCode;


            document.getElementById('AdminEditPopupInvoiceStreet').value = result.address.addressLine2;
            document.getElementById('AdminEditPopupInvoiceHouse').value = result.address.addressLine1;
            document.getElementById('AdminEditPopupInvoicePostalCode').value = result.address.postalCode;

            getCityFromPostalCode(result.address.postalCode, "#AdminEditPopupCity");
            getCityFromPostalCode(result.address.postalCode, "#AdminEditPopupInvoiceCity");





        },
        error: function () {
            alert("error");
        }
    });

}





/*  city from postal code*/
$("#AdminEditPopupPostalCode").keyup(function () {
    if ($("#AdminEditPopupPostalCode").val().length == 6) {
        getCityFromPostalCode($("#AdminEditPopupPostalCode").val(), "#AdminEditPopupCity");
    }
});


$("#AdminEditPopupInvoicePostalCode").keyup(function () {
    if ($("#AdminEditPopupInvoicePostalCode").val().length == 6) {
        getCityFromPostalCode($("#AdminEditPopupInvoicePostalCode").val(), "#AdminEditPopupInvoiceCity");
    }
});






$(document).on('click', '#AdminEditModalUpdateBtn', function () {


    var data = {};
    data.address = {};
    data.ServiceRequestId = parseInt(serviceReqId);
    data.address.addressLine2 = document.getElementById('AdminEditPopupStreet').value;

    data.address.addressLine1 = document.getElementById('AdminEditPopupHouse').value;
    data.address.postalCode = document.getElementById('AdminEditPopupPostalCode').value;
    data.address.city = document.getElementById('AdminEditPopupCity').value;
    data.address.state = state;
    var temp = document.getElementById("AdminEditPopupDate").value;
    data.date = temp + " " + document.getElementById("AdminEditPopupTime").value;







    var testnumber = /^[0-9]{10}$/;
    var testpin = /^[1-9][0-9]{5}$/;
    var popup = document.getElementById("AdminEditModal");

    window.setTimeout(function () {
        $('#AdminEditPopupAlert').addClass('d-none');
    }, 5000);

    if (data.address.addressLine1 == "") {
        $("#AdminEditPopupAlert").removeClass("alert-success d-none").addClass("alert-danger").text("House no. is Required.");
        popup.scrollTop = 0;
        $("#AdminEditPopupHouse").focus();
    }
    else if (data.address.addressLine2 == "") {
        $("#AdminEditPopupAlert").removeClass("alert-success d-none").addClass("alert-danger").text("Street name is Required.");
        popup.scrollTop = 0;
        $("#AdminEditPopupStreet").focus();
    }
    else if (!testpin.test(data.address.postalCode)) {
        $("#AdminEditPopupAlert").removeClass("alert-success d-none").addClass("alert-danger").text("postalcode  is Invalid.");
        popup.scrollTop = 0;
        $("#AdminEditPopupPostalCode").focus();
    }
    else {

        $.ajax({
            type: 'POST',
            url: '/Admin/UpdateServiceReq',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            data: data,
            success: function (result) {

                $("#AdminEditPopupAlert").removeClass("alert-danger d-none").addClass("alert-success").text("Service Request Edit Suceessful.");



                popup.scrollTop = 0;


                window.setTimeout(function () {
                    $("#AdminEditModalClose").click();
                    $("#filterSubmit").click();
                }, 3000);

            },
            error: function () {
                alert("error");
            }
        });

    }

});





//City from pincode
function getCityFromPostalCode(zip, Id) {
    $.ajax({
        method: "GET",
        url: "https://api.postalpincode.in/pincode/" + zip,
        dataType: 'json',
        cache: false,
        success: function (result) {
            if (result[0].status == "Error" || result[0].status == "404") {
                $("#AdminEditPopupAlert").removeClass("alert-success d-none").addClass("alert-danger").text("Enter Valid PostalCode.");

            }
            else {
                $(Id).val(result[0].PostOffice[0].District).prop("disabled", true);

                state = result[0].PostOffice[0].State;


            }
        },
        error: function (error) {

        }
    });
}





$(document).on('click', '.AdminCancle', function () {

    console.log("cancle click 241");

    serviceReqId = this.getAttribute("data-value");

    var data = {};
    data.ServiceRequestId = parseInt(serviceReqId);

    $.ajax({
        type: 'POST',
        url: '/Admin/CencleServiceReq',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: data,
        success: function (result) {

            $("#filterSubmit").click();


            $('#ModalLabel_SID').text("Service Cancled").css("color", "red");
            $("#complete").click();



            //window.setTimeout(function () {


            //}, 3000);

        },
        error: function () {
            alert("error");
        }
    });



});



/*User */

$(document).on("click", "#usermanagementtabbtn", function () {
    console.log("521 ");
    if ($.fn.DataTable.isDataTable("#adminUserTable")) {
        $('#adminUserTable').DataTable().clear().destroy();
    }
    getAdminUserData();

});



$(document).on("click", "#UserFilterSearch", function () {
    
    if ($.fn.DataTable.isDataTable("#adminUserTable")) {
        $('#adminUserTable').DataTable().clear().destroy();
    }
    getAdminUserData()

});

$(document).on("click", "#UserFilterClear", function () {
   
    if ($.fn.DataTable.isDataTable("#adminUserTable")) {
        $('#adminUserTable').DataTable().clear().destroy();
    }
    window.setTimeout(function () {
        getAdminUserData()
    }, 500);


});




function getAdminUserData() {



    var data = {};


    data.name = document.getElementById("UserFilterName").value;
    data.userType = document.getElementById("UserFilterRole").value;
    data.postalCode = document.getElementById("UserFilterPostalCode").value;
    data.phone = document.getElementById("UserFilterPhone").value;
    data.email = document.getElementById("UserFilterEmail").value;
    data.fromDate = document.getElementById("UserFilterFromDate").value;
    data.toDate = document.getElementById("UserFilterToDate").value;
    // console.log(data.serviceRequestId + data.zipCode + data.email + data.customerName + data.serviceProviderName + data.status + data.fromDate + data.toDate);
    console.log(data.toDate);
    console.log(data.fromDate);
    $.ajax({
        type: 'GET',
        url: '/Admin/GetUserData',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: data,
        success: function (result) {




            $("#AdminUserTbody").empty();



            for (var i = 0; i < result.length; i++) {


                //for date

              

                var createdDateTemp = new Date(result[i].createdDate.toString());
                var yyyy = createdDateTemp.getFullYear();
                var mm = createdDateTemp.getMonth() + 1; // Months start at 0!
                var dd = createdDateTemp.getDate();

                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                var createdDateTemp = dd + '/' + mm + '/' + yyyy;


                //for user type

                var userTypeTemp = "Customer";

                if (result[i].userTypeId == 1) {
                    userTypeTemp = "ServiceProvider";
                }
                else if (result[i].userTypeId == 2) {
                    userTypeTemp = "Admin";
                }

                //for active disactive

                var statusTemp = "Active";

                if (result[i].isActive == false) {
                    statusTemp = "InActive";
                }

                //popup


               
                    var popup;

                if (result[i].userTypeId !=1) {
                    if (result[i].isActive == true) {
                        popup = '<p>Deactive</p>';
                    }
                    else {

                        popup = '<p>Activate</p>';

                    }
                }
                else if (result[i].userTypeId == 1) {
                    if (result[i].isApproved == false) {
                        popup = '<p>Approve</p>'
                    }
                    else {
                        if (result[i].isActive == true) {
                            popup = '<p>Deactive</p>';
                        }
                        else {

                            popup = '<p>Activate</p>';

                        }
                    }

                }
               

                //switch (result[i].status) {

                //    case 1: /*new */
                //        varStatus = "new";
                //        popupfield = ' <p  class="AdminEdit" data-value=' + result[i].serviceRequestId + '>Edit & Reschedule </p>   '
                //            + '<p class="AdminCancle" data-value=' + result[i].serviceRequestId + '> Cancel </p>  ';
                //        break;
                //    case 2: /*pending */
                //        varStatus = "pending";
                //        popupfield = ' <p  class="AdminEdit" data-value=' + result[i].serviceRequestId + '>Edit & Reschedule </p> '
                //            + '<p class="AdminCancle" data-value=' + result[i].serviceRequestId + '> Cancel </p>  ';
                //        break;
                //    case 3: /*completed */
                //        varStatus = "completed";
                //        popupfield = '    <p> Refund</p>  ';
                //        break;
                //    case 4: /*cancelled*/
                //        varStatus = "cancelled";
                //        popupfield = '    <p> Refund</p>  ';
                //        break;
                //    default: /*other status */
                //        varStatus = "invalid";
                //}

                var html = ' <tr>' +
                    '                            <td data-label="User Name">' +
                    '                                <p>' + result[i].firstName + '</p>' +
                    '' +
                    '                            </td>' +
                    '                            <td data-label="Date of Registration">' +
                    '                                <p> <img class="me-2" src="/Images/calendar2.png" alt="calender">' + createdDateTemp+'</p>' +
                    '                            </td>' +
                    '                            <td data-label="User Type">' +
                    '                                <p>' + userTypeTemp+ '</p>' +
                    '                            </td>' +
                    '' +
                    '                            <td data-label="Phone">' +
                    '                                <p>'+result[i].mobile+'</p>' +
                    '                            </td>' +
                    '                            <td data-label="Postal Code">' +
                    '                                <p>' + result[i].zipCode + '</p>' +
                    '                            </td>' +
                    '                            <td data-label="Status">' +
                    '                                <button class="' + statusTemp +'">'+statusTemp+'</button>' +
                    '                                </td>' +
                    '                            <td data-label="Actions">' +
                    '                                <div class="popup" onclick="reply_click(this.id)" id="U' + result[i].userId + '"><img' +
                    '                                        src="/Images/group-38.png" alt="...">' +
                    '                                    <div class="popuptext userpopup" data-value="' + result[i].userId+'" id="U'+result[i].userId+'_popup">' +
                                                                popup+
                    '                                    </div>' +
                    '                                </div>' +
                    '                            </td>' +
                    '                        </tr>';





                $("#AdminUserTbody").append(html);
            }




            adminUserDatatable()



        },
        error: function () {
            alert("error");
        }
    });
}






$(document).on("click", ".popuptext.userpopup", function () {

    var id = this.getAttribute("data-value");
    var data = {};
    data.UserId = parseInt(id);

    $.ajax({
        type: 'POST',
        url: '/Admin/UserEdit',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: data,
        success: function (result) {

            $("#UserFilterSearch").click();


            $('#ModalLabel_SID').text(result).css("color", "Green");
            $("#complete").click();



            

        },
        error: function () {
            alert("error");
        }
    });

  

});





























/* Data Table */
function adminserviceDatatable() {


    $("#adminservicereqtable").DataTable({

        dom: 't<"admin-pagenumber"<"admin-pagenumber-left"li><"admin-pagenumber-right"p>>',
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
        iDisplayLength: 10,
        aLengthMenu: [[5, 10, 15, -1], [5, 10, 15, "All"]],

        columnDefs: [{ orderable: false, targets: 6 }],
        order: [[0, "desc"]],



    });

}


function adminUserDatatable() {


    $("#adminUserTable").DataTable({

        dom: 't<"admin-pagenumber"<"admin-pagenumber-left"li><"admin-pagenumber-right"p>>',
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
        iDisplayLength: 10,
        aLengthMenu: [[5, 10, 15, -1], [5, 10, 15, "All"]],

        columnDefs: [{ orderable: false, targets: 6 }],
        order: [[0, "desc"]],



    });

}


