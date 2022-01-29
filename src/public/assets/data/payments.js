

var dtPaymentT = $('#paymentsTable'),
    assetPath = 'app-assets/',
    invoicePreview = 'app-invoice-preview.html',
    invoiceAdd = 'invoice.html',
    invoiceEdit = 'app-invoice-edit.html';
function paymentsTable(a){
  let array_inv =[]
  array_inv.push(JSON.parse($('#payments').val()))
  // if (a) {
    
  //   array_inv = JSON.parse(value)

  // }else{
  //   array_inv = JSON.parse(value.replace(/&quot;/g,'"'))
  // }

  console.log(array_inv)
  if (dtPaymentT.length) {
    var dtInvoice = dtPaymentT.DataTable({
      data: array_inv[0], // JSON file to add data
     columns: [
      { data: 'pmtKey' },
      { data: 'TransactionID' },
      { data: 'TranAmount' },
      { data: 'ProcessorStatus'}, // used for sorting so will hide this column
      { data: 'ProcessorStatusDesc' },
      { data: 'DateProcessesed' },
      { data: 'pmtKey'},
      
      ], 
      columnDefs: [
        {
          targets:2,
          render: function(data, type, full, meta){
       
           return '$'+Number.parseFloat(data).toFixed(2);
          }
        },
        {
          targets:5,
          render: function(data, type, full, meta){
       
           return moment(data).format('MM/DD/YYYY');
          }
        },
        {
          targets:6,
          render: function(data, type, full, meta){
            console.log(full['tPaymentApplication'])
            var arrayAppPayment = encodeURIComponent(JSON.stringify(full['tPaymentApplication']));
            return (
             `<span class="hover_inv" style="cursor:pointer;"   data-arrPayments="${arrayAppPayment}" ><button type="button" class="btn btn-outline-primary waves-effect">View</button></span> `
            );
          }
        },
      ],
      order: [[1, 'desc']],
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
paymentsTable()

  //CONTEXT MENU
  $.contextMenu({
    selector: '.hover_inv',
    trigger: 'hover',
    autoHide: true,
    build: function ($trigger, e) {
      console.log(e)
      var arrPayments = e.currentTarget['dataset']["arrpayments"];
      
      var my_object = JSON.parse(decodeURIComponent(arrPayments));
      console.log(my_object)

       var items1 = {}
      for (let i = 0; i < my_object.length; i++) {
        var newUser = `${my_object[i]['INVOICENUM']}`;
        items1[newUser] = {name: `${my_object[i]['INVOICENUM']} / ${my_object[i]['Status']}`}
      }
     console.log(items1)
        return {
            callback: function (key, options) {
                var m = "clicked: " + key;
                console.log(m);
                location.href="/invoiceO_detail/"+key
            },
            items: 
            items1
            
        };
    }
  });
});
