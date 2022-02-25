$('.paymentOptions').on('click', (e) => {
  /**Get de CC info, for selected CC and put it in form hidden */
  let cardNumber = e.currentTarget.dataset['card'],
      carName = e.currentTarget.dataset['name'],
      cardExp = e.currentTarget.dataset['exp'],
      paymentID = e.currentTarget.dataset['id'],
      zip = e.currentTarget.dataset['zip'],
      address = e.currentTarget.dataset['address'],
      city = e.currentTarget.dataset['city'],
      state = e.currentTarget.dataset['state'],
      cvv = e.currentTarget.dataset['cvv'],
      typeCC = e.currentTarget.dataset['typecc']
  console.log(typeCC)
  $('#card-holder-cvv').val(cvv)
  let split_exp = cardExp.split('/')
  $('#paymentID').val(paymentID)
  $('#cardNumber').val(cardNumber)
  $('#cardName').val(carName)
  $('#cityP').val(city)
  $('#stateP').val(state)
  $('#expMonth').val(split_exp[0])
  $('#expYear').val(split_exp[1])
  $('#addressCardP').val(address)
  $('#zipCodeP').val(zip)
  $('#cvv').val(cvv)
  $('#typeCC').val(typeCC)
})

$('#btn_continue').on('click', (e) => {
/** Firts verify if info is not blank, and send form with de payment info */

  if ($('#totalAmountcard').val() == 0) {
      Swal.fire("The amount to pay must be greater than zero.!!")
      return
  }
  if ($('#cardNumber').val() == "") {
      Swal.fire("You must select a payment method")
      $('.paymentOptions').focus()
      return
  }
  if ($('#card-holder-cvv').val() == "") {
      Swal.fire("You must enter the cvv of your credit card..!!")
      $('#card-holder-cvv').focus()
      return
  }
  sendformO('form_processPay') // Process payment
})

$('#diferentCardcheck').on('change', (e) => {
  /**show the different card form */
  if ($('#diferentCardcheck').is(':checked')) {
      $('#otherCard').removeClass('collapse')
      return
  }
  $('#otherCard').addClass('collapse')

})   

$('#payotherCard').on('click', (e) => {
  /** Process payment with a diferent method*/
  if ($('#totalAmountcard').val() == 0) {
      Swal.fire("The amount to pay must be greater than zero.!!")
      return
  }
  if ($('#addCardNumber').val() == "") {
      Swal.fire("You must card Number")
      $('#addCardNumber').focus()
      return
  }
  if ($('#addCardName').val() == "") {
      Swal.fire("You must a card name")
      $('#addCardName').focus()
      return
  }
  if ($('#addCardExpiryDate').val() == "") {
      Swal.fire("You must enter the Exp of your credit card..!!")
      $('#addCardExpiryDate').focus()
      return
  }
  if ($('#addCardCvv').val() == "") {
      Swal.fire("You must enter the cvv of your credit card..!!")
      $('#addCardCvv').focus()
      return
  }

  if ($('#addSaveCard').is(':checked')) {
      //Save Card for future billing
      $.ajax({
          url: `/add_method_pay`,
          type: 'POST',
          data: $('#creditCardFormOther').serialize(),
          beforeSend: function () {
              // setting a timeout
              $('#bn_loading').removeClass('d-none')
              $('#primary').modal('show')
          },
          success: function (data, textStatus, jqXHR) {
              if (data.msg) {
                  //if error show msg
                  Swal.fire(data.msg)
                  return
              }
              $('#bn_loading').removeClass('d-none')
              $('#primary').modal('show')
              sendformO('creditCardFormOther') //send payment to process function
              return
          },
          error: function (jqXHR, textStatus) {
              console.log('error:' + jqXHR)
          }
      })
  } else {
      sendformO('creditCardFormOther')// Send process payment without save new credit card
  }

})

$('#addCardExpiryDate').on('keyup', (e) => {
  //Mask for ExpDate on keyup
  let valor = e.target.value
  if (valor.length == 2) {
      if (valor > 12) {// if the month is greater than 12, blank the input
          $('#addCardExpiryDate').val('')
          $('#expMonthO').val('')
          return false
      }
      $('#expMonthO').val(valor)
      valor += '/' //apply slash after month
  }
  if (valor.length > 3) {
      $('#expYearO').val(valor[3] + valor[4])
  }
  $('#addCardExpiryDate').val(valor)
})

