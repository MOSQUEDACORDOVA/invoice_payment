/** On this JS render and use the functions for Open Invoices Table */

var dtInvoiceTable = $("#invoiceTable"); //Get TableSelector
function table_invoices(a) {
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
              for (let j = 0;j < arrPayments[i]["tPaymentApplication"].length;j++) {
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
      },
      rowCallback: function (row, data) {
        /**If the status SOAP is error, remove checkbox and block payment for that inv */
        let Soaperr;
        for (let i = 0; i < arrPayments.length; i++) {
          for (let j = 0;j < arrPayments[i]["tPaymentApplication"].length;j++) {
            if (arrPayments[i]["tPaymentApplication"][j]["INVOICENUM"] == data[11]) {
              if (
                arrPayments[i]["tPaymentApplication"][j]["Status"] ==
                  "AUTHORIZED" ||
                arrPayments[i]["tPaymentApplication"][j]["Status"] ==
                  "DECLINED" ||
                arrPayments[i]["tPaymentApplication"][j]["Status"] ==
                  "NOT PAYMENT" ||
                arrPayments[i]["tPaymentApplication"][j]["Status"] == "1"  ||
                arrPayments[i]["tPaymentApplication"][j]["Status"] == "PENDING"
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
        // Sold to filter once table initialized
        this.api()
          .columns(3)
          .every(function () {
            var column = this;
            var select = $(
              '<select id="SoldTo" class="form-select ms-50 text-capitalize"><option value=""> Select company </option></select>'
            )
              .appendTo(".invoice_status")
              .on("change", function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());
                column.search(val ? "^" + val + "$" : "", true, false).draw();
              });

            column
              .data()
              .unique()
              .sort()
              .each(function (d, j) {
                select.append(
                  '<option value="' +
                    d +
                    '" class="text-capitalize">' +
                    d +
                    "</option>"
                );
              });
          });
      },
      drawCallback: function () {
        $(document).find('[data-bs-toggle="tooltip"]').tooltip();
        
        /**Check out if exist "Link Next" for more that 100 result of query */
        let link = $("#links").val();
        let arrLink = JSON.parse(link);
        if (arrLink["$next"]) {
          //If exist next, create a button with link to next page
          let data = arrLink["$next"]["$url"].split("&");
          if ($("#invoiceTable_next").hasClass("disabled")) {
            $("#invoiceTable_paginate .pagination").append(
              `<li class="paginate_button page-item"><a href="/open_invoices/p/${data[1]}" class="page-link" data-bs-toggle="tooltip" data-bs-placement="top" title="View more"> >> </></li>`
            );
          }
        }
        if (arrLink["$previous"]) {
          //If exist previous, create a button with link to previous page
          let data2 = arrLink["$previous"]["$url"].split("&");
          if ($("#invoiceTable_previous").hasClass("disabled")) {
            $("#invoiceTable_paginate .pagination").prepend(
              `<li class="paginate_button page-item"><a href="/open_invoices/p/${data2[1]}" class="page-link" data-bs-toggle="tooltip" data-bs-placement="top" title="View previous"> << </></li>`
            );
          }
        }
      },
    });
    $("#invoiceTable_info").addClass("py-2");
    document
      .getElementById("invoiceTable_info")
      .parentElement.parentElement.classList.add("align-items-center");
  }
}

$(function () {
    "use strict";
  // Charged DataTable
  table_invoices();
});
