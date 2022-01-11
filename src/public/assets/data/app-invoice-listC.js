

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
      autoWidth: false,
      columnDefs: [
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
  targets:6,
  render: function(data, type, full, meta){
let today = moment()
let diff_days = today.diff(moment(data), 'days')
   return diff_days;
  }
},
{
  targets:8,
  render: function(data, type, full, meta){
let amt_st = full[7].slice(1)
let amt_wt = full[9].slice(1)
let tax = parseFloat(amt_wt) - parseFloat(amt_st)
   return tax.toFixed(2);
  }
},
        {
          // Actions
          targets: -1,
          title: 'Actions',
          width: '80px',
          orderable: false,
          render: function (data, type, full, meta) {
            console.log(full)
            return (
              '<div id="smart-button-container">'+
             '<div style="text-align: center;">'+
                  '<div id="paypal-button-container"></div>'+
              '</div>'+
         '</div><div class="d-flex align-items-center col-actions">' +
              '<a class="me-1 d-none" href="#" data-bs-toggle="tooltip" data-bs-placement="top" title="Send Mail">' +
              feather.icons['send'].toSvg({ class: 'font-medium-2 text-body' }) +
              '</a>' +
              '<a class="me-25" href="/invoiceC_detail/' +
              full[0] +
              '" data-bs-toggle="tooltip" data-bs-placement="top" title="Preview Invoice">' +
              feather.icons['eye'].toSvg({ class: 'font-medium-2 text-body' }) +
              '</a>' +
              '<div class="dropdown d-none">' +
              '<a class="btn btn-sm btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown">' +
              feather.icons['more-vertical'].toSvg({ class: 'font-medium-2 text-body' }) +
              '</a>' +
              '<div class="dropdown-menu dropdown-menu-end">' +
              '<a href="#" class="dropdown-item">' +
              feather.icons['download'].toSvg({ class: 'font-small-4 me-50' }) +
              'Download</a>' +
              '<a href="' +
              invoiceEdit +
              '" class="dropdown-item">' +
              feather.icons['edit'].toSvg({ class: 'font-small-4 me-50' }) +
              'Edit</a>' +
              '<a href="#" class="dropdown-item">' +
              feather.icons['trash'].toSvg({ class: 'font-small-4 me-50' }) +
              'Delete</a>' +
              '<a href="#" class="dropdown-item d-none">' +
              feather.icons['copy'].toSvg({ class: 'font-small-4 me-50' }) +
              'Duplicate</a>' +
              '</div>' +
              '</div>' +
              '</div>'
            );
          }
        }
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
          className: 'btn btn-primary btn-add-record ms-2',
          action: function (e, dt, button, config) {
            window.location = invoiceAdd;
          }
        }
      ],
      // For responsive popup
      responsive: {
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
      },
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
  }
}

$(function () {
  'use strict';
  

  // datatable
table_invoices()
});
