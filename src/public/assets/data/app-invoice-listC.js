

var dtInvoiceTable = $('.invoice-list-table'),
    assetPath = 'app-assets/',
    invoicePreview = 'app-invoice-preview.html',
    invoiceAdd = 'invoice.html',
    invoiceEdit = 'app-invoice-edit.html';
function table_invoices(a){
  let value = $('#invoices_list').val()
  let array_inv = ""
  // if (a) {
    
  //   array_inv = JSON.parse(value)

  // }else{
  //   array_inv = JSON.parse(value.replace(/&quot;/g,'"'))
  // }
  array_inv = JSON.parse(value)
  console.log(array_inv)
  if (dtInvoiceTable.length) {
    var dtInvoice = dtInvoiceTable.DataTable({
     // ajax: array_inv, // JSON file to add data
      columnDefs: [
        {
          targets:0,
          render: function(data, type, full, meta){
       let link =`<a class="me-25" href="/invoiceO_detail/${data}" data-bs-toggle="tooltip" data-bs-placement="top" title="Preview Invoice">${data}</a>`
           return link;
          }
        },
        {
          targets:4,
          render: function(data, type, full, meta){
       
           return moment(data).format('MM/DD/YYYY');
          }
        },
 {
   targets:5,
   render: function(data, type, full, meta){

    return moment(data).format('MM/DD/YYYY');
   }
 },
{
  targets:7,
  render: function(data, type, full, meta){
let amt_st = full[6].slice(1)
let amt_wt = full[8].slice(1)
let tax = parseFloat(amt_wt) - parseFloat(amt_st)
   return '$' + tax.toFixed(2);
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
        searchPlaceholder: 'Search Invoice',
        paginate: {
          // remove previous & next text from pagination
          previous: '&nbsp;',
          next: '&nbsp;'
        }
      },
      // Buttons with Dropdown
      buttons: [
        {
          text: 'Add Invoice',
          className: 'btn btn-primary btn-add-record ms-2 d-none',
          action: function (e, dt, button, config) {
            window.location = invoiceAdd;
          }
        }
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
              '<select id="UserRole" class="form-select ms-50 text-capitalize"><option value=""> Select company </option></select>'
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
    $('#DataTables_Table_0_info').addClass('py-2')
    document.getElementById('DataTables_Table_0_info').parentElement.parentElement.classList.add('align-items-center')
  }
}

$(function () {
  'use strict';
  

  // datatable
table_invoices()
});
