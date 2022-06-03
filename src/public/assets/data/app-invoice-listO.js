
/** On this JS render and use the functions for Open Invoices Table */
var dtInvoiceTable = $("#invoiceTable"); //Get TableSelector
var count = 0;

function table_invoices(a) {
  let initPage = 0
  if (a) {
    initPage = a
  }
  let value = $("#payments").val();
  let arrPayments = "";
  arrPayments = JSON.parse(value); //Parse to array payments
  if (dtInvoiceTable.length) {
    var dtInvoice = dtInvoiceTable.DataTable({
      //Convert Table in dataTable
      columnDefs: [
        {// For Checkboxes
          targets: 0,
          orderable: false,
          searchable: true,
          responsivePriority: 3,
          render: function (data, type, full, meta) {
            return (
              '<div class="form-check"> <input class="form-check-input dt-checkboxes" name="invoicesCh" type="checkbox" value="' +
              data +
              '" id="checkbox' +
              data +
              '" /><label class="form-check-label" for="checkbox' +
              data +
              '"></label></div>'
            );
          },
          checkboxes: {
            selectAllRender:
              '<div class="form-check"> <input class="form-check-input" type="checkbox" value="" id="checkboxSelectAll" /><label class="form-check-label" for="checkboxSelectAll"></label></div>',
          },
        },
        {//Render invoice NUM with link to details
          targets: 1,
          render: function (data, type, full, meta) {
            let link = `<a class="me-25" href="/invoiceO_detail/${data}" data-bs-toggle="tooltip" data-bs-placement="top" title="Preview Invoice">${data}</a>`;
            return link;
          },
        },
        {// Format to Invoice Date
          targets: 5,
          render: function (data, type, full, meta) {
            return moment(data).format("MM/DD/YYYY");
          },
        },
        { // Format to Due Date
          targets: 6,
          render: function (data, type, full, meta) {
            return moment(data).format("MM/DD/YYYY");
          },
        },
        {// Calculated Aged day and render
          targets: 7,
          render: function (data, type, full, meta) {
            let today = moment();
            let diff_days = today.diff(moment(data), "days");
            return diff_days;
          },
        },
        {// Calculated Tax and render
          targets: 9,
          render: function (data, type, full, meta) {
            let amt_st = full[9];
            let amt_wt = full[10].slice(1);
            let tax = parseFloat(amt_wt) - parseFloat(amt_st);
            return "$" + tax.toFixed(2);
          },
        },
        {//Check out Status of payment and render 
          targets: -1,
          render: function (data, type, full, meta) {
            let status = "NOT PAYMENT";
            for (let i = 0; i < arrPayments.length; i++) {
              for (let j = 0; j < arrPayments[i]["tPaymentApplication"].length; j++) {
                if (arrPayments[i]["tPaymentApplication"][j]["INVOICENUM"] == data) {
                  switch (arrPayments[i]["tPaymentApplication"][j]["Status"]) {
                    case "AUTHORIZED":
                      status = "AUTHORIZED";
                      break;
                    case "DECLINED":
                      status = "DECLINED";
                      break;
                    case "1":
                      status = "AUTHORIZED";
                      break;
                    case "PENDING":
                      status = "PENDING";
                      break;
                    default:
                      status = "SOAP ERROR";
                      break;
                  }
                }
              }
            }
            var statusClass = {
              "SOAP ERROR": {
                title: "AUTHORIZED WITH ERROR",
                class: "badge-light-warning",
              },
              AUTHORIZED: {
                title: "PARTIALLY UNPAID",
                class: "badge-light-success",
              },
              DECLINED: { title: "DECLINED", class: "badge-light-danger" },
              "NOT PAYMENT": { title: "UNPAID", class: "badge-light-info" },
              "PENDING": { title: "PENDING", class: "badge-light-info" },
            };
            let showStatus = `<span class="badge rounded-pill ${statusClass[status].class} " > ${statusClass[status].title}</span>`;
            return showStatus;
          },
        },
      ],
      order: [[1, "desc"]],
      dom:
        '<"row d-flex justify-content-between align-items-center m-1"' +
        '<"col-lg-6 d-flex align-items-center"l<"dt-action-buttons text-xl-end text-lg-start text-lg-end text-start "B>>' +
        '<"col-lg-6 d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap pe-lg-1 p-0"f<"invoice_status ms-sm-2">>' +
        ">t" +
        '<"d-flex justify-content-between mx-2 row"' +
        '<"col-sm-12 col-md-6"i>' +
        '<"col-sm-12 col-md-6"p>' +
        ">",
      language: {
        sLengthMenu: "Show _MENU_",
        search: "Search",
        searchPlaceholder: "Search Invoice",
        paginate: {
          // remove previous & next text from pagination
          previous: "&nbsp;",
          next: "&nbsp;",
        },
      },"displayStart": initPage,
      rowCallback: function (row, data) {
        /**If the status SOAP is error, remove checkbox and block payment for that inv */
        let Soaperr;
        for (let i = 0; i < arrPayments.length; i++) {
          for (let j = 0; j < arrPayments[i]["tPaymentApplication"].length; j++) {
            if (arrPayments[i]["tPaymentApplication"][j]["INVOICENUM"] == data[11]) {
              if (
                arrPayments[i]["tPaymentApplication"][j]["Status"] ==
                "AUTHORIZED" ||
                arrPayments[i]["tPaymentApplication"][j]["Status"] ==
                "DECLINED" ||
                arrPayments[i]["tPaymentApplication"][j]["Status"] ==
                "NOT PAYMENT" ||
                arrPayments[i]["tPaymentApplication"][j]["Status"] == "1"
                // || arrPayments[i]["tPaymentApplication"][j]["Status"] == "PENDING"
              ) {
              } else {
                $(`#checkbox${arrPayments[i]["tPaymentApplication"][j]["INVOICENUM"]}`).remove();
                $(row).addClass("block");
              }
            }
          }
        }
      },
      // Buttons with Dropdown
      buttons: [
        {//Button for pay invoices
          text: "Pay Invoice(s)",
          className: "btn btn-primary btn-add-record ms-2",
          action: function (e, dt, button, config) {
            let ChecksValue = [];
            dtInvoice.$('input[type="checkbox"]').each(function () {
              // If checkbox is checked
              if (this.checked) {
                // Push value in array
                ChecksValue.push(this.value);
              }
            });
            if (ChecksValue.length == 0) {
              Swal.fire("Please select at least one invoice ");
              return;
            } else {
              $("#wait_modal").modal("show");
              $("#ids_invoices").val(ChecksValue);
              $("#pay_invoices_form").submit();//Submit form to payment page
            }
          },
        },
      ],

      initComplete: function () {
        $(document).find('[data-bs-toggle="tooltip"]').tooltip();
        // filter once table initialized
        var select = $(
          `<select id="SoldTo" class="form-select ms-50 text-capitalize"><option value=""> Search Option </option>
          <option value="NUM"> Invoice Number </option>
          <option value="INVREF"> REF </option>
          <option value="BPCORD"> SOLD TO </option>
          <option value="BPCORD"> COMPANY NAME </option>
          <option value="INVDAT"> INVOICE DATE </option>
          <option value="DUDDAT"> DUE DATE </option>
          </select>
          `
        )
          .appendTo(".invoice_status")
          .on("change", async function (e) {
            var val = $(this).val();
            if (val == "INVDAT" || val == "DUDDAT") {
              $('#search-input-text').addClass('collapse')
              $('#search-input-date').removeClass('collapse')
            } else {
              $('#search-input-text').removeClass('collapse')
              $('#search-input-date').addClass('collapse')
            }

          });
          
      },
      drawCallback: function () {
        $(document).find('[data-bs-toggle="tooltip"]').tooltip();
        var link = $("#links").val();
        var info = dtInvoiceTable.DataTable().page.info();
        var currentP = parseInt(info.page)+1
        var LastP = parseInt(info.pages)
        /**Check out if exist "Link Next"  */        
        if (link == "") {
          return
        }
        let arrLink = JSON.parse(link);        
        if (arrLink["$next"] && currentP == LastP) { 
          let data = arrLink["$next"]["$url"].split("&");
          if (currentP == LastP) {        
            nextPage(data,currentP)
            $("#invoiceTable_paginate .pagination").append(
              `<div class="spinner"></div>`
            );
          }
        }
        // if (arrLink["$previous"]) {
        //   //If exist previous, create a button with link to previous page
        //   let data2 = arrLink["$previous"]["$url"].split("&");
        //   if ($("#invoiceTable_previous").hasClass("disabled")) {
        //     $("#invoiceTable_paginate .pagination").prepend(
        //       `<li class="paginate_button page-item"><a href="/open_invoices/p/${data2[1]}" class="page-link" data-bs-toggle="tooltip" data-bs-placement="top" title="View previous"> << </></li>`
        //     );
        //   }
        // }
      },
    });
    $("#invoiceTable_info").addClass("py-2");
    document
      .getElementById("invoiceTable_info")
      .parentElement.parentElement.classList.add("align-items-center");
  }
  $('.dataTables_filter').empty(); // clears the content generated    
  $('.dataTables_filter').append(`        
        <div class="input-group" id="search-input-text">
        <button class="btn btn-outline-primary" type="button" id="button-clear">Clear</button>
        <input type='search' class='form-control' placeholder='Search..' id='search-val'/>
        <button class="btn btn-outline-primary" id="button-search" type="button">Search</button>
    </div>

                                <div class="collapse" id="search-input-date">
                                    <input type="text" class="form-control flatpickr-basic" placeholder="YYYY-MM-DD" id='search-val-date'/>
                                </div>

    `)
  var basicPickr = $('.flatpickr-basic');

  // Default
  if (basicPickr.length) {
    basicPickr.flatpickr();
  }
  $('#button-search').click(async () => {
    let val = $('#SoldTo').val()
    let search = $('#search-val').val()
    if (val == "" && search != "") {
      Swal.fire('Please select one option to search"')
      $('#SoldTo').focus()
      return
    }
    if (val == "" && search == "") {return    }
    $("#wait_modal").modal("show");
    let responseData = await fetch(`/searchOpenAPI/${val}/${search}`)
      .then((response) => response.json())
      .then((data) => {
        $("#wait_modal").modal("hide");
        return data;
      });
    $("#links").val(responseData.links);
    /// $('#invoiceTable').DataTable().clear().draw();
    $('#invoiceTable').dataTable().fnDestroy();
    $('#invoiceTable').empty();
    $('#invoiceTable').html(`<thead>
    <tr>
        <th></th>
        <th>Invoice number</th>
        <th>Ref</thF>
        <th>Sold to</th>
        <th>Company Name</th>
        <th>Invoice Date</th>
        <th>Due Date</th>
        <th>Aged day</th>
        <th>Open Amt</th>
        <th>Tax</th>
        <th>Total</th>
        <th>Payment Status</th>
    </tr>
</thead>
<tbody class="table-white-space" id="invoices-table-body">
 </tbody>`);
    for (let i = 0; i < responseData.inv_wofilter.length; i++) {
      $('#invoices-table-body').append(`<tr>
     <td>${responseData.inv_wofilter[i].NUM}</td>
     <td>${responseData.inv_wofilter[i].NUM}</td>
     <td>${responseData.inv_wofilter[i].INVREF}</td>
     <td>${responseData.inv_wofilter[i].BPCORD}</td>
     <td>${responseData.inv_wofilter[i].BPCORD_REF.$description}</td>
     <td>${responseData.inv_wofilter[i].INVDAT}</td>
     <td>${responseData.inv_wofilter[i].DUDDAT}</td>
     <td>${responseData.inv_wofilter[i].INVDAT}</td>
     <td>${responseData.inv_wofilter[i].CUR_REF.$symbol + "" + Number.parseFloat(responseData.inv_wofilter[i].OPENLOC).toFixed(2)}</td>
     <td>${responseData.inv_wofilter[i].AMTNOT}</td>
     <td>${responseData.inv_wofilter[i].CUR_REF.$symbol + "" + Number.parseFloat(responseData.inv_wofilter[i].AMTATI).toFixed(2)}</td>
     <td>${responseData.inv_wofilter[i].NUM}</td>
     </tr>
 `);
    };
    table_invoices();
    $('#search-val').val(search)
    $(`#SoldTo option[value="${val}"]`).attr("selected", true);
  })
  $('#button-clear').click(async () => {
    let val = "NUM"
    let search = "-"
    $("#wait_modal").modal("show");
    let responseData = await fetch(`/searchOpenAPI/${val}/${search}`)
      .then((response) => response.json())
      .then((data) => {
        $("#wait_modal").modal("hide");
        return data;
      });
    $("#links").val(responseData.links);
    /// $('#invoiceTable').DataTable().clear().draw();
    $('#invoiceTable').dataTable().fnDestroy();
    $('#invoiceTable').empty();
    $('#invoiceTable').html(`<thead>
    <tr>
        <th></th>
        <th>Invoice number</th>
        <th>Ref</thF>
        <th>Sold to</th>
        <th>Company Name</th>
        <th>Invoice Date</th>
        <th>Due Date</th>
        <th>Aged day</th>
        <th>Open Amt</th>
        <th>Tax</th>
        <th>Total</th>
        <th>Payment Status</th>
    </tr>
</thead>
<tbody class="table-white-space" id="invoices-table-body">
 </tbody>`);
    for (let i = 0; i < responseData.inv_wofilter.length; i++) {
      $('#invoices-table-body').append(`<tr>
     <td>${responseData.inv_wofilter[i].NUM}</td>
     <td>${responseData.inv_wofilter[i].NUM}</td>
     <td>${responseData.inv_wofilter[i].INVREF}</td>
     <td>${responseData.inv_wofilter[i].BPCORD}</td>
     <td>${responseData.inv_wofilter[i].BPCORD_REF.$description}</td>
     <td>${responseData.inv_wofilter[i].INVDAT}</td>
     <td>${responseData.inv_wofilter[i].DUDDAT}</td>
     <td>${responseData.inv_wofilter[i].INVDAT}</td>
     <td>${responseData.inv_wofilter[i].CUR_REF.$symbol + "" + Number.parseFloat(responseData.inv_wofilter[i].OPENLOC).toFixed(2)}</td>
     <td>${responseData.inv_wofilter[i].AMTNOT}</td>
     <td>${responseData.inv_wofilter[i].CUR_REF.$symbol + "" + Number.parseFloat(responseData.inv_wofilter[i].AMTATI).toFixed(2)}</td>
     <td>${responseData.inv_wofilter[i].NUM}</td>
     </tr>
 `);
    };
    table_invoices();

  })

  $('#search-val-date').change(async () => {

    $("#wait_modal").modal("show");
    let val = $('#SoldTo').val()
    let search = moment($('#search-val-date').val()).format('YYYY-MM-DD');

    let responseData = await fetch(`/searchOpenAPI/${val}/${search}`)
      .then((response) => response.json())
      .then((data) => {
        $("#wait_modal").modal("hide");
        return data;
      });
    $("#links").val(responseData.links);
    /// $('#invoiceTable').DataTable().clear().draw();
    $('#invoiceTable').dataTable().fnDestroy();
    $('#invoiceTable').empty();
    $('#invoiceTable').html(`<thead>
    <tr>
        <th></th>
        <th>Invoice number</th>
        <th>Ref</thF>
        <th>Sold to</th>
        <th>Company Name</th>
        <th>Invoice Date</th>
        <th>Due Date</th>
        <th>Aged day</th>
        <th>Open Amt</th>
        <th>Tax</th>
        <th>Total</th>
        <th>Payment Status</th>
    </tr>
</thead>
<tbody class="table-white-space" id="invoices-table-body">
 </tbody>`);
    for (let i = 0; i < responseData.inv_wofilter.length; i++) {
      $('#invoices-table-body').append(`<tr>
     <td>${responseData.inv_wofilter[i].NUM}</td>
     <td>${responseData.inv_wofilter[i].NUM}</td>
     <td>${responseData.inv_wofilter[i].INVREF}</td>
     <td>${responseData.inv_wofilter[i].BPCORD}</td>
     <td>${responseData.inv_wofilter[i].BPCORD_REF.$description}</td>
     <td>${responseData.inv_wofilter[i].INVDAT}</td>
     <td>${responseData.inv_wofilter[i].DUDDAT}</td>
     <td>${responseData.inv_wofilter[i].INVDAT}</td>
     <td>${responseData.inv_wofilter[i].CUR_REF.$symbol + "" + Number.parseFloat(responseData.inv_wofilter[i].OPENLOC).toFixed(2)}</td>
     <td>${responseData.inv_wofilter[i].AMTNOT}</td>
     <td>${responseData.inv_wofilter[i].CUR_REF.$symbol + "" + Number.parseFloat(responseData.inv_wofilter[i].AMTATI).toFixed(2)}</td>
     <td>${responseData.inv_wofilter[i].NUM}</td>
     </tr>
 `);
    };
    table_invoices();
  })
}

