/** On this JS render and use the functions for Settings System dataTable */

var dtsettingsTable = $('#settingsTable');
function tableSettings(a) {
  let value = $('#jsonSettings').val()
  let arrSettings = ""
  arrSettings = JSON.parse(value)//Parser to array settings list
  if (dtsettingsTable.length) {
    var settingsT = dtsettingsTable.DataTable({
      data: arrSettings, // Enter data in array
      columns: [//Put the data infor by column
        { data: 'id' },
        { data: 'typeSett' },
        { data: 'valueSett' },
        { data: 'Status' },
      ],
      columnDefs: [
        {//Render Type setting column, and create link to edit setting info with Jquery
          targets: 1,
          render: function (data, type, full, meta) {
            let link = `<span class="me-25 settingType" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit this setting" data-sid="${full['id']}" style="cursor:pointer">${data}</span>`
            return link;
          }
        },
        {//Render Status of Settings, Enable (color green), Disabled (color Red)
          targets: -1,
          render: function (data, type, full, meta) {

            var statusClass = {
              "0": { title: 'Disabled', class: 'badge-light-danger' },
              "1": { title: 'Enabled', class: 'badge-light-success' },
            };
            let showStatus = `<span class="badge rounded-pill ${statusClass[data].class} " > ${statusClass[data].title}</span>`
            return showStatus
          }
        }
      ],
      order: [[2, 'desc']],//Order by Value setting DEsc
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
        searchPlaceholder: 'Search setting',
        paginate: {
          // remove previous & next text from pagination
          previous: '&nbsp;',
          next: '&nbsp;'
        }
      },
      // Buttons
      buttons: [
        {
          text: 'Add setting',
          className: 'btn btn-primary btn-add-record ms-2',
          action: function (e, dt, button, config) {
            $('.acceptSetting').removeClass('editChange')
            $('.acceptSetting').attr('id', 'acceptSetting')
            $('#idEdit').empty()
            $('#formSettings')[0].reset()
            $('#setSetting').modal('show')
          }
        }
      ],

      initComplete: function () {
        $(document).find('[data-bs-toggle="tooltip"]').tooltip();
        // Adding role filter once table initialized
        this.api()
          .columns(0)
          .every(function () {
            var column = this;
            var select = $(
              '<select id="UserRole" class="form-select ms-50 text-capitalize"><option value=""> Select Setting </option></select>'
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
    $('#settingsTable_info').addClass('py-2')
    document.getElementById('settingsTable_info').parentElement.parentElement.classList.add('align-items-center')
  }
}

$(function () {
  'use strict';
  // When Document Ready render dataTable
  tableSettings()

  /**THIS JQUERY FUNCTION IS FOR SAVE SETTING */
  $('#acceptSetting').on('click', () => {
    $.ajax({
      url: `/saveSetting`,
      type: 'POST',
      data: $('#formSettings').serialize(),
      success: function (data, textStatus, jqXHR) {
        console.log(data)
        //After save, recharge the settings on input "jsonStting"
        $('#jsonSettings').val(data.settings)
        //Destroy and empty Table
        $('#settingsTable').dataTable().fnDestroy();
        $('#settingsTable').empty();
        //Create Element to render Datable
        $('#settingsTable').html(`<thead>
        <tr>
        <th>Id</th>
            <th>Type settings</th>
            <th>Value</th>
            <th>Status</th>
        </tr>
    </thead>`);
        //Empty form
        $('#formSettings').empty()
        //Render datable with new data
        tableSettings()
        //Hide modal
        $('#setSetting').modal('hide')
      },
      error: function (jqXHR, textStatus) {
        console.log('error:' + jqXHR)
      }
    });
  })

  //FUNCTION JQUERY FOR GET WITH AJAX THE SETTING BY ID
  $('.settingType').on('click', (e) => {
    //Create elememt FormData, append ID and send ajax
    let data = new FormData()
    data.append('sId', e.currentTarget['dataset']["sid"])
    $.ajax({
      url: `/editSetting`,
      type: 'POST',
      data: data,
      cache: false,
      contentType: false,
      processData: false,
      success: function (data, textStatus, jqXHR) {
        console.log(data)
        //If form have previous info, blank
        $('#idEdit').empty()
        //Append input with id for save by ID
        $('#idEdit').append(`<input type="text" value="${data.saveSys['id']}" name="sId"/>`)
        //Put the info in the inputs
        $('#editsValue').val(data.saveSys['valueSett'])
        $(`#editsType option[value='${data.saveSys['typeSett']}']`).attr("selected", true);
        $(`#editsStatus option[value='${data.saveSys['Status']}']`).attr("selected", true);
        //Show modal
        $('#setEditSetting').modal('show')
      },
      error: function (jqXHR, textStatus) {
        console.log('error:' + jqXHR)
      }
    });
  })

  /**JQUERY FUNCTION TO SAVE SETTING EDITED */
  $('#editSetting').on('click', () => {
    console.log('hereEdit')
    $.ajax({
      url: `/saveEditSetting`,
      type: 'POST',
      data: $('#editformSettings').serialize(),
      success: function (data, textStatus, jqXHR) {
        console.log(data)
        //After save, recharge the settings on input "jsonStting"
        $('#jsonSettings').val(data.settings)
        //Destroy and empty Table
        $('#settingsTable').dataTable().fnDestroy();
        $('#settingsTable').empty();
        //Create Element to render Datable
        $('#settingsTable').html(`<thead>
          <tr>
          <th>Id</th>
              <th>Type settings</th>
              <th>Value</th>
              <th>Status</th>
          </tr>
      </thead>`);
        //Render datable with new data
        tableSettings()
        //Hide modal
        $('#setEditSetting').modal('hide')
      },
      error: function (jqXHR, textStatus) {
        console.log('error:' + jqXHR)
      }
    });
  })
});
