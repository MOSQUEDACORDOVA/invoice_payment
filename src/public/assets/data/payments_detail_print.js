/** On this js we render and use the functions for PaymentDetail Table */

var dtPaymentT = $("#detail_payment"); //GET THE TABLE ID FOR USE DATATABLE

/**RENDER THE DATATABLE  WITH A FUNCTION*/
function paymentsTableDetails() {
  /**GET DE JSON PAYMENTS AND INVOICES DETAILS; LATER PARSED TO ARRAY */
  let array_payments;
  let array_inv;

  array_payments = JSON.parse($("#payments").val());
  array_inv = JSON.parse($("#invoices_details").val());

  /** VERIFY IS EXIST TABLE ID */
  if (dtPaymentT.length) {
    var dtInvoice = dtPaymentT.DataTable({
      data: array_payments[0]["tPaymentApplication"], // JSON data
      columns: [
        //FIELDS FOR COLUMNS
        { data: "INVOICENUM" },
        { data: "INVOICENUM" },
        { data: "INVOICENUM" },
        { data: "OpenAmount" },
        { data: "AppliedAmount" },
        { data: "INVOICENUM" },
      ],
      columnDefs: [
        {/**RENDER COLUMN 0 (TO) */ targets: 0,
          className: "col-1 col-per",},
        {
          /**RENDER COLUMN 1 (TO) */ targets: 1,
          className: "col-1 col-per2",
          render: function (data, type, full, meta) {
            let value; // IN THIS VAR ALMACENATED THE BPCINV
            for (let i = 0; i < array_inv.length; i++) {
              if (data == array_inv[i]["NUM"]) {
                value = array_inv[i]["BPCINV"];
              }
            }
            return value;
          },
        },
        {
          /**RENDER COLUMN 2 (DATE) */ targets: 2,
          className: "col-1 col-per2",
          render: function (data, type, full, meta) {
            let value; // IN THIS VAR ALMACENATED THE INVDAT
            for (let i = 0; i < array_inv.length; i++) {
              if (data == array_inv[i]["NUM"]) {
                value = array_inv[i]["INVDAT"];
              }
            }
            if (value == "0000-00-00") {
              // IF VALUE IS 0 RETURN BLANK
              return "";
            }
            return moment(value).format("MM/DD/YYYY");
          },
        },
        {
          /** RENDER COLUMN 3 (AMOUNT) */ targets: 3,
          className: "col-1 col-per2",
          render: function (data, type, full, meta) {
            let value; // IN THIS VAR ALMACENATED THE AMTLOC
            for (let i = 0; i < array_inv.length; i++) {
              if (data == array_inv[i]["NUM"]) {
                value = array_inv[i]["AMTLOC"];
              }
            }
            return "$" + Number.parseFloat(data).toFixed(2); // RETURN WITH 2 DECIMALS
          },
        },
        {
          /** RENDER COLUMN 4 (APPLIED AMOUNT) */ targets: 4,
          className: "col-1 col-per2",
          render: function (data, type, full, meta) {
            return "$" + Number.parseFloat(data).toFixed(2); // RETURN WITH 2 DECIMALS
          },
        },
        {
          /** RENDER COLUMN 5 (STATUS) */ targets: 5,
          className: "col-1 col-per2",
          render: function (data, type, full, meta) {
            let openAmount, amouintLOC; // ALMACENATED DE OPENLOC AND AMTLOC FOR STATUS
            for (let i = 0; i < array_inv.length; i++) {
              if (data == array_inv[i]["NUM"]) {
                openAmount = array_inv[i]["OPENLOC"];
                amouintLOC = array_inv[i]["AMTLOC"];
              }
            }
            let span;
            switch (true) {
              case openAmount == amouintLOC:
                span = `<span class="badge rounded-pill badge-light-warning" > AUTHORIZED WITH ERROR</span>`;
                break;
              case openAmount == 0:
                span = `<span class="badge rounded-pill badge-light-success" > AUTHORIZED </span>`;
                break;

              default:
                span = `<span class="badge badge-light-info" style="white-space: normal;"> AUTHORIZED WITH BALANCE OR PENDING</span>`;
                break;
            }
            return span;
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