$(function () {
  "use strict";
  // Charged DataTable

  paymentsL0();



});
async function loadmore() {
  let responseData = await fetch("/open-invNext50")
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  $("#links").val(responseData.links);
  $("#payments").val(responseData.paymentsL)

  for (let i = 0; i < responseData.inv_wofilter.length; i++) {
    $('#invoiceTable').DataTable().row.add([
      responseData.inv_wofilter[i].NUM,
      responseData.inv_wofilter[i].NUM,
      responseData.inv_wofilter[i].INVREF,
      responseData.inv_wofilter[i].BPCORD,
      responseData.inv_wofilter[i].BPCORD_REF.$description,
      responseData.inv_wofilter[i].INVDAT,
      responseData.inv_wofilter[i].DUDDAT,
      responseData.inv_wofilter[i].INVDAT,
      responseData.inv_wofilter[i].CUR_REF.$symbol + "" + Number.parseFloat(responseData.inv_wofilter[i].OPENLOC).toFixed(2),
      responseData.inv_wofilter[i].AMTNOT,
      responseData.inv_wofilter[i].CUR_REF.$symbol + "" + Number.parseFloat(responseData.inv_wofilter[i].AMTATI).toFixed(2),
      responseData.inv_wofilter[i].NUM
    ]).draw(false);
  }

}
async function paymentsL0() {
  $("#wait_modal").modal("show");
  setTimeout(function(){
    $('#wait_modal').modal('hide')
  }, 2000);
  let responseData = await fetch("/paymentsL")
    .then((response) => response.json())
    .then((data) => {

      $("#wait_modal").modal("hide");
      return data;
    });

  $("#payments").val(responseData.paymentsL)
  table_invoices();

}
async function nextPage(data,currentP) {
  
    $("#wait_modal").modal("show");
    let responseData = await fetch(`/open_invoices/p/${data[1]}`)
      .then((response) => response.json())
      .then((data) => {
        $("#wait_modal").modal("hide");
        return data;
      });   
       $("#links").val(responseData.links)
    for (let i = 0; i < responseData.inv_wofilter.length ; i++) {

      $('#invoiceTable').DataTable().row.add([
        responseData.inv_wofilter[i].NUM,
        responseData.inv_wofilter[i].NUM,
        responseData.inv_wofilter[i].INVREF,
        responseData.inv_wofilter[i].BPCORD,
        responseData.inv_wofilter[i].BPCORD_REF.$description,
        responseData.inv_wofilter[i].INVDAT,
        responseData.inv_wofilter[i].DUDDAT,
        responseData.inv_wofilter[i].INVDAT,
        responseData.inv_wofilter[i].CUR_REF.$symbol + "" + Number.parseFloat(responseData.inv_wofilter[i].OPENLOC).toFixed(2),
        responseData.inv_wofilter[i].AMTNOT,
        responseData.inv_wofilter[i].CUR_REF.$symbol + "" + Number.parseFloat(responseData.inv_wofilter[i].AMTATI).toFixed(2),
        responseData.inv_wofilter[i].NUM
      ])
    }    
     count=0;
$('#invoiceTable').DataTable().draw(false)

}