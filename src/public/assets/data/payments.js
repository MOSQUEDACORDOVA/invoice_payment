/** On this JS render and use the functions for Open Invoices Table */
var dtPaymentT = $('#paymentsTable');
function paymentsTable(a){
  let array_inv =[]
  array_inv.push(JSON.parse($('#payments').val()))//Parsed to array payments JSON STring
  
  if (dtPaymentT.length) {
    var dtInvoice = dtPaymentT.DataTable({
      data: array_inv[0], // add data to dataTable
     columns: [
      { data: 'pmtKey' },
      { data: 'CustID' },
      { data: 'TransactionID' },
      { data: 'TranAmount' },
      { data: 'ProcessorStatus'},
      { data: 'ProcessorStatusDesc' },
      { data: 'DateProcessesed' },
      { data: 'pmtKey'},
      
      ], 
      columnDefs: [
        {//TranAmount render whit two decimals
          targets:3,
          render: function(data, type, full, meta){
       
           return '$'+Number.parseFloat(data).toFixed(2);
          }
        },
                {//TranAmount render whit two decimals
                  targets:4,
                  render: function(data, type, full, meta){
                    let status = 1;
                    if (data=='PENDING') {
                      status = 0;
                    }
                   return `<span class="d-none">${status}</span>`+data;
                  }
                },
        {// Format date MM/DD/YYYY
          targets:6,
          render: function(data, type, full, meta){
       
           return moment(data).format('MM/DD/YYYY');
          }
        },
        {//Render button with pmtKey to view payments details
          targets:7,
          render: function(data, type, full, meta){
            let buttons= `<span class="" style="cursor:pointer;" >
            <button type="button" class="btn btn-outline-secondary waves-effect btnview" data-id="${full['pmtKey']}">Detail</button>
            </span>`;
            if ($('#admin').length) {
              buttons= `<span class="" style="cursor:pointer;" >
            <button type="button" class="btn btn-outline-secondary waves-effect btnview" data-id="${full['pmtKey']}">Detail</button>
            <button type="button" class="btn btn-outline-success waves-effect btnStatus" data-id="${full['pmtKey']}">Status</button>
            </span>`
            }
            return buttons;
          }
        },
      ],
      order: [[4, 'asc']],//Order by pmtKey desc
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
      // Buttons blank
      buttons: [        
          
      ],
      initComplete: function () {
        $(document).find('[data-bs-toggle="tooltip"]').tooltip();
        // Adding procesor status filter once table initialized
        this.api()
          .columns(4)
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
  }
    //Button to view paymente details
    dtInvoice.$(`.btnview`).click((e)=>{
    //console.log(e.currentTarget.dataset['id'])
    location.href = "/payment_view/"+e.currentTarget.dataset['id']
  })
    //Button to view status paymente details
    dtInvoice.$(`.btnStatus`).click((e)=>{
    //console.log(e.currentTarget.dataset['id'])
    location.href = "/status_payment_view/"+e.currentTarget.dataset['id']
  })

}

$(function () {
  'use strict';

  // Whit document ready render dataTable
paymentsTable()

});
