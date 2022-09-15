/** On this JS render and use the functions for Settings System dataTable */

var dtsettingsTable = $('#settingsTable');
function tableSettings(a) {
  let value = $('#jsonSettings').val()
  let arrSettings = ""
  
  arrSettings = JSON.parse(value)//Parser to array settings list
  //console.log(arrSettings)
  if (dtsettingsTable.length) {
    var settingsT = dtsettingsTable.DataTable({
      data: arrSettings, // Enter data in array
      columns: [//Put the data infor by column
        //{ data: 'id' },
        //{ data: 'typeSett' },
        { data: 'valueSett' },
        //{ data: 'Status' },
      ],
      columnDefs: [
        /*{//Render Type setting column, and create link to edit setting info with Jquery
          targets: 1,
          render: function (data, type, full, meta) {
            let link = `<span class="me-25 settingType" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit this setting" data-sid="${full['id']}" style="cursor:pointer">${data}</span>`
            return link;
          }
        },*/
        {//Render Type setting column, and create link to edit setting info with Jquery
          targets: 0,
          render: function (data, type, full, meta) {
            let active = full.Status == 1 ? 'checked' : ''
            let info = `<div class="d-flex align-items-center justify-content-between w-100">
              <div class="box">
                <span>${full.valueSett}</span>
              </div>
              <div class="box">
                <div class="form-check form-check-primary form-switch">
                  <input type="checkbox" class="form-check-input changeStatusEmail" ${active} id="changeStatusEmail${full.id}" data-id="${full.id}" data-email="${full.valueSett}">
                </div>
              </div>
            </div>`
            return info;
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
      order: [[0, 'desc']],//Order by Value setting DEsc
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
        search: '',
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
          text: 'Add email',
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
    $('#settingsTable_filter label').addClass('m-0')
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
    $.ajax({
      url: `/saveEditSetting`,
      type: 'POST',
      data: $('#editformSettings').serialize(),
      success: function (data, textStatus, jqXHR) {
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
  $('#btnSaveCert').on('click', () => {
    let data = new FormData();
    data.append('clientctr',$('#clientCtr').val());
    data.append('key',$('#keyClient').val())
    $.ajax({
      url: `/saveCert`,
      type: 'POST',
      data: data,
      cache: false,
        contentType: false,
        processData: false,
      success: function (data, textStatus, jqXHR) {
        console.log(data);
        if (data == 'OK') {
          swal.fire('Certificate and Key success update')
        }
      },
      error: function (jqXHR, textStatus) {
        console.log('error:' + jqXHR)
      }
    });
  })

  $('#envTypeCheck').change(function(){
    let productionON=0;
    if ($('#envTypeCheck').is(':checked')) {
      productionON =1;
      $('#certificatesContainer').removeClass('d-none')
      $('#rowMain').toggleClass('match-height')
    }
    if (productionON == 0) {
      $('#certificatesContainer').addClass('d-none')
      $('#rowMain').toggleClass('match-height')
    }
    console.log(productionON)
    let data = new FormData();
    data.append('sId',$('#envTypeCheck').val());
    data.append('sValue','Production');
    data.append('sType','Env')
    data.append('sStatus',productionON)
    
    $.ajax({
      url: `/saveEditSetting`,
      type: 'POST',
      data: data,
      cache: false,
        contentType: false,
        processData: false,
      success: function (data, textStatus, jqXHR) {
        console.log(data);
        if (data == 'OK') {
          swal.fire('Environment success update')
        }
      },
      error: function (jqXHR, textStatus) {
        console.log('error:' + jqXHR)
      }
    });
  });
  $('.changeStatusEmail').change(function(e){
    let id = e.currentTarget['dataset']['id'];
    let email = e.currentTarget['dataset']['email'];
    let value=0;
    if ($('#changeStatusEmail'+id).is(':checked')) {
      value =1;
    }
    let data = new FormData();
    data.append('sId',id);
    data.append('sValue',email);
    data.append('sType','email-Support')
    data.append('sStatus',value)
    
    $.ajax({
      url: `/saveEditSetting`,
      type: 'POST',
      data: data,
      cache: false,
        contentType: false,
        processData: false,
      success: function (data, textStatus, jqXHR) {
        //console.log(data);
        if (data == 'OK') {
          swal.fire('Email-status success update')
        }
      },
      error: function (jqXHR, textStatus) {
        console.log('error:' + jqXHR)
      }
    });
  });
  $('#gatewayCompanyId').on('change', function(e) {
    let id = e.currentTarget['dataset']['id'];
    let value = e.target.value;
    let data = new FormData();
    data.append('sId',id);
    data.append('sValue',value);
    data.append('sType','gatewayCompanyId')
    data.append('sStatus','1')
    $.ajax({
      url: `/saveEditSetting`,
      type: 'POST',
      data: data,
      cache: false,
        contentType: false,
        processData: false,
      success: function (data, textStatus, jqXHR) {
       // console.log(data)
        if (data == 'OK') {
          swal.fire('Gateway Company ID success update')
        }
      },
      error: function (jqXHR, textStatus) {
        console.log('error:' + jqXHR)
      }
    });
  });
  $('#gatewayEntity').on('change', function(e) {
    let id = e.currentTarget['dataset']['id'];
    let value = e.target.value;
    let data = new FormData();
    data.append('sId',id);
    data.append('sValue',value);
    data.append('sType','gatewayEntity')
    data.append('sStatus','1')
    $.ajax({
      url: `/saveEditSetting`,
      type: 'POST',
      data: data,
      cache: false,
        contentType: false,
        processData: false,
      success: function (data, textStatus, jqXHR) {
       // console.log(data)
        if (data == 'OK') {
          swal.fire('Gateway Company ID success update')
        }
      },
      error: function (jqXHR, textStatus) {
        console.log('error:' + jqXHR)
      }
    });
  });
  $('#consumerKey').on('change', function(e) {
    let id = e.currentTarget['dataset']['id'];
    let value = e.target.value;
    let data = new FormData();
    data.append('sId',id);
    data.append('sValue',value);
    data.append('sType','consumerKey')
    data.append('sStatus','1')
    $.ajax({
      url: `/saveEditSetting`,
      type: 'POST',
      data: data,
      cache: false,
        contentType: false,
        processData: false,
      success: function (data, textStatus, jqXHR) {
     //   console.log(data)
        if (data == 'OK') {
          swal.fire('ConsumerKey success update')
        }
      },
      error: function (jqXHR, textStatus) {
        console.log('error:' + jqXHR)
      }
    });
  });
  $('#consumerSecret').on('change', function(e) {
    let id = e.currentTarget['dataset']['id'];
    let value = e.target.value;
    let data = new FormData();
    data.append('sId',id);
    data.append('sValue',value);
    data.append('sType','consumerSecret')
    data.append('sStatus','1')
    $.ajax({
      url: `/saveEditSetting`,
      type: 'POST',
      data: data,
      cache: false,
        contentType: false,
        processData: false,
      success: function (data, textStatus, jqXHR) {
     //   console.log(data)
        if (data == 'OK') {
          swal.fire('consumerSecret success update')
        }
      },
      error: function (jqXHR, textStatus) {
        console.log('error:' + jqXHR)
      }
    });
  });
$('#btnValidate').on('click', function(e) {
    let value = $('#hostLink').val()///e.target.value;
    if (value==''){
      return
    }
    let data = new FormData();
    data.append('hostLink',value);
    $.ajax({
      url: `/testValidate`,
      type: 'POST',
      data: data,
      cache: false,
        contentType: false,
        processData: false,
      success: function (data, textStatus, jqXHR) {
     //   console.log(data)
        if (data.validate.response) {
          swal.fire(data.validate.response);
          return
        }
        if (data.validate.errors) {
          swal.fire(data.validate.errors[0].description);
          return
        }
        swal.fire(data.validate);
      },
      error: function (jqXHR, textStatus) {
        console.log('error:' + jqXHR)
      }
    });
  });
  $('#btnCronTaskTime').on('click',async function(e) {

console.log('here Cron')
// await fetch("/changeCronServer")
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data)
//       return data.EjercisiosData;
//     });
   });
 
   $('#savex3Folderbtn').on('click', async function (e) {
    let id = 28;
    let value = $('#sageX3Folder').val();
    let data = new FormData();
    data.append('sId',id);
    data.append('sValue',value);
    data.append('sType','queryFolder')
    data.append('sStatus','1')
    $.ajax({
      url: `/saveEditSetting`,
      type: 'POST',
      data: data,
      cache: false,
        contentType: false,
        processData: false,
      success: function (data, textStatus, jqXHR) {
       // console.log(data)
        if (data == 'OK') {
          swal.fire('X3Folder success update')
        }
      },
      error: function (jqXHR, textStatus) {
        console.log('error:' + jqXHR)
      }
    });
       
    }); 


/**BUTOON SAVE BANNER */
$('#btnsaveBanner').on('click', () => {
  var bannerText = $('#bannerText').val()
  console.log("🚀 ~ file: app-SysSettings.js ~ line 495 ~ $ ~ bannerText", bannerText)
  var colorText = $('#colorText').val()
  console.log("🚀 ~ file: app-SysSettings.js ~ line 497 ~ $ ~ colorText", colorText)
  var colorBg = $('#colorBg').val()
  console.log("🚀 ~ file: app-SysSettings.js ~ line 499 ~ $ ~ colorBg", colorBg)
  var status =0
  if ($('#onBanner').is(':checked')) {
    status =1
  }
  console.log("🚀 ~ file: app-SysSettings.js ~ line 503 ~ $ ~ status", status)
var bannerKey  = $('#bannerKey').val()
  console.log("🚀 ~ file: app-SysSettings.js ~ line 506 ~ $ ~ bannerKey", bannerKey)
  let data = new FormData();
  data.append('bannerText',bannerText);
  data.append('colorText',colorText);
  data.append('colorBg',colorBg);
  data.append('status',status);
  data.append('bannerKey',bannerKey);
  
  $.ajax({
    url: `saveEditBanner`,
    type: 'POST',
    data: data,
    cache: false,
      contentType: false,
      processData: false,
    success: function (data, textStatus, jqXHR) {
      console.log(data);
      if (data == 'OK') {
        swal.fire('Banner success update')
      }
    },
    error: function (jqXHR, textStatus) {
      console.log('error:' + jqXHR)
    }
  });
})

    /**END FUNCTION READY */});

