/** On this JS render and use the functions for Closed Invoices Table */

var dtInvoiceTable = $(".invoice-list-table"); //Get TableSelector
function table_invoices(a) {
  let value = $("#invoices_list").val();
  let array_inv = "";
  array_inv = JSON.parse(value); //Parse to array payments
  if (dtInvoiceTable.length) {
    //Convert Table in dataTable
    var dtInvoice = dtInvoiceTable.DataTable({
      columnDefs: [
        {//Render invoice NUM with link to details
          targets: 0,
          render: function (data, type, full, meta) {
            let link = `<a class="me-25" href="/invoiceC_detail/${data}" data-bs-toggle="tooltip" data-bs-placement="top" title="Preview Invoice">${data}</a>`;
            return link;
          },
        },
        {// Format to Invoice Date
          targets: 4,
          render: function (data, type, full, meta) {
            return moment(data).format("MM/DD/YYYY");
          },
        },
        {// Format to Due Date
          targets: 5,
          render: function (data, type, full, meta) {
            return moment(data).format("MM/DD/YYYY");
          },
        },
        {// Calculated Tax and render
          targets: 7,
          render: function (data, type, full, meta) {
            let amt_st = full[6].slice(1);
            let amt_wt = full[8].slice(1);
            let tax = parseFloat(amt_wt) - parseFloat(amt_st);
            return "$" + tax.toFixed(2);
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
      // Buttons with Dropdown
      buttons: [
        
      ],
      initComplete: function () {
        $(document).find('[data-bs-toggle="tooltip"]').tooltip();
        // Sold to filter once table initialized
        this.api()
          .columns(3)
          .every(function () {
            var column = this;
            var select = $(
              '<select id="UserRole" class="form-select ms-50 text-capitalize"><option value=""> Select company </option></select>'
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
               `<li class="paginate_button page-item"><a href="/closed_invoices/p/${data[1]}" class="page-link" data-bs-toggle="tooltip" data-bs-placement="top" title="View more"> >> </></li>`
             );
           }
         }
         if (arrLink["$previous"]) {
           //If exist previous, create a button with link to previous page
           let data2 = arrLink["$previous"]["$url"].split("&");
           if ($("#invoiceTable_previous").hasClass("disabled")) {
             $("#invoiceTable_paginate .pagination").prepend(
               `<li class="paginate_button page-item"><a href="/closed_invoices/p/${data2[1]}" class="page-link" data-bs-toggle="tooltip" data-bs-placement="top" title="View previous"> << </></li>`
             );
           }
         }
      },
    });
    $("#DataTables_Table_0_info").addClass("py-2");
    document
      .getElementById("DataTables_Table_0_info")
      .parentElement.parentElement.classList.add("align-items-center");
  }
}

$(function () {
  "use strict";
// Charged DataTable
  table_invoices();
});
