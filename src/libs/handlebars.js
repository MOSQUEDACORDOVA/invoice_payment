var moment = require('moment-timezone');
const { encrypt, decrypt } = require('../controllers/crypto'); // ENCRYPT - DECRYPT MODULE

module.exports = {
	showAlerts: (message = {}, alerts) => { //Alerts message
		const categoria = Object.keys(message);
		let html = '';
		if (categoria.length) {
			html += '<div class="form-message-container">';
			message[categoria].forEach(error => {
				html += `<p class="form-message text-danger">${error}</p>`;
			});
			html += '</div>';
		}
		return alerts.fn().html = html;
	},
	getRoles: (Rol) => {//Show Rol description
		console.log(Rol)
		switch (Rol) {
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
	cardHide: (card) => { // Hide card number, only show last 4 numbers
		card = decrypt(card);
		let hideNum = [];
		for (let i = 0; i < card.length; i++) {
			if (i < card.length - 4) {
				hideNum.push("*");
			} else {
				hideNum.push(card[i]);
			}
		}
		return hideNum.join("");
	},
	decryptData: (value1) => {//Decrypt Data
		let encrypted = decrypt(value1);
		return encrypted;
	},
	GetCardType: (number) => {//Get Card Type and show
		 number = decrypt(number);
		// visa
		var re = new RegExp("^4");
		if (number.match(re) != null)
			return "Visa";

		// Mastercard 
		// Updated for Mastercard 2017 BINs expansion
		if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(number))
			return "Mastercard";//MAST

		// AMEX
		re = new RegExp("^3[47]");
		if (number.match(re) != null)
			return "AMEX";

		// Discover
		re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
		if (number.match(re) != null)
			return "Discover";//this DISC

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
			return "Visa Electron";//VISA

		return "";
	},
	format_date: (date) => {
		if (date == '0000-00-00') {
			return '';
		}
		return moment(date).format('MM/DD/YYYY');
	},
	tax_calculate: (mountWOT, mountWT) => {

		let tax = parseFloat(mountWT) - parseFloat(mountWOT)
		return tax.toFixed(2);
	},
	virifiedACH: (id) => {
		if (id == 1) {
			return `<span class="badge badge-light-success ms-50">Verified</span>`
		}else{
			return `<span class="badge badge-light-warning ms-50">Not Verified</span>`
		}
	},
	virifiedACHBtn: (id,payID) => {
		if (id == 1) {
			return `<a class="btn btn-outline-success verified">Verify</a> `
		}else{
			return `<a class="btn btn-outline-info" onclick ="verifyPM('${payID}')" >Verify</a> `
		}
	},
	decimals: (mount) => {	
		return Number.parseFloat(mount).toFixed(2)
	},
	appliedAmt: (AMTATI,OPENLOC) => {	
		let result = parseFloat(AMTATI)-parseFloat(OPENLOC)
		return Number.parseFloat(result).toFixed(2)
	},
	
	JSONparse: (obj) => {

		return JSON.parse(obj)
	},
	status_detail_payment: (openAmount, amouintLOC) => {
		console.log(amouintLOC)
		let span
		switch (true) {
			case openAmount == amouintLOC:
				span =`<span class="badge rounded-pill badge-light-warning" > AUTHORIZED WITH ERROR</span>`
				break;
				case openAmount == 0:
					span =`<span class="badge rounded-pill badge-light-success" > AUTHORIZED </span>`
					break;
					
			default:
				span =`<span class="badge rounded-pill badge-light-info" > AUTHORIZED WITH BALANCE</span>`
				break;
		}
		return span
	},
	phonenumberFormat: (number)=> {
		if( number ) {
			return number.replace( /\D+/g, "" ).replace( /([0-9]{1,3})([0-9]{3})([0-9]{4}$)/gi, "($1) $2-$3" ); //mask numbers (xxx) xxx-xxxx	
		} else {
			return "";
		}
	},
	alterQuill: (value)=> {
		var text = value.replace(/(\r\n|\n|\r)/gm, '<br>');
		return text;
	},
	checkedSwitch: (value)=> {
		let checked;
		if (value == 1) {
			checked = 'checked'
		}
		return checked;
	},
	envCert: (value)=> {
		let checked;
		if (value == 0) {
			checked = `class="d-none"`
		}
		return checked;
	},
	putDnoneClass: (value)=> {
		let classD;
		if (value == 1) {
			classD = `d-none`
		}
		return classD;
	}
}
