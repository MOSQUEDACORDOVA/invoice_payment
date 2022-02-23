

var dtPaymentT = $('#detail_payment'),
    assetPath = 'app-assets/',
    invoicePreview = 'app-invoice-preview.html',
    invoiceAdd = 'invoice.html',
    invoiceEdit = 'app-invoice-edit.html';
function paymentsTableDetails(a){
  let array_payments
  let array_inv

  array_payments=JSON.parse($('#payments').val())
  array_inv=JSON.parse($('#invoices_details').val())
  // if (a) {
    
  //   array_inv = JSON.parse(value)

  // }else{
  //   array_inv = JSON.parse(value.replace(/&quot;/g,'"'))
  // }

  console.log(array_inv)
  console.log(array_payments)
  if (dtPaymentT.length) {
    var dtInvoice = dtPaymentT.DataTable({
      data: array_payments[0]['tPaymentApplication'], // JSON file to add data
     columns: [
      { data: 'INVOICENUM' },
      { data: 'INVOICENUM' },
      { data: 'INVOICENUM' },
      { data: 'OpenAmount' },
      { data: 'AppliedAmount'}, // used for sorting so will hide this column
      { data: 'INVOICENUM' },
      
      ], 
      columnDefs: [
        {
          targets:1,
          render: function(data, type, full, meta){
            let value
            for (let i = 0; i < array_inv.length; i++) {
              if (data == array_inv[i]['NUM']) {
                value = array_inv[i]['BPCINV']
              }
              
            }
            return value;
          }
        },
        {
          targets:2,
          render: function(data, type, full, meta){
            let value
            for (let i = 0; i < array_inv.length; i++) {
              if (data == array_inv[i]['NUM']) {
                value = array_inv[i]['INVDAT']
              }
              
            }
            if (value == '0000-00-00') {
              return '';
            }
            return moment(value).format('MM/DD/YYYY');
          }
        },
        {
          targets:3,
          render: function(data, type, full, meta){
            let value
            for (let i = 0; i < array_inv.length; i++) {
              console.log(array_inv[i]['AMTLOC'])
              if (data == array_inv[i]['NUM']) {
                value = array_inv[i]['AMTLOC']
              }
              
            }
            return '$'+  Number.parseFloat(data).toFixed(2)
          }
        },
        {
          targets:4,
          render: function(data, type, full, meta){
            let value
            for (let i = 0; i < array_inv.length; i++) {
              if (data == array_inv[i]['NUM']) {
                value = array_inv[i]['AMTLOC']
              }
              
            }
            return '$'+ Number.parseFloat(data).toFixed(2)
          }
        },
        {
          targets:5,
          render: function(data, type, full, meta){
            let openAmount,
            amouintLOC
            for (let i = 0; i < array_inv.length; i++) {
              if (data == array_inv[i]['NUM']) {
                openAmount = array_inv[i]['OPENLOC']
                amouintLOC = array_inv[i]['AMTLOC']
              }
              
            }
             let span
             switch (true) {
               case openAmount == amouintLOC:
                 span =`<span class="badge rounded-pill badge-light-warning" > AUTHORIZED WITH ERROR</span>`
                 break;
                 case openAmount == 0:
                   span =`<span class="badge rounded-pill badge-light-success" > AUTHORIZED </span>`
                   break;
                  
               default:
                 span =`<span class="badge rounded-pill badge-light-info" > AUTHORIZED WITH BALANCE</span>`
                 break;
             }
            return span
          }
        },
      ],
      order: [[0, 'desc']],
      dom:
        '<"row d-flex justify-content-between align-items-center m-1"' +
        '<"col-lg-6 d-flex align-items-center"l<"dt-action-buttons text-xl-end text-lg-start text-lg-end text-start "B>>' +
        '<"col-lg-6 d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap pe-lg-1 p-0"f<"invoice_status ms-sm-2">>' +
        '>t' +
        '<"d-flex justify-content-between mx-2 row"' +
        '<"col-sm-12 col-md-6"i>' +
        '<"col-sm-12 col-md-6"p>' +
        '>',
      language: {
        sLengthMenu: 'Show _MENU_',
        search: 'Search',
        searchPlaceholder: 'Search',
        paginate: {
          // remove previous & next text from pagination
          previous: '&nbsp;',
          next: '&nbsp;'
        }
      },
      // Buttons with Dropdown
      buttons: [
        
          
      ],
      // For responsive popup
      /*responsive: {
        details: {
          display: $.fn.dataTable.Responsive.display.modal({
            header: function (row) {
              var data = row.data();
              return 'Details of ' + data['client_name'];
            }
          }),
          type: 'column',
          renderer: function (api, rowIdx, columns) {
            var data = $.map(columns, function (col, i) {
              return col.columnIndex !== 2 // ? Do not show row in modal popup if title is blank (for check box)
                ? '<tr data-dt-row="' +
                    col.rowIdx +
                    '" data-dt-column="' +
                    col.columnIndex +
                    '">' +
                    '<td>' +
                    col.title +
                    ':' +
                    '</td> ' +
                    '<td>' +
                    col.data +
                    '</td>' +
                    '</tr>'
                : '';
            }).join('');
            return data ? $('<table class="table"/>').append('<tbody>' + data + '</tbody>') : false;
          }
        }
      },*/
      initComplete: function () {
        $(document).find('[data-bs-toggle="tooltip"]').tooltip();
        // Adding role filter once table initialized
        this.api()
          .columns(3)
          .every(function () {
            var column = this;
            var select = $(
              '<select id="UserRole" class="form-select ms-50 text-capitalize"><option value=""> Select Status </option></select>'
            )
              .appendTo('.invoice_status')
              .on('change', function () {
                var val = $.fn.dataTable.util.escapeRegex($(this).val());
                column.search(val ? '^' + val + '$' : '', true, false).draw();
              });

            column
              .data()
              .unique()
              .sort()
              .each(function (d, j) {
                select.append('<option value="' + d + '" class="text-capitalize">' + d + '</option>');
              });
          });
      },
      drawCallback: function () {
        $(document).find('[data-bs-toggle="tooltip"]').tooltip();
      }
    });
    // $('#invoiceTable_info').addClass('py-2')
    // document.getElementById('invoiceTable_info').parentElement.parentElement.classList.add('align-items-center')
  }
}

$(function () {
  'use strict';
  

  // datatable
paymentsTableDetails()

});
