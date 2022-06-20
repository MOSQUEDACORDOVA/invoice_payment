/** On this JS render and use the functions for Closed Invoices Table */

var dtInvoiceTable = $(".invoice-list-table"); //Get TableSelector
function table_invoices(a) {
  let value = $("#invoices_list").val();
  let array_inv = "";
  array_inv = JSON.parse(value); //Parse to array payments
  if (dtInvoiceTable.length) {
    //Convert Table in dataTable
    var dtInvoice = dtInvoiceTable.DataTable({
      columnDefs: [
        {//Render invoice NUM with link to details
          targets: 0,
          render: function (data, type, full, meta) {
            let link = `<a class="me-25" href="/invoiceC_detail/${data}" data-bs-toggle="tooltip" data-bs-placement="top" title="Preview Invoice">${data}</a>`;
            return link;
          },
        },
        {// Format to Invoice Date
          targets: 4,
          render: function (data, type, full, meta) {
            return moment(data).format("MM/DD/YYYY");
          },
        },
        {// Format to Due Date
          targets: 5,
          render: function (data, type, full, meta) {
            return moment(data).format("MM/DD/YYYY");
          },
        },
        {// Calculated Tax and render
          targets: 7,
          render: function (data, type, full, meta) {
            let amt_st = full[6].slice(1);
            let amt_wt = full[8].slice(1);
            let tax = parseFloat(amt_wt) - parseFloat(amt_st);
            return "$" + tax.toFixed(2);
          },
        },
      ],
      order: [[1, "desc"]],
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
        searchPlaceholder: "Search Invoice",
        paginate: {
          // remove previous & next text from pagination
          previous: "&nbsp;",
          next: "&nbsp;",
        },
      },
      // Buttons with Dropdown
      buttons: [

      ],
      initComplete: function () {
        $(document).find('[data-bs-toggle="tooltip"]').tooltip();
        // Sold to filter once table initialized
        var select = $(
          `<select id="SoldTo" class="form-select ms-50 text-capitalize"><option value=""> Search Option </option>
          <option value="NUM"> Invoice Number </option>
          <option value="INVREF"> REF </option>
          <option value="BPCORD"> SOLD TO </option>
          <option value="BPCORD"> COMPANY NAME </option>
          <option value="INVDAT"> INVOICE DATE </option>
          <option value="DUDDAT"> DUE DATE </option>
          </select>
          `
        )
          .appendTo(".invoice_status")
          .on("change", async function (e) {
            var val = $(this).val();

            if (val == "INVDAT" || val == "DUDDAT") {
              $('#search-input-text').addClass('collapse')
              $('#search-input-date').removeClass('collapse')
            } else {
              $('#search-input-text').removeClass('collapse')
              $('#search-input-date').addClass('collapse')
            }

          });
      },
      drawCallback: function () {
        $(document).find('[data-bs-toggle="tooltip"]').tooltip();
        var link = $("#links").val();
        var info = dtInvoiceTable.DataTable().page.info();
        var currentP = parseInt(info.page)+1
        var LastP = parseInt(info.pages)
        /**Check out if exist "Link Next"  */        
        if (link == "") {
          return
        }
        let arrLink = JSON.parse(link);
        
        if (arrLink["$next"]&& currentP == LastP) {
          let data = arrLink["$next"]["$url"].split("&");
          if (currentP == LastP) {            
            nextPage(data)
            $("#DataTables_Table_0_paginate .pagination").append(
              `<div class="spinner"></div>`
            );
          }
        }
      },
    });
    $("#DataTables_Table_0_info").addClass("py-2");
    document
      .getElementById("DataTables_Table_0_info")
      .parentElement.parentElement.classList.add("align-items-center");
  }
  $('.dataTables_filter').empty(); // clears the content generated    
  $('.dataTables_filter').append(`        
  <div class="input-group" id="search-input-text">
  <button class="btn btn-outline-primary" type="button" id="button-clear">Clear</button>
  <input type='search' class='form-control' placeholder='Search..' id='search-val'/>
  <button class="btn btn-outline-primary" id="button-search" type="button">Search</button>
</div>

                          <div class="collapse" id="search-input-date">
                              <input type="text" class="form-control flatpickr-basic" placeholder="YYYY-MM-DD" id='search-val-date'/>
                          </div>

`)
  var basicPickr = $('.flatpickr-basic');

  // Default
  if (basicPickr.length) {
    basicPickr.flatpickr();
  }
  $('#button-search').click(async () => {
    let val = $('#SoldTo').val()
    let search = $('#search-val').val()
    if (val == "" && search != "") {
      Swal.fire('Please select one option to search"')
      $('#SoldTo').focus()
      return
    }
    if (val == "" && search == "") {
      val = "NUM"
      search = "INV-"
    }
    $("#wait_modal").modal("show");
    let responseData = await fetch(`/searchCloseAPI/${val}/${search}`)
      .then((response) => response.json())
      .then((data) => {
        $("#wait_modal").modal("hide");
        return data;
      });
    $("#links").val(responseData.links);
    /// $('.invoice-list-table').DataTable().clear().draw();
    $('.invoice-list-table').dataTable().fnDestroy();
    $('.invoice-list-table').empty();
    $('.invoice-list-table').html(`<thead>
    <tr>
        <th>Invoice number</th>
        <th>Ref</th>
        <th>Sold to</th>
        <th>Company Name</th>
        <th>Invoice Date</th>
    <th>Due Date</th>
        <th>Amt</th>
        <th>Tax</th>
        <th>Total</th>
    </tr>
</thead>
<tbody class="table-white-space" id="invoices-table-body">
</tbody>`);
    for (let i = 0; i < responseData.inv_wofilter.length; i++) {
      if (responseData.inv_wofilter[i].NUM_0) {
        $('#invoices-table-body').append(`<tr>
<td>${responseData.inv_wofilter[i].NUM_0}</td>
<td>${responseData.inv_wofilter[i].INVREF_0}</td>
<td>${responseData.inv_wofilter[i].BPCORD_0}</td>
<td>${responseData.inv_wofilter[i].BPCORD__0}</td>
<td>${responseData.inv_wofilter[i].INVDAT_0}</td>
<td>${responseData.inv_wofilter[i].DUDDAT_0}</td>
<td>$${ Number.parseFloat(responseData.inv_wofilter[i].AMTNOT_0).toFixed(2)}</td>
<td>${responseData.inv_wofilter[i].AMTNOT_0}</td>
<td>$${ Number.parseFloat(responseData.inv_wofilter[i].AMTATI_0).toFixed(2)}</td>
</tr>`);
     } else {
        $('#invoices-table-body').append(`<tr>
<td>${responseData.inv_wofilter[i].NUM}</td>
<td>${responseData.inv_wofilter[i].INVREF}</td>
<td>${responseData.inv_wofilter[i].BPCORD}</td>
<td>${responseData.inv_wofilter[i].BPCORD_REF.$description}</td>
<td>${responseData.inv_wofilter[i].INVDAT}</td>
<td>${responseData.inv_wofilter[i].DUDDAT}</td>
<td>${responseData.inv_wofilter[i].CUR_REF.$symbol + "" + Number.parseFloat(responseData.inv_wofilter[i].AMTNOT).toFixed(2)}</td>
<td>${responseData.inv_wofilter[i].AMTNOT}</td>
<td>${responseData.inv_wofilter[i].CUR_REF.$symbol + "" + Number.parseFloat(responseData.inv_wofilter[i].AMTATI).toFixed(2)}</td>
</tr>`);
     }
    };
    table_invoices();
    $('#search-val').val(search)
    $(`#SoldTo option[value="${val}"]`).attr("selected", true);
  })

  $('#search-val-date').change(async () => {
    $("#wait_modal").modal("show");
    let val = $('#SoldTo').val();
    let search = moment($('#search-val-date').val()).format('YYYY-MM-DD');
    let responseData = await fetch(`/searchCloseAPI/${val}/${search}`)
      .then((response) => response.json())
      .then((data) => {
        $("#wait_modal").modal("hide");
        return data;
      });

    $("#links").val(responseData.links);
    $('.invoice-list-table').dataTable().fnDestroy();
    $('.invoice-list-table').empty();
    $('.invoice-list-table').html(`<thead>
<tr>
  <th></th>
  <th>Invoice number</th>
  <th>Ref</thF>
  <th>Sold to</th>
  <th>Company Name</th>
  <th>Invoice Date</th>
  <th>Due Date</th>
  <th>Aged day</th>
  <th>Open Amt</th>
  <th>Tax</th>
  <th>Total</th>
  <th>Payment Status</th>
</tr>
</thead>
<tbody class="table-white-space" id="invoices-table-body">
</tbody>`);
    for (let i = 0; i < responseData.inv_wofilter.length; i++) {
      if (responseData.inv_wofilter[i].NUM_0) {
        $('#invoices-table-body').append(`<tr>
<td>${responseData.inv_wofilter[i].NUM_0}</td>
<td>${responseData.inv_wofilter[i].INVREF_0}</td>
<td>${responseData.inv_wofilter[i].BPCORD_0}</td>
<td>${responseData.inv_wofilter[i].BPCORD__0}</td>
<td>${responseData.inv_wofilter[i].INVDAT_0}</td>
<td>${responseData.inv_wofilter[i].DUDDAT_0}</td>
<td>$${ Number.parseFloat(responseData.inv_wofilter[i].AMTNOT_0).toFixed(2)}</td>
<td>${responseData.inv_wofilter[i].AMTNOT_0}</td>
<td>$${ Number.parseFloat(responseData.inv_wofilter[i].AMTATI_0).toFixed(2)}</td>
</tr>`);
     } else {
        $('#invoices-table-body').append(`<tr>
<td>${responseData.inv_wofilter[i].NUM}</td>
<td>${responseData.inv_wofilter[i].INVREF}</td>
<td>${responseData.inv_wofilter[i].BPCORD}</td>
<td>${responseData.inv_wofilter[i].BPCORD_REF.$description}</td>
<td>${responseData.inv_wofilter[i].INVDAT}</td>
<td>${responseData.inv_wofilter[i].DUDDAT}</td>
<td>${responseData.inv_wofilter[i].CUR_REF.$symbol + "" + Number.parseFloat(responseData.inv_wofilter[i].AMTNOT).toFixed(2)}</td>
<td>${responseData.inv_wofilter[i].AMTNOT}</td>
<td>${responseData.inv_wofilter[i].CUR_REF.$symbol + "" + Number.parseFloat(responseData.inv_wofilter[i].AMTATI).toFixed(2)}</td>
</tr>`);
     }
    };
    table_invoices();
  })
  $('#button-clear').click(async () => {
    let val = "NUM"
    let search = "-"
    $("#wait_modal").modal("show");
    let responseData = await fetch(`/searchOpenAPI/${val}/${search}`)
      .then((response) => response.json())
      .then((data) => {
        $("#wait_modal").modal("hide");
        return data;
      });
    $("#links").val(responseData.links);
    /// $('#invoiceTable').DataTable().clear().draw();
    $('.invoice-list-table').dataTable().fnDestroy();
    $('.invoice-list-table').empty();
    $('.invoice-list-table').html(`<thead>
    <tr>
        <th>Invoice number</th>
        <th>Ref</th>
        <th>Sold to</th>
        <th>Company Name</th>
        <th>Invoice Date</th>
    <th>Due Date</th>
        <th>Amt</th>
        <th>Tax</th>
        <th>Total</th>
    </tr>
</thead>
<tbody class="table-white-space" id="invoices-table-body">
</tbody>`);
    for (let i = 0; i < responseData.inv_wofilter.length; i++) {
      if (responseData.inv_wofilter[i].NUM_0) {
         $('#invoices-table-body').append(`<tr>
<td>${responseData.inv_wofilter[i].NUM_0}</td>
<td>${responseData.inv_wofilter[i].INVREF_0}</td>
<td>${responseData.inv_wofilter[i].BPCORD_0}</td>
<td>${responseData.inv_wofilter[i].BPCORD__0}</td>
<td>${responseData.inv_wofilter[i].INVDAT_0}</td>
<td>${responseData.inv_wofilter[i].DUDDAT_0}</td>
<td>$${ Number.parseFloat(responseData.inv_wofilter[i].AMTNOT_0).toFixed(2)}</td>
<td>${responseData.inv_wofilter[i].AMTNOT_0}</td>
<td>$${ Number.parseFloat(responseData.inv_wofilter[i].AMTATI_0).toFixed(2)}</td>
</tr>`);
      } else {
         $('#invoices-table-body').append(`<tr>
<td>${responseData.inv_wofilter[i].NUM}</td>
<td>${responseData.inv_wofilter[i].INVREF}</td>
<td>${responseData.inv_wofilter[i].BPCORD}</td>
<td>${responseData.inv_wofilter[i].BPCORD_REF.$description}</td>
<td>${responseData.inv_wofilter[i].INVDAT}</td>
<td>${responseData.inv_wofilter[i].DUDDAT}</td>
<td>${responseData.inv_wofilter[i].CUR_REF.$symbol + "" + Number.parseFloat(responseData.inv_wofilter[i].AMTNOT).toFixed(2)}</td>
<td>${responseData.inv_wofilter[i].AMTNOT}</td>
<td>${responseData.inv_wofilter[i].CUR_REF.$symbol + "" + Number.parseFloat(responseData.inv_wofilter[i].AMTATI).toFixed(2)}</td>
</tr>`);
      }
     
};
    table_invoices();

  })
}

