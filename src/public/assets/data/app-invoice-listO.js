

var dtInvoiceTable = $('#invoiceTable'),
    assetPath = 'app-assets/',
    invoicePreview = 'app-invoice-preview.html',
    invoiceAdd = 'invoice.html',
    invoiceEdit = 'app-invoice-edit.html';
function table_invoices(a){
  let value = $('#payments').val()
  let arrPayments = ""
  arrPayments = JSON.parse(value)
  console.log(arrPayments)
  if (dtInvoiceTable.length) {
    var dtInvoice = dtInvoiceTable.DataTable({
     // data: array_inv, // JSON file to add data
      columnDefs: [
        {
          // For Checkboxes
          targets: 0,
          orderable: false,
          searchable: true,
          responsivePriority: 3,
          render: function (data, type, full, meta) {
            console.log(full)
            return (
              '<div class="form-check"> <input class="form-check-input dt-checkboxes" name="invoicesCh" type="checkbox" value="'+data+'" id="checkbox' +
              data +
              '" /><label class="form-check-label" for="checkbox' +
              data +
              '"></label></div>'
            );
          },
          checkboxes: {
            selectAllRender:
              '<div class="form-check"> <input class="form-check-input" type="checkbox" value="" id="checkboxSelectAll" /><label class="form-check-label" for="checkboxSelectAll"></label></div>'
          }
        },
        {
          targets:1,
          render: function(data, type, full, meta){
       let link =`<a class="me-25" href="/invoiceO_detail/${data}" data-bs-toggle="tooltip" data-bs-placement="top" title="Preview Invoice">${data}</a>`
           return link;
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

    return moment(data).format('MM/DD/YYYY');
   }
 },
 {
  targets:7,
  render: function(data, type, full, meta){
let today = moment()
let diff_days = today.diff(moment(data), 'days')
   return diff_days;
  }
},
{
  targets:9,
  render: function(data, type, full, meta){
    //console.log(full)
let amt_st = full[9]
let amt_wt = full[10].slice(1)
let tax = parseFloat(amt_wt) - parseFloat(amt_st)
   return '$'+tax.toFixed(2);
  }
},
        {
          // Actions
          targets: -1,
         // visible:false,
         // title: 'Actions',
         // width: '80px',
         // orderable: false,
          render: function (data, type, full, meta) {
            let status ="NOT PAYMENT"
            for (let i = 0; i < arrPayments.length; i++) {
              for (let j = 0; j < arrPayments[i]['tPaymentApplication'].length; j++) {
               
                if (arrPayments[i]['tPaymentApplication'][j]['INVOICENUM'] == data) {
                //console.log(arrPayments[i]['tPaymentApplication'][j]['Status'])
                    switch (arrPayments[i]['tPaymentApplication'][j]['Status']) {
                      case 'AUTHORIZED':
                        status ="AUTHORIZED"
                        break;
                        case 'DECLINED':
                          status ="DECLINED"
                          break;
                          case '1':
                          status ="AUTHORIZED"
                          break;
                      default:
                        status ="SOAP ERROR"
                        break;
                    }
                }
              }              
            }
            var statusClass = {
              "SOAP ERROR": { title: 'AUTHORIZED WITH ERROR', class: 'badge-light-warning' },
              "AUTHORIZED": { title: 'PARTIALLY UNPAID', class: 'badge-light-success' },
              "DECLINED": { title: 'DECLINED', class: 'badge-light-danger' },
              "NOT PAYMENT": { title: 'UNPAID', class: 'badge-light-info' },
            };
           let showStatus = `<span class="badge rounded-pill ${statusClass[status].class} " > ${statusClass[status].title}</span>`
            return showStatus
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
      rowCallback: function (row, data) {
     //  console.log(data)
       let Soaperr
       for (let i = 0; i < arrPayments.length; i++) {
        for (let j = 0; j < arrPayments[i]['tPaymentApplication'].length; j++) {
         // console.log(arrPayments[i]['tPaymentApplication'])
          if (arrPayments[i]['tPaymentApplication'][j]['INVOICENUM'] == data[11]) {
           // console.log(arrPayments[i]['tPaymentApplication'][j]['Status'])

            if (arrPayments[i]['tPaymentApplication'][j]['Status'] == "AUTHORIZED" || arrPayments[i]['tPaymentApplication'][j]['Status'] == "DECLINED" || arrPayments[i]['tPaymentApplication'][j]['Status'] == "NOT PAYMENT" || arrPayments[i]['tPaymentApplication'][j]['Status'] == "1") {
              
              
            }else{
            //  console.log(arrPayments[i]['tPaymentApplication'][j]['INVOICENUM'])
            // dtInvoice.$(`#checkbox${arrPayments[i]['tPaymentApplication'][j]['INVOICENUM']}`).attr('disabled', true); 
              $(`#checkbox${arrPayments[i]['tPaymentApplication'][j]['INVOICENUM']}`).remove(); 
              $(row).addClass('block'); 
            }
          }
        }              
      }

    },
      // Buttons with Dropdown
      buttons: [
        {
          text: 'Pay Invoice(s)',
          className: 'btn btn-primary btn-add-record ms-2',
          action: function (e, dt, button, config) {
            let valoresCheck = [];
            dtInvoice.$('input[type="checkbox"]').each(function(){
                 // If checkbox is checked
               //  console.log(this.disabled)
                 if(this.checked){
                     // Create a hidden element
                    valoresCheck.push(this.value)
                    
                 }
           });
                      console.log(valoresCheck)

            if (valoresCheck.length == 0) {    
              
              Swal.fire('Please select at least one invoice ')
          
              return
            }else{
              $('#wait_modal').modal('show')
              $("#ids_invoices").val(valoresCheck);
            $("#pay_invoices_form").submit();
            }
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
        
        let link = $('#links').val()
        let arrLink = JSON.parse(link)
      
        console.log(arrLink)
      if (arrLink['$next']) {
        console.log(arrLink['$next'])
        let data = (arrLink['$next']['$url']).split('&')
        console.log(data)
      //window.location.href= "/next-page/"+data[1]
       // $('<a href="/next-page/${data[1]}"> Next</>').insertBefore(`#invoiceTable_paginate .pagination`)
       if ($('#invoiceTable_next').hasClass('disabled')) {
         $('#invoiceTable_paginate .pagination').append(`<li class="paginate_button page-item"><a href="/next-page/${data[1]}" class="page-link" data-bs-toggle="tooltip" data-bs-placement="top" title="View more"> >> </></li>`)
       }       
      }
      if (arrLink['$previous']) {
        console.log(arrLink['$previous'])
        let data2 = (arrLink['$previous']['$url']).split('&')
        console.log(data2)
      //window.location.href= "/next-page/"+data[1]
       // $('<a href="/next-page/${data[1]}"> Next</>').insertBefore(`#invoiceTable_paginate .pagination`)
       if ($('#invoiceTable_previous').hasClass('disabled')) {
         $('#invoiceTable_paginate .pagination').prepend(`<li class="paginate_button page-item"><a href="/next-page/${data2[1]}" class="page-link" data-bs-toggle="tooltip" data-bs-placement="top" title="View previous"> << </></li>`)
       }       
      }
      }
    });
    $('#invoiceTable_info').addClass('py-2')
    document.getElementById('invoiceTable_info').parentElement.parentElement.classList.add('align-items-center')
  }

}

$(function () {
  'use strict';
  

  // datatable
table_invoices()

});
