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
	showCurrentMembership: (str1, str2) => {
		if(str1 === str2) {
			return '(actual)';
		}
	},
	showBtnMembership: (str1, str2, btnClass, url, monto, modo) => {
		
			return `
			<form action="${url}" method="post">
			<input type="hidden"   name="amount" value="${monto}" id="monto_plan${str2}">
			<input type="hidden"   name="modo" value="${modo}" id="modo_plan${str2}">
			<input type="hidden"   name="product" value="${str2}" id="tipo_plan${str2}">
			<input type="submit"   class="btn btn-block btn-${btnClass}" value="Obtener Plan" style="border-color: #f8f8f8;border: solid 0.5px;">
			</form>
			`;
	},
	showBtnMembershipCupon: (str1, str2, btnClass, url) => {
		
			return `
			<form  method="post" style="display: grid;grid-template-columns: 1fr 1fr;" id="cuponMembership${str2}">
			<input type="text"   name="cupon" class="form-control-steps" style="width: 90%;	height: 50px;margin-top: 2rem !important;background-color: #${str1}" placeholder="Cupón" required>
			<button type="button"  id="${str2}" class="btn btn-block btn-${btnClass} btncuponMembership" value="Aplicar Cupón" style="border-color: #f8f8f8;border: solid 0.5px;">Aplicar Cupón</button>
			</form>
			`;
	},
	getMembershipDesc: (membership) => {
		switch(membership.toLowerCase()) {
			case 'gold':
				return '¡Eres todo un maestro!';
				break;
			case 'vip':
				return '¡Eres todo un experto!';
				break;
			default:
				return '¡Conviértete en experto!';
				break;
		}
	},
	acceptFiles(membership, accept) {
		if(accept) {
			return membership.toLowerCase() !== 'basic' ? 'audio/*, .zip' : '.zip';
		}
		return membership.toLowerCase() !== 'basic' ? '.mp3, .wav, .aiff, .zip' : '.zip';
	},
	URLRSS: (str1) => {
	//console.log(str1)
	var aux = str1.split(",");
	 let cont =	aux.length;	 
	 var out = `${aux[0]}`;
	 return out;
	},
	URLRSS2: (str1, class1, text, social) => {
		var aux = str1.split(",");
		 let cont =	aux.length;
		//console.log(cont)
		 var out = "";
		 var share_tw =""
		 if (text == "Compartir" && class1 == "tweet"){
			 share_tw ="http://twitter.com/share?text=Gracias por compartir"
			}

		 for (let i = 0; i < cont; i++) {
		//console.log(aux[i])
		if (aux[i] == "") {
			
		}else{
		if (text == "soundcloud"){
			out += `<div class="soundc"><a class="${social} div_share" id="div_share" undone onclick="$(this).removeClass('undone');$(this).addClass('done');"><div id="${social}"><i class="fab fa-${social}"></i></div><div class="label-social">${text}</div></a>
			<label class="label_url" hidden>${share_tw} ${aux[i]}</label> </div>`
			}else if(text == "Me gusta" && social == "facebook"){
			out += `<a class="${social} div_share undone fb-like" id="div_share" onclick="$(this).removeClass('undone');$(this).addClass('done');"><div id="${social}"><i class="fab fa-${social}"></i></div><div class="label-social">${text}</div></a>
			<label class="label_url" hidden>${aux[i]}</label>`	
			}else  if(text == "Compartir" && class1 == "facebook"){
				out += `<a class="${social} share_fb undone" id="share_fb" onclick="$(this).removeClass('undone');$(this).addClass('done');"><div id="${social}"><i class="fab fa-${social}"></i></div><div class="label-social">${text}</div></a>
		<label class="label_url share_fb_label" hidden>https://www.backartist.com/track/${aux[i]}</label>`
			}else  if(text == "Compartir" && class1 == "tweet"){
					out += `<a class="${social} div_share undone" id="div_share" onclick="$(this).removeClass('undone');$(this).addClass('done');"><div id="${social}"><i class="fab fa-${social}"></i></div><div class="label-social">${text}</div></a>
			<label class="label_url" hidden>${share_tw} ${aux[i]}</label>`
				}
				else{
				out += `<a class="${social} div_share undone" id="div_share" onclick="$(this).removeClass('undone');$(this).addClass('done');"><div id="${social}"><i class="fab fa-${social}"></i></div><div class="label-social">${text}</div></a>
			<label class="label_url" hidden>${aux[i]}</label>`	
			}
			}
					 
		 }
		 return out;
		},
		URLRSS33: (url, name) => {
			var aux = url.split(",");
			 let cont =	aux.length;
			 var out = "";
			 if (cont == 1) {
				out += `<div class="add-other mt-3">
				<input type="url" class="form-control-steps ${name}" name="${name}" placeholder="URL de la página" value="${url}">
						<button type="button" class="add-other__btn">
							<i class="fa fa-plus"></i>
						</button></div>`	
			return out
			 }
			 for (let i = 0; i < cont; i++) {
			if (aux[i] == "") {

			}else{
				if (i == 0) {
					out += `<div class="add-other mt-3">
			<input type="url" class="form-control-steps ${name}" name="${name}" placeholder="URL de la página" value="${aux[i]}">
					<button type="button" class="add-other__btn">
						<i class="fa fa-plus"></i>
					</button></div>`
				}
				
					if (i > 0) {
					out += `<div class="add-other mt-3">
			<input type="url" class="form-control-steps ${name}" name="${name}" placeholder="URL de la página" value="${aux[i]}">
					<button type="button" class="remove-other__btn">
						<i class="fa fa-plus"></i>
					</button></div>`
				}

				}
						 
			 }
			 return out;
			},

		LeerMas:(descripcion, color_gate) => {
			const desc = descripcion.length;
			const MaxDesc = 100;
			var text = descripcion.replace(/(\r\n|\n|\r)/gm, '<br>');
			var out = "";
			if (desc > MaxDesc) {
				out += `<div id="resltadoleer" style="color:${color_gate}">${text.substring(0,100)} <a id="leermas">Leer Mas</a></div>
				<div id="restoleer" style="color:${color_gate}">${text} <a id="leermenos">Leer Menos</a></div>`
			}else{
				out += `${text}`
			}
			return out;
		},
		notificaciones: (arreglo, user) => {
			//var aux = JSON.stringify(arreglo);
			let cont =	arreglo.length;
			var out = "";
			//Comprobamos que tenga formato correcto
	
 			Hoy = moment();//Fecha actual del sistema
			 for (let i = 0; i < cont; i++) {
			
          let fecha_inicio = moment(Hoy).isSameOrAfter(arreglo[i].fecha_inicio); // true
          let fecha_final= moment(Hoy).isAfter(arreglo[i].fecha_final); // true
				 if (arreglo[i].estado == "Activa") {
					
					if (fecha_final == false){
						out +=		`<li class="list-notifications__item">${arreglo[i].descripcion}</li>`
					 }
				 }
				}
			 return out;
			},
			fecha_hora: (arreglo) => {
				var out = moment(arreglo).format('DD/MM/YYYY, HH:mm');
				//Comprobamos que tenga formato correcto
				 return out;
				},
			formatoFecha2: (fecha, user) => {
					const f = new Date(fecha);
					f.toLocaleString()
					 
					var Anyo = f.getFullYear();
					var Mes = f.getMonth();
					var Dia = f.getDate();
						var fecha_ = moment(f).format('DD/MM/YYYY, HH:mm');
					 return fecha_;
					},
			estadoCupon: (fecha, cantidad) => {
					const f = new Date(fecha);
						Hoy = new Date();

					var estado = "";
					if (Hoy > f) {
						estado = "Caducado"
					}else if (cantidad == 0){
						estado = "Agotado"
					}else{
						estado = "Activo"
					}
						

					 return estado;
			},

			ColorPay: (metodo, tipo, useractual, comprador) => {
				var estado = "";
				var nuevo_tipo
				nuevo_tipo = tipo.split(':')
				console.log(useractual+"-"+comprador)
				if (metodo == "Paypal" && tipo == "backstore"|| metodo == "MercadoPago" && tipo == "backstore" || metodo == "Backcoins" && nuevo_tipo[0] == "Venta" || metodo == "Paypal" && tipo == "Backcoin"|| metodo == "MercadoPago" && tipo == "Backcoin") {
					estado = "ingreso"
				}else{
				if (metodo == "Backcoins") {
					estado = "egreso"
				}else

				if (tipo == "Retiro Backcoins") {
					estado = "egreso"
				}
				if (metodo == "En espera") {
					estado = "Agotado"
				}
				if (metodo == "Pagado") {
					estado = "Activo"
				}
				if (metodo == "En proceso de pago") {
					estado = "Caducado"
				}	
				}
				
				return estado;
		},
		mathposition: (posicion) => {
			
			return posicion+1;
	},
	mathpositioncolor: (posicion) => {
			let posiciones = posicion+1;
			let out=""
				if (posiciones == "1") {
					out="style='color:goldenrod'"
				}
				if (posiciones == "2") {
					out="style='color:silver'"
				}
				if (posiciones == "3") {
					out="style='color: brown'"
				}
		return out;
},
mathpositioncolorborder: (posicion) => {
	let posiciones = posicion+1;
	let out=""
		if (posiciones == "1") {
			out="style='border: 4px solid goldenrod'"
		}
		if (posiciones == "2") {
			out="style='border: 4px solid silver;'"
		}
		if (posiciones == "3") {
			out="style='border: 4px solid brown'"
		}
return out;
},
	breaklines: (text) => {
		text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
		return text;
},	

	convert_miles: (text) => {

		let vistas = (parseInt(text)).toLocaleString('de-DE')
		var newstr =""
		switch (true) {
			case text >= 1000 && text <10000:
				if (text== 1000) {
					newstr = vistas.replace('000', "k");
				}else{
					let sp = vistas.split('.')
					var primerCaracter = sp[1].charAt(0);
					if (primerCaracter != 0) {					
						if (sp[1] ==999 ) {	
						newstr = vistas.replace(sp[1], "9k+");
						}	else{
							newstr = vistas.replace(sp[1].substr(1), "k+");
						}					
					}else{
						newstr = vistas.replace(sp[1], "k+");
					}					
				}				
				break;
				case text >= 10000 && text < 100000:
					if (text== 10000) {
						newstr = vistas.replace('000', "k");
					}else{
						let sp = vistas.split('.')
						var primerCaracter = sp[1].charAt(0);
						if (primerCaracter != 0) {						
							if (sp[1] == 999 ) {								
							newstr = vistas.replace(sp[1], "9k+");
								}	else{
									if (sp[0] >= 100 && sp[1] >=100) {																			
										newstr = vistas.replace(sp[1],sp[1].substr(-20,1)+ "k+");									
									}else{
										newstr = vistas.replace(sp[1].substr(1), "k+");
									}														
							}						
						}else{
							newstr = vistas.replace(sp[1], "k+");
						}						
					}

				break;
					case text >= 100000 && text <= 999999:
					if (text== 10000) {
						newstr = vistas.replace('000', "k");
					}else{
						let sp = vistas.split('.')
						var primerCaracter = sp[1].charAt(0);
						if (primerCaracter != 0) {
								
								if (sp[1] == 999) {
									newstr = vistas.replace("."+sp[1],".9k+");	
								}	else{
									if (sp[0] >= 100 && sp[1] >=100) {																			
										newstr = vistas.replace(sp[1],sp[1].substr(-20,1)+ "k+");										
									}else{
										newstr = vistas.replace(sp[1].substr(1), "k+");
									}								}															
						}else{
							newstr = vistas.replace(sp[1], "k+");
						}						
					}
					break;
					case text >= 1000000:
					if (text== 1000000) {
						
						let sp = vistas.split('.')
						newstr = vistas.replace(sp[1]+".000", "M");
					}else{
						let sp = vistas.split('.')
						var primerCaracter = sp[1].charAt(1);
						if (primerCaracter != 0) {								
								if (sp[1] == 999) {
									newstr = vistas.replace("."+sp[1],".9M+");	
								}	else{
									
									if (sp[0] >= 100 && sp[1] >=100) {																			
										newstr = vistas.replace(sp[1],sp[1].substr(-20,1)+ "M+");										
									}else{
										newstr = vistas.replace(sp[1].substr(1), "M+");
									}
								}															
						}else{
							if (sp[2].charAt(0) !=0) {
																newstr = vistas.replace("."+sp[1]+"."+sp[2], "M+");
							}else{
															newstr = vistas.replace("."+sp[1]+".", "M");
							}
						}						
					}
					break;
			default:
				newstr = text
				break;
		}
	
		return newstr;
},	
fans: (id, correo, posicion) => {
	let out =""
	if (posicion >40) {
		out += `<tr>
	<td><div class="gate-item__options">
<a class="gate-item__option" onclick="Askdelete('${id}','fans','borrar_fans')">
	<i class="fa fa-trash-alt"></i>
</a></div></td>
	<td>${posicion+1}</td>
	<td>${correo}</td>
	<td><input type="checkbox" value="${correo}" name="correo[]" class="form-check-input hasta" style="position: inherit; width: auto;"></td>
</tr>`
	}else{
	out += `<tr>
	<td><div class="gate-item__options">
<a class="gate-item__option" onclick="Askdelete('${id}','fans','borrar_fans')">
	<i class="fa fa-trash-alt"></i>
</a></div></td>
<td>${posicion+1}</td>
	<td>${correo}</td>
	<td><input type="checkbox" value="${correo}" name="correo[]" class="form-check-input desde" style="position: inherit; width: auto;"></td>
</tr>`	
		}
	 return out;
	},
	Topdash: (id_top, id_gate, posicion) => {
		posicion = parseInt(posicion)+1
		let color =""
		if (posicion == "1") {
			color="style='color: goldenrod'"
		}
		if (posicion == "2") {
			color="style='color: silver;'"
		}
		if (posicion == "3") {
			color="style='color: brown'"
		}
		var out =""
		if (id_top == id_gate) {
			 out = `<a class="gate-item__option" ><i class="fas fa-star" ${color}></i>
	 </a>`
		}
		 return out;
		},
	
}