$(`#btnplaceOrder`).click(() => {
  /** Cheack out order, check the applieds amounts and shhort reasons and send the arrays to form hidden */
  var applied_amountPlus = [], applied_amountINV = [], reasons = [], amountInvs = [], bpcinv = []
  $('.applied_amount').each(function () {
      amountInvs.push($(this).data('amount'))
      applied_amountPlus.push($(this).val())
  })
  $('#amtInvs').val(amountInvs.toString())
  $('.amountsbyInv').val(applied_amountPlus.toString())

  $('.applied_amountINV').each(function () {
      applied_amountINV.push($(this).val())
  })
  $('.invoicesToPay').val(applied_amountINV.toString())
  $('.reasons').each(function () {
      reasons.push($(this).val())
  })
  $('.reasonLessAmta').val(reasons.toString())
  $('.bpcinv').each(function () {
      bpcinv.push($(this).text())
  })

  let bpcinv_result = bpcinv.filter((item, index) => {
      return bpcinv.indexOf(item) === index;
  })
  $(`.userIDInv`).val(bpcinv_result)

})

//** HERE FUNCTIONS TO PROCESS PAYMENT*/
//Function to Process payment
const sendformO = (form) => {
 
  $.ajax({
      url: `/process_payment`,
      type: 'POST',
      data: $(`#${form}`).serialize(),
      beforeSend: function () {
          // Show modal "Process please wait..."
          $('#bn_loading').removeClass('d-none')
          $('#primary').modal('show')
      },
      success: function (data, textStatus, jqXHR) {
          let process_payment_success
          if (data.response['status'] == 201) { //IF Status 201, response the API process payment
              if (data.data['status'] == 'AUTHORIZED') {
                  //If status the API Payment is AUTHORIZED get the ID of SQL PaymentTable and status
                  $('#pmtKey').val(data.paymenKey.toString())
                  $('#status').val(data.data['status'])
                  process_payment_success = data.data['processorInformation']
                  $('#bn_loading').addClass('d-none')
                  $('#primary').modal('hide')

                  //Check out info of the X3 response
                  let statusX3 = [], errormsg = [], invError = []
                  for (let i = 0; i < data.paymentx3S.length; i++) {
                      statusX3.push(data.paymentx3S[i]['status'])

                      errormsg.push(data.paymentx3S[i]['error'])
                      invError.push(data.paymentx3S[i]['invError'])
                  }

                  $('#status').val(statusX3)
                  //Check out if the X3 status 0 or 1, if status is 1 for all inv, finish, show msg and after go to the payment detail page
                  const found = statusX3.includes('0');
                  if (found != true) {
                      appliedAmountForm()//Save the applied amount info in SQL
                      Swal.fire('Process payment success!').then((response) => {
                          console.log(response)
                          if (response.isConfirmed) {
                              window.location.href = "/payment_view/" + data.paymenKey
                          }
                      })

                  } else {
                      //Else if status is 0 in one of the inv, send email with the info about error and show msg with error in SOAP, after go to payment detail page
                      $('#pmtKey').val(data.paymenKey.toString())
                      let paymenKey = data.paymenKey.toString()
                      appliedAmountForm()//Save the applied amount info in SQL
                      sendEmailError(data.SystemLogL, paymenKey, '{{user.EMAIL}}', JSON.stringify(errormsg), JSON.stringify(invError))
                      Swal.fire('Payment AUTHORIZED, but something is wrong whit SOAP, please contact support- LOGNUM: ' + data.SystemLogL).then((response) => {
                          if (response.isConfirmed) {
                              window.location.href = "/payment_view/" + data.paymenKey
                          }
                      })
                      $('#btn_continue').attr('disabled', true)
                  }

              } else {
                  // If the API process payment response diferent to AUTHORIZEDD, show msg with the error response (Status and error Message)
                  $('#bn_loading').addClass('d-none')
                  $('#primary').modal('hide')
                  $('#pmtKey').val(data.paymenKey.toString())
                  $('#status').val(data.data['status'])
                  appliedAmountForm()//Save the applied amount info in SQL
                  Swal.fire({
                      icon: 'error',
                      title: data.data['status'],
                      text: data.data['errorInformation']['message'],
                  })
              }
          }
          if (data.response['status'] == 400) {
              //IF Status 400, response the API process payment, show error msg and detail about this error, but don't save applied amount
              let res_parse = JSON.parse(data.response['text'])
              $('#bn_loading').addClass('d-none')
              $('#primary').modal('hide')
              if (res_parse['reason'] == "MISSING_FIELD") {
                  Swal.fire({
                      icon: 'error',
                      title: res_parse['status'],
                      text: `${res_parse['message']} (${res_parse['details'][0]['field']})`,
                  })
                  return
              }
              Swal.fire({
                  icon: 'error',
                  title: res_parse['status'],
                  text: `${res_parse['message']}`,
              })
          }
      },
      error: function (jqXHR, textStatus) {
          console.log('error:' + jqXHR)
      }
  });
}

