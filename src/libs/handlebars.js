var moment = require('moment-timezone');

module.exports = {
	showAlerts: (message = {}, alerts) => {
		const categoria = Object.keys(message);

		let html = '';

		if(categoria.length) {
			html += '<div class="form-message-container">';
			message[categoria].forEach(error => {
				html += `<p class="form-message form-message-${categoria}">${error}</p>`;
			});
			html += '</div>';
		}

		return alerts.fn().html = html;
	},
	getRoles: (Rol) => {
		console.log(Rol)
		switch(Rol) {
			case 1:
				return 'Customer';
				break;
			case 2:
				return 'Sales Rep';
				break;
				case 3:
				return 'Sales Manager';
				break;
				case 4:
				return 'Administrator';
				break;
			default:
				return 'Check out Support Please';
				break;
		}
	},
	cardHide: (card) =>{
		let hideNum = [];
	for(let i = 0; i < card.length; i++){
    if(i < card.length-4){
      hideNum.push("*");
    }else{
      hideNum.push(card[i]);
    }
  }
  return hideNum.join("");
	},

	GetCardType: (number) =>{
		// visa
		var re = new RegExp("^4");
		if (number.match(re) != null)
			return "Visa";
	
		// Mastercard 
		// Updated for Mastercard 2017 BINs expansion
		 if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(number)) 
			return "Mastercard";
	
		// AMEX
		re = new RegExp("^3[47]");
		if (number.match(re) != null)
			return "AMEX";
	
		// Discover
		re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
		if (number.match(re) != null)
			return "Discover";
	
		// Diners
		re = new RegExp("^36");
		if (number.match(re) != null)
			return "Diners";
	
		// Diners - Carte Blanche
		re = new RegExp("^30[0-5]");
		if (number.match(re) != null)
			return "Diners - Carte Blanche";
	
		// JCB
		re = new RegExp("^35(2[89]|[3-8][0-9])");
		if (number.match(re) != null)
			return "JCB";
	
		// Visa Electron
		re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
		if (number.match(re) != null)
			return "Visa Electron";
	
		return "";
	}
	
}