$(function () {
  "use strict";
  // Charged DataTable
  table_invoices();
  let counter = 0;
});
async function paymentsL0() {
  console.log('responseData');
  let responseData = await fetch("/paymentsL")
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  $("#payments").val(responseData.paymentsL)
  table_invoices();
}
async function nextPage(data) {
    let responseData = await fetch(`/closed_invoices/p/${data[1]}`)
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
    $("#links").val(responseData.links)
    for (let i = 0; i < responseData.inv_wofilter.length; i++) {
      if (responseData.inv_wofilter[i].NUM_0) {
                      $('.invoice-list-table').DataTable().row.add([
        responseData.inv_wofilter[i].NUM_0,
        responseData.inv_wofilter[i].INVREF_0,
        responseData.inv_wofilter[i].BPCORD_0,
        responseData.inv_wofilter[i].BPCORD_0,
        responseData.inv_wofilter[i].INVDAT_0,
        responseData.inv_wofilter[i].DUDDAT_0,
        "$" + 0,//Number.parseFloat(responseData.inv_wofilter[i].AMTNOT_0).toFixed(2),
        0,//responseData.inv_wofilter[i].AMTNOT_0,
        "$" + 0//Number.parseFloat(responseData.inv_wofilter[i].AMTATI_0).toFixed(2)
      ])//.draw(false);
      } else {
              $('.invoice-list-table').DataTable().row.add([
        responseData.inv_wofilter[i].NUM,
        responseData.inv_wofilter[i].INVREF,
        responseData.inv_wofilter[i].BPCORD,
        responseData.inv_wofilter[i].BPCORD_REF.$description,
        responseData.inv_wofilter[i].INVDAT,
        responseData.inv_wofilter[i].DUDDAT,
        responseData.inv_wofilter[i].CUR_REF.$symbol + "" + Number.parseFloat(responseData.inv_wofilter[i].AMTNOT).toFixed(2),
        responseData.inv_wofilter[i].AMTNOT,
        responseData.inv_wofilter[i].CUR_REF.$symbol + "" + Number.parseFloat(responseData.inv_wofilter[i].AMTATI).toFixed(2)
      ])//.draw(false);
      }

    }
    $('.invoice-list-table').DataTable().draw(false)

}