//Function to Send email in case the SOAP response error or status 0 in one of inv
const sendEmailError = async (SystemLogNum, paymenKey, UserID, paymentx3SMessage, invError) => {
  let data = new FormData()
  data.append('SystemLogNum', SystemLogNum)
  data.append('paymenKey', paymenKey)
  data.append('UserID', UserID)
  data.append('paymentx3SMessage', paymentx3SMessage)
  data.append('invError', invError)
  $.ajax({
      url: `/send_email_errorX3`,
      type: 'POST',
      data: data,
      cache: false,
      contentType: false,
      processData: false,
      success: function (data, textStatus, jqXHR) {
          console.log(data)
      },
      error: function (jqXHR, textStatus) {
          console.log('error:' + jqXHR)
      }
  });
}

//Function for verify applied Amount
var appliedAmount = async (amount, id, inv, amwt) => {

  let previousAmt = $(`#previousAmt${id}`).val();
  let newAmount = $(`#appliedAmount${id}`).val();
  let currentSub = $('#Stotal_preview').text()
  let currentTotal = $('#total_preview').text()
  let currentTax = $('#tax_preview').text()
  let newSub = 0, newTotal = 0, newTax = 0
  if (newAmount == "") {
      Swal.fire(`Please enter a new applied amount`)
      return
  }
  //If applied amount is least to current amount show input "Short reason", and calculated new Total to pay
  if (parseFloat(newAmount) < parseFloat(amount)) {
          $(`#shortReasonLabel${id}`).removeClass(`d-none`)
          $(`#shortReasonIn${id}`).removeClass(`d-none`)
          $(`#shortReasonIn${id}`).removeClass(`d-none`)         
          newSub = parseFloat(previousAmt) - parseFloat(newAmount)
          newTotal = parseFloat(currentTotal) - parseFloat(newSub)
          newTax = parseFloat(newTotal) - parseFloat(newSub)
          $(`#previousAmt${id}`).val(newAmount)
          $('.totalAmountcard').val((newTotal).toFixed(2))
          $('.total_preview').text((newTotal).toFixed(2))
          return
  }
  //If applied amount is greatest to current amount show msg and reset input with the current amount
  if (parseFloat(newAmount) > parseFloat(amount)) {
      Swal.fire('The amount must not be greater than the current')
      $(`#appliedAmount${id}`).val(amount)
      return
  }

  //If the applied amount dont change, continue normal, and calculated Current total to pay
  newSub = parseFloat(previousAmt) - parseFloat(newAmount)
  newTotal = parseFloat(currentTotal) - parseFloat(newSub)
  $(`#previousAmt${id}`).val(newAmount)
  $('.total_preview').text((newTotal).toFixed(2))
  $('.totalAmountcard').val((newTotal).toFixed(2))
  $(`#reasons${id}`).val('-')
}

//Function to save the applied Amount info
const appliedAmountForm = async () => {
  $.ajax({
      url: `/applied_amount`,
      type: 'POST',
      data: $('#applied_amtform').serialize(),
      success: function (data, textStatus, jqXHR) {
          console.log(data)
      },
      error: function (jqXHR, textStatus) {
          console.log('error:' + jqXHR)
      }
  });
}
