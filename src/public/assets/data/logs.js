/** On this JS render and use the functions for Open Invoices Table */
let logsDT = $('#logsTable');

async function logsDTCreate(a) {
  let logType = await fetch('/getLogType')
.then((res) => res.json())
.then((data) => {
    return data
});
  console.log(logType)
  $('.dt-column-search thead tr th').each(function (i) {
    var title = $(this).text();
    console.log("🚀 ~ file: smView.js:189 ~ title:", title)
    if (title.length) {
      if (title == 'LogTypeKey') {
        let options = ""
        for (let i = 0; i < logType.length; i++) {
          options += `<option value="${logType[i]['LogTypeKey']}">${logType[i]['LogTypeDescription']}</option>`
          
        }
        let selct = `<select class="form-control" id="stateO" name="state">
        <option value="">All</option>${options}</select>`
        $(this).html(selct);

      }else{
        $(this).html('<input type="search" class="form-control form-control-sm" placeholder="' + title + '" id="P' + title + i + '"/>');

      }
    } else {
      ''
    }

    $('input', this).on('change', function () {
      let valor = this.value
      console.log("🚀 ~ file: init.js ~ line 126 ~ valor", valor)
      if (logsDT.DataTable().column(i).search() !== this.value) {
        logsDT.DataTable().column(i).search(this.value).draw();
      } else {
        logsDT.DataTable().column(i).search(valor).draw();
      }

    });
    $('select', this).on('change', function () {
      let valor = this.value
      console.log("🚀 ~ file: init.js ~ line 126 ~ valor", valor)
      if (logsDT.DataTable().column(i).search() !== this.value) {
        logsDT.DataTable().column(i).search(this.value).draw();
      } else {
        logsDT.DataTable().column(i).search(valor).draw();
      }

    });
    $('input', this).on("search", function (evt) {
      if ($(this).val().length > 0) {
        // the search is being executed
      } else {
        // user clicked reset
        let valor = this.value
        console.log('reset event', valor)
        logsDT.DataTable().column(i).search(valor).draw();
      }
    });
  });
    console.log('here')
    let DTLogs = logsDT.DataTable({
      'processing': true,
      'serverSide': true,
      'serverMethod': 'get',
      'ajax': {
        'url': '/getLogsDataTable'
      },
      'aaSorting': [],
      searching: true,
      columns: [
        { data: 'tlogKey' ,searchable: true},
        { data: 'LogDate' ,searchable: true},
        { data: 'UserID' ,searchable: true},
        { data: 'LogTypeKey' ,searchable: true},
        { data: 'IPAddress' ,searchable: true},
        { data: 'SessionKey' ,searchable: true},
        { data: 'Description' ,searchable: true},
        { data: 'Comment' ,searchable: true},

      ],
      columnDefs: [
        { orderable: false, targets: [0, 1, 2, 3, 4, 5,6,7] },
        {// Format date MM/DD/YYYY
          targets: 3,
          render: function (data, type, full, meta) {

            let logTypeDescription = null;

            for (const logTypes of logType) {
                if (logTypes.LogTypeKey === data) {
                    logTypeDescription = logTypes.LogTypeDescription.trim();
                    break; // Detener la búsqueda una vez que se encuentre una coincidencia
                }
            }
            return logTypeDescription;
          }
        },
        {// Format date MM/DD/YYYY
          targets: 1,
          render: function (data, type, full, meta) {

            return moment(data).format('MM/DD/YYYY');
          }
        },

      ],
      order: [[4, 'desc'], [6,'desc'], [7,'asc']],//Order by pmtKey desc
      dom:

      
        '<"row d-flex justify-content-between align-items-center m-1"' +
        '<"col-lg-6 d-flex align-items-center"lp<"dt-action-buttons text-xl-end text-lg-start text-lg-end text-start "B>>' +
        '<"col-lg-6 d-flex align-items-center justify-content-lg-end flex-lg-nowrap flex-wrap pe-lg-1 p-0"f<"invoice_status ms-sm-2">>' +
        '>t' +
        '<"d-flex justify-content-between mx-2 row"' +
        '<"col-sm-12 col-md-6"i>' +
        '<"col-sm-12 col-md-6">' +
        '>',
      language: {
        sLengthMenu: 'Show _MENU_',
       // search: 'Search',
       processing: '<i class="fa fa-spinner fa-spin fa-2x fa-fw"></i>',
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
        
      },
      drawCallback: function () {
        $(document).find('[data-bs-toggle="tooltip"]').tooltip();
       
      }
    });

}

$(function () {
  'use strict';

  // Whit document ready render dataTable
  logsDTCreate()

});
