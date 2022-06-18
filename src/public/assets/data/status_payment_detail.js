/** On this js we render and use the functions for PaymentDetail Table */

var dtPaymentT = $("#detail_payment"); //GET THE TABLE ID FOR USE DATATABLE
var statusArr = { 0 : '<span class="badge rounded-pill badge-light-danger "> FAILED</span>',
1: '<span class="badge rounded-pill badge-light-success "> SUCCESS</span>',
2: '<span class="badge rounded-pill badge-light-info "> CANCELED</span>'
}
/**RENDER THE DATATABLE  WITH A FUNCTION*/
function paymentsTableDetails() {
  /**GET DE JSON PAYMENTS AND INVOICES DETAILS; LATER PARSED TO ARRAY */
  let array_payments;
  let array_inv;

  array_payments = JSON.parse($("#payments").val());
console.log(array_payments)
  /** VERIFY IS EXIST TABLE ID */
  if (dtPaymentT.length) {
    var dtInvoice = dtPaymentT.DataTable({
      data: array_payments[0]["tPaymentApplication"], // JSON data
      columns: [
        //FIELDS FOR COLUMNS
        { data: "INVOICENUM" },
        { data: "OpenAmount" },
        { data: "Status" },
        { data: "errorLog" },
        { data: "tPaymentPmtKey" },
      ],
      columnDefs: [
        {targets: 1,
          render: function (data, type, full, meta){
            return '$'+data;
          }

        },
        {targets: 2,
          render :  function (data, type, full, meta) {
            let currentState
            switch (true) {
              case data == 0 || data == 1 || data == 2:
                currentState = statusArr[data]
                break;            
              default:
                currentState = data
                break;
            }
            return currentState
          }

        },
               {//Check out Status of payment and render 
                targets: -1,
                render: function (data, type, full, meta) {
                  console.log(full)
                let buttons= `<span class="" style="cursor:pointer;" >
                  <button type="button" class="btn btn-outline-secondary btn-sm waves-effect" onclick="cancel('${data}','${full['INVOICENUM']}')">Cancel Payment</button>
                  <button type="button" class="btn btn-outline-success btn-sm waves-effect" onclick="resendX3('${data}','${full['INVOICENUM']}','${full['AppliedAmount']}','${full['ShortDescription']}')">Resend to Sage X3</button>
                  <button type="button" class="btn btn-outline-danger btn-sm waves-effect" onclick="finalize('${data}','${full['INVOICENUM']}')">Finalize Payment</button>
                  </span>`
                  return buttons;
                },
              }, 
      ],
      "bPaginate": false, "bFilter": false, "bInfo": false,
      order: [[0, "desc"]], //ORDER BY INVNUM
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
        searchPlaceholder: "Search",
        paginate: {
          // remove previous & next text from pagination
          previous: "&nbsp;",
          next: "&nbsp;",
        },
      },
      // Buttons with Dropdown
      buttons: [],
      initComplete: function () {
        $(document).find('[data-bs-toggle="tooltip"]').tooltip();
      },
      drawCallback: function () {
        $(document).find('[data-bs-toggle="tooltip"]').tooltip();
      },
    });
  }
}

$(function () {
  "use strict";
  // DATATABLE CREATE
  paymentsTableDetails();
});
 async function resendX3(tPaymentPmtKey,INVOICENUM, AppliedAmount, ShortDescription) {
  $("#wait_modal").modal("show");
   let data = new FormData();
   data.append('tPaymentPmtKey',tPaymentPmtKey);
   data.append('INVOICENUM',INVOICENUM);
   data.append('AppliedAmount',AppliedAmount);
   data.append('ShortDescription',ShortDescription);
   $.ajax({
    url: `/resendX3`,
    type: 'POST',
    data: data,
    cache: false,
    contentType: false,
    processData: false,
    success: function (data, textStatus, jqXHR) {
      $("#wait_modal").modal("hide");
console.log(data)
if (data.statusx3 == 0) {
  Swal.fire('Fail', `X3 response status 0. Error: ${data.error}`,'warning');  
}else{
  Swal.fire('Success', `X3 response status 1. Payment was updated`,'success').then(()=>{
    location.reload()
  });
}
    },
    error: function (jqXHR, textStatus) {
      console.log('error:' + jqXHR)
    }
  });
 }

 async function finalize(tPaymentPmtKey,INVOICENUM, AppliedAmount, ShortDescription) {
  
   let data = new FormData();
   data.append('tPaymentPmtKey',tPaymentPmtKey);
   data.append('INVOICENUM',INVOICENUM);
   Swal.fire({
    title: 'Are you sure?',
    text: "Are you sure you want to finalize this payment and approve invoice!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes!'
  }).then((result) => {
    if (result.isConfirmed) {
      $("#wait_modal").modal("show");
      $.ajax({
        url: `/finalizePayment`,
        type: 'POST',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        success: function (data, textStatus, jqXHR) {
          $("#wait_modal").modal("hide");
    console.log(data)
if (data.paymentAplication[0] > 0) {
  Swal.fire('Success', `Payment was updated`,'success');
  location.reload()
}
        },
        error: function (jqXHR, textStatus) {
          console.log('error:' + jqXHR)
        }
      });
    }
  })

 }

 async function cancel(tPaymentPmtKey,INVOICENUM) {
  $("#wait_modal").modal("show");
   let data = new FormData();
   data.append('tPaymentPmtKey',tPaymentPmtKey);
   data.append('INVOICENUM',INVOICENUM);
   $.ajax({
    url: `/cancelPayment`,
    type: 'POST',
    data: data,
    cache: false,
    contentType: false,
    processData: false,
    success: function (data, textStatus, jqXHR) {
      $("#wait_modal").modal("hide");
console.log(data)
if (data.statusx3 == 0) {
  Swal.fire('Fail', `Somenthing wrong`,'warning');  
}else{
  Swal.fire('Success', `Payment was canceled`,'success').then(()=>{
    location.reload()
  });
 // 
}
    },
    error: function (jqXHR, textStatus) {
      console.log('error:' + jqXHR)
    }
  });
 }