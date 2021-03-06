/*=========================================================================================
    File Name: app-ecommerce.js
    ----------------------------------------------------------------------------------------
    This script is for checkout payment page, remove payment invoices function
==========================================================================================*/

$(function () {
  'use strict';

  var quantityCounter = $('.quantity-counter'),
    CounterMin = 1,
    CounterMax = 10,
    bsStepper = document.querySelectorAll('.bs-stepper'),
    checkoutWizard = document.querySelector('.checkout-tab-steps'),
    removeItem = $('.remove-wishlist'),
    moveToCart = $('.move-cart'),
    isRtl = $('html').attr('data-textdirection') === 'rtl';

  // remove items from invoices payment page, and calculate the amount to pay
  removeItem.on('click', function (e) {
    let amountWOT = e.currentTarget.dataset['amount']
    let amountWT = e.currentTarget.dataset['amwt']
    let id = e.currentTarget.dataset['id']
    console.log("🚀 ~ file: checkout-payment-invoices.js ~ line 23 ~ e.currentTarget", e.currentTarget)
    let currentSub = $('#Stotal_preview').text()
    let currentTotal = $('#total_preview').text()
    console.log("🚀 ~ file: checkout-payment-invoices.js ~ line 25 ~ currentTotal", currentTotal)
    let currentTax = $('#tax_preview').text()
    let newSub = 0, newTotal = 0, newTax = 0
    newSub = parseFloat(currentSub) - parseFloat(amountWOT)
    
    newTotal = parseFloat(currentTotal) - parseFloat($(`#appliedAmount${id}`).val())
    newTax = parseFloat(newTotal) - parseFloat(newSub)
    $('#Stotal_preview').text((newSub).toFixed(2))
    $('.total_preview').text((newTotal).toFixed(2))
    $('#tax_preview').text((newTax).toFixed(2))
    $('.totalAmountcard').val((newTotal).toFixed(2))
    let items = $('#item_preview').text()
    items = parseInt(items) - 1
    $('#item_preview').text(items)
    console.log("🚀 ~ file: checkout-payment-invoices.js ~ line 37 ~ items", items)

    $(this).closest('.ecommerce-card').remove();
    if (items == 0 || items == '0') {      
      $('#btnplaceOrder').attr('disabled', true)
      $('#returnItems').removeClass('d-none')
      $('#reloadItems').removeClass('d-none')
    }
    toastr['error']('', 'Removed Item 🗑️', {
      closeButton: true,
      tapToDismiss: false,
      rtl: isRtl
    });
  });


  // Checkout Wizard
  // Adds crossed class
  if (typeof bsStepper !== undefined && bsStepper !== null) {
    for (var el = 0; el < bsStepper.length; ++el) {
      bsStepper[el].addEventListener('show.bs-stepper', function (event) {
        var index = event.detail.indexStep;
        var numberOfSteps = $(event.target).find('.step').length - 1;
        var line = $(event.target).find('.step');

        // The first for loop is for increasing the steps,
        // the second is for turning them off when going back
        // and the third with the if statement because the last line
        // can't seem to turn off when I press the first item. ¯\_(ツ)_/¯

        for (var i = 0; i < index; i++) {
          line[i].classList.add('crossed');

          for (var j = index; j < numberOfSteps; j++) {
            line[j].classList.remove('crossed');
          }
        }
        if (event.detail.to == 0) {
          for (var k = index; k < numberOfSteps; k++) {
            line[k].classList.remove('crossed');
          }
          line[0].classList.remove('crossed');
        }
      });
    }
  }

  // Init Wizard
  if (typeof checkoutWizard !== undefined && checkoutWizard !== null) {
    var wizard = new Stepper(checkoutWizard, {
      linear: false
    });

    $(checkoutWizard)
      .find('.btn-next')
      .each(function () {
        $(this).on('click', function (e) {
          let continue0 = true
          $('.reasons').each(function () {
            if ($(`#${$(this).attr('id')}`).is(':visible') && $(this).val()=="") {
              $(`#${$(this).attr('id')}`).addClass('border border-danger')
              $(`#${$(this).attr('id')}`).focus()              
              continue0 = false
            }
        })
        if (continue0) {
          console.log('check here')
          wizard.next();
        }
          
        });
      });

    $(checkoutWizard)
      .find('.btn-prev')
      .on('click', function () {
        wizard.previous();
      });
  }

  // checkout quantity counter
  if (quantityCounter.length > 0) {
    quantityCounter
      .TouchSpin({
        min: CounterMin,
        max: CounterMax
      })
      .on('touchspin.on.startdownspin', function () {
        var $this = $(this);
        $('.bootstrap-touchspin-up').removeClass('disabled-max-min');
        if ($this.val() == 1) {
          $(this).siblings().find('.bootstrap-touchspin-down').addClass('disabled-max-min');
        }
      })
      .on('touchspin.on.startupspin', function () {
        var $this = $(this);
        $('.bootstrap-touchspin-down').removeClass('disabled-max-min');
        if ($this.val() == 10) {
          $(this).siblings().find('.bootstrap-touchspin-up').addClass('disabled-max-min');
        }
      });
  }
});
