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

	
}
