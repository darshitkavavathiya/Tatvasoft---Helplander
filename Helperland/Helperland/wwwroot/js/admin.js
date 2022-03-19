
function reply_click(clicked_id) {
    var id = clicked_id + "_popup";

    var popuphide = document.getElementsByClassName("popuptext show");


    for (i = 0; i < popuphide.length; i++) {

        popuphide[i].classList.remove("show");
    }

    var obj = document.getElementById(id);

    obj.classList.toggle("show");


}

//function reply(clicked_id) {
//    var id = clicked_id + "_popup"
//    var obj = document.getElementById(id);

//    obj.classList.toggle("show");
//}




/* function */
function adminTab(evt, service) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("col-10  table-col tab-contant");
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
        data:data,
        success: function (result) {




            $("#adminServicereqTbody").empty();

            

            for (var i = 0; i < result.length; i++) {

                var varStatus = "";
                var star = "";
                var popupfield = "";
                var display = "";

                if (result[i].userProfilePicture == null)
                {
                    result[i].userProfilePicture = "cap.png" ;
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
                star +=" "+ result[i].averageRating;

               
                 
                switch (result[i].status) {

                    case 1: /*new */
                        varStatus = "new";
                        popupfield = ' <p>Edit & Reschedule </p>           <p>Cancel </p>  '
                        break;
                    case 2: /*pending */
                        varStatus = "pending";
                        popupfield = ' <p>Edit & Reschedule </p>           <p>Cancel </p>  '
                        break;
                    case 3: /*completed */
                        varStatus = "completed";
                        popupfield = '    <p> Refund</p>  '
                        break;
                    case 4: /*cancelled*/
                        varStatus = "cancelled";
                        popupfield = '    <p> Refund</p>  '
                        break;
                    default: /*other status */
                        varStatus = "invalid";
                }
                                                         
                var html = '' +
                    '<tr>' +
                    '    <td data-label="Service ID" class="text-center">' +
                    '        ' + result[i].serviceRequestId + 
                    '    </td>' +
                    '    <td data-label="Service date">' +
                    '        <p>' +
                    '            <img src="/Images/calendar2.png" alt="calender">' +
                    '                ' + result[i].date + ' <br>' +
                    '                    <img src="/Images/layer-14.png" alt="clock">' +
                    '                      ' + result[i].startTime + '-' + result[i].endTime +'</p>' +
                    '                                </td>' +
                    '                <td data-label="Customers details">' +
                    '                    <p>' +
                    '                       '+result[i].customerName +' <br>' +
                    '                            <img src="/Images/layer-15.png"' +
                    '                                alt="home">'+result[i].address+'' +
                    '                                    </p>' +
                    '                                </td>' +
                    '                        <td>' +
                    '                            <div class="cap-icon '+ display +'">' +
                    '                                <img src="/Images/' + result[i].userProfilePicture +'"' +
                    '                                    alt="..">' +
                    '                                    </div>' + result[i].serviceProvider   +
                    '                                <div class='+display+'>' + star +
                    '                                </div>' +
                    '                        </td>' +
                    '                            <td data-label="Price"> ' + result[i].totalCost + ' &euro;  </td>' +
                    '                            <td data-label=" Status">' +
                    '                                <button class="'+ varStatus +'">'+ varStatus + '</button>' +
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

        columnDefs: [{ orderable: false, targets: 4 }],

       


    });

}








