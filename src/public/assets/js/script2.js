$( document ).ready(function() {
   $('.btncuponMembership').on('click', (e) => {

let id_c = e.target.id 
let cupon = $(`#cuponMembership${id_c}`)[0]['elements']['cupon']['value']
console.log(cupon)
if (cupon == "") {
  return swal.fire('No ha colocado ningún cupon, por favor verificar')
}
if ($(`#cupon_aplicado${id_c}`).text() == cupon) {
  return swal.fire('Acabas de aplicar ese cupón, debes usar uno diferente')
}
console.log(cupon)
      $.ajax({
        url: '/membershipCupon',
        type: 'POST',
        data: $(`#cuponMembership${id_c}`).serialize(),
        cache: false,
       // contentType: false,
        // processData: false,
        /*xhr: function () {        
            var xhr = $.ajaxSettings.xhr();
            xhr.upload.onprogress = function (event) {
                var perc = Math.round((event.loaded / event.total) * 100);
               // $("#nombreArchivoCalendario1").text(inputFile.name);
               
                $("#progressBar1").text(perc + '%');
                $("#progressBar1").css('width', perc + '%');
            };
            return xhr;
        },
        beforeSend: function (xhr) {
          displayLoading()
            $("#progressBar1").text('0%');
            $("#progressBar1").css('width', '0%');
        },*/
        success: function (data, textStatus, jqXHR) {
          console.log(data)
          if (!data.status) {
            return swal.fire(data.mensaje)
          }
          $('#vip-press').text(data.monto_anual_vip)
           $('#anual_vip').text(data.monto_anual_vip)
            $('#mensual_vip').text(data.monto_mensual_vip)
            $('#monto_planVIP').val(data.monto_anual_vip)

            $('#gold-press').text(data.monto_anual_gold)
            $('#anual_gold').text(data.monto_anual_gold)
             $('#mensual_gold').text(data.monto_mensual_gold)
             $('#monto_planGold').val(data.monto_anual_gold)
             swal.fire(data.mensaje)
          $(`#cupon_aplicado${id_c}`).text(cupon)
        },
        error: function (jqXHR, textStatus) {
          console.log('error:' + jqXHR)
        }
      });
    })
  
  }); 

var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

function showTab(n) {
  // This function will display the specified tab of the form ...
  var x = document.getElementsByClassName("tab");
  //x[n].style.display="block"
  x[n].classList.add('show-tab');
  x[n].addEventListener("animationend", function () {
    x[n].style.display = "block";
  });
  // ... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "none";
  }
  if (n == (x.length - 1)) {
    document.getElementById("nextBtn").innerHTML = "";
    document.getElementById("nextBtn").setAttribute('disabled', 'disabled');
  } else {
    document.getElementById("nextBtn").innerHTML = "<i class='fa fa-angle-right' style='display:none'></i>";
    document.getElementById("nextBtn").removeAttribute("disabled");
    console.log("ultimo paso descargar")
     document.getElementById("nextBtn").setAttribute("value", "Descargar");
  }
  // ... and run a function that displays the correct step indicator:
  fixStepIndicator(n)
}
function nextPrev(n) {
  // This function will figure out which tab to display
  var x = document.getElementsByClassName("tab");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form... :
  if (currentTab >= x.length) {
    //...the form gets submitted:
    document.getElementById("regForm").submit();
    return false;
  }
  // Otherwise, display the correct tab:
  showTab(currentTab);
}

function validateForm() {
  // This function deals with validation of the form fields
  var x, y, i, valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByTagName("input");
  // A loop that checks every input field in the current tab:
  // for (i = 0; i < y.length; i++) {
  // If a field is empty...
  // if (y[i].value == "") {
  // add an "invalid" class to the field:
  //  y[i].className += " invalid";
  // and set the current valid status to false:
  //  valid = false;
  // }
  // }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class to the current step:
  x[n].className += " active";
}



//Funcion para pausar o darle play 
function togglePlay() {
  if (player.paused) {
    toggleIcon();
    return player.play();
  } else {

    toggleIcon();
    return player.pause();
  }
}
//Funcion para cambiar el icono play o pause
function toggleIcon() {
  var element = document.getElementById("iconPlay")
  var item_val = element.classList.item(1);
  //console.log(item_val);
  if (item_val === "fa-pause") {
    element.classList.remove("fa-pause");
    element.classList.add("fa-play");

  } else {
    element.classList.remove("fa-play");
    element.classList.add("fa-pause");
    //console.log(item_val);
  }
}


//Funcion para convertir segundos a minutos y horas
function secondsToString(seconds) {
  var hour = "";
  if (seconds > 3600) {
    hour = Math.floor(seconds / 3600);
    hour = (hour < 10) ? '0' + hour : hour;
    hour += ":"
  }
  var minute = Math.floor((seconds / 60) % 60);
  minute = (minute < 10) ? '0' + minute : minute;
  var second = seconds % 60;
  second = (second < 10) ? '0' + second : second;
  return hour + minute + ':' + second;
}

function updateProgress() {
  if (player.currentTime > 0) {
    const barra = document.getElementById('progress_')
    barra.value = (player.currentTime / player.duration) * 100

    var duracionSegundos = player.duration.toFixed(0);
    dura = secondsToString(duracionSegundos);
    var actualSegundos = player.currentTime.toFixed(0)
    actual = secondsToString(actualSegundos);

    duracion = actual + ' / ' + dura
    //	document.getElementById('timer').innerText=duracion 
  }
  if (player.ended) {
    toggleIcon();
    return player.pause();
  }
}

//Funcion para que al dar click sobre la barra de progeso se permita adelantar
var progress = document.getElementById('progress_')
progress.addEventListener('click', adelantar);
function adelantar(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * player.duration;
  player.currentTime = scrubTime;
  //console.log(e);
}




//Funcion para pausar o darle play 
function togglePlay2(idplayer,num) {
  var musicplay =  document.getElementById(idplayer)
  if (musicplay.paused) {
    toggleIcon2(num);
    //Funcion para que al dar click sobre la barra de progeso se permita adelantar
var progress = document.getElementById('progress_'+num)
progress.addEventListener('click', (e) =>{
  const scrubTime = (e.offsetX / progress.offsetWidth) * musicplay.duration;
  musicplay.currentTime = scrubTime;
});
    return musicplay.play();
  } else {

    toggleIcon2(num);
    //Funcion para que al dar click sobre la barra de progeso se permita adelantar
var progress = document.getElementById('progress_'+num)
progress.addEventListener('click', (e) =>{
  const scrubTime = (e.offsetX / progress.offsetWidth) * musicplay.duration;
  musicplay.currentTime = scrubTime;
});
    return musicplay.pause();
  }
  
}
//Funcion para cambiar el icono play o pause
function toggleIcon2(num) {
  var element = document.getElementById("iconPlay"+num)
  var pauses= document.getElementById("iconPause"+num)
  var item_val = element.classList.item(1);
  console.log(item_val);
  if (item_val === "fa-pause") {
    element.classList.remove("fa-pause");
    element.classList.add("fa-play");
    element.removeAttribute('style');
    pauses.setAttribute('style','display:none');
  } else {
    element.classList.remove("fa-play");
    element.setAttribute('style', 'display:none');
    pauses.removeAttribute('style');
    element.classList.add("fa-pause");
    //console.log(item_val);
  }
}


//Funcion para convertir segundos a minutos y horas
function updateProgress2(num) {
  var musicplay =  document.getElementById('player'+num)
  if (musicplay.currentTime > 0) {
    const barra = document.getElementById('progress_'+num)
    barra.value = (musicplay.currentTime / musicplay.duration) * 100

    var duracionSegundos = musicplay.duration.toFixed(0);
    dura = secondsToString(duracionSegundos);
    var actualSegundos = musicplay.currentTime.toFixed(0)
    actual = secondsToString(actualSegundos);

    duracion = actual + ' / ' + dura
    //	document.getElementById('timer').innerText=duracion 
  }
  if (musicplay.ended) {
    toggleIcon();
    return musicplay.pause();
  }
}


function adelantar2(e) {
  
  console.log(e)
  const scrubTime = (e.offsetX / progress.offsetWidth) * player.duration;
  player.currentTime = scrubTime;
  //console.log(e);
}

function nohaymusica(){
  Swal.fire('Disculpe no hay demo disponible para Bondgate');
}
function validar(e){
  const btna = document.getElementById('btn_step_redes');
  console.log(e.name)
  console.log(e.value)
      link_ = e.value.split('/')
console.log(link_)
switch (e.name) {
case 'url_facebook':
  if(link_[0] == "https:" && link_[2] == "www.facebook.com" && link_[3] != "" || link_[0] == "https:" && link_[2] == "www.facebook.es" && link_[3] != "" || link_[0] == "https:" && link_[2] == "m.facebook.com" && link_[3] != "" || link_[0] == "https:" && link_[2] == "facebook.com" && link_[3] != "" ){
  console.log("correcto")
  btna.removeAttribute('disabled');
}else {
  console.log("malo")
  Swal.fire({
            icon: "warning",
            title: "URL ERRADO",
            text: "El link no corresponde a la red social seleccionada, por favor  verifique el nombre de usuario. (Ej. https://www.facebook.com/minombre)",
            button: false,
          });
  btna.setAttribute('disabled', true);
}
  break;

case 'url_instagram':
  if(link_[0] == "https:" && link_[2] == "www.instagram.es" && link_[3] != "" || link_[0] == "https:" && link_[2] == "www.instagram.com" && link_[3] != "" || link_[0] == "https:" && link_[2] == "instagram.com" && link_[3] != "" ){
  console.log("correcto")
  btna.removeAttribute('disabled');
}else {
  console.log("malo")
    Swal.fire({
            icon: "warning",
            title: "URL ERRADO",
            text: "El link no corresponde a la red social seleccionada, por favor  verifique el nombre de usuario. (Ej. https://www.instagram.com/minombre)",
            button: false,
          });
  btna.setAttribute('disabled', true);
}
  break;

  case 'url_youtube':
  if(link_[0] == "https:" && link_[2] == "www.youtube.com" && link_[3] != "" || link_[0] == "https:" && link_[2] == "www.youtube.es" && link_[3] != "" || link_[0] == "https:" && link_[2] == "m.youtube.com" && link_[3] != "" || link_[0] == "https:" && link_[2] == "youtube.com" && link_[3] != "" ){
  console.log("correcto")
  btna.removeAttribute('disabled');
}else {
  console.log("malo")
    Swal.fire({
            icon: "warning",
            title: "URL ERRADO",
            text: "El link no corresponde a la red social seleccionada, por favor  verifique el nombre de usuario. (Ej. https://www.youtube.com/minombre)",
            button: false,
          });
  btna.setAttribute('disabled', true);
}
  break;

  case 'url_twitter':
  if(link_[0] == "https:" && link_[2] == "www.twitter.com" && link_[3] != "" || link_[0] == "https:" && link_[2] == "www.twitter.es" && link_[3] != "" || link_[0] == "https:" && link_[2] == "mobile.twitter.com" && link_[3] != "" || link_[0] == "https:" && link_[2] == "twitter.com" && link_[3] != "" ){
  console.log("correcto")
    Swal.fire({
            icon: "warning",
            title: "URL ERRADO",
            text: "El link no corresponde a la red social seleccionada, por favor  verifique el nombre de usuario. (Ej. https://www.twitter.com/minombre)",
            button: false,
          });
  btna.removeAttribute('disabled');
}else {
  console.log("malo")
  btna.setAttribute('disabled', true);
}
  break;

  case 'url_souncloud':
  if(link_[0] == "https:" && link_[2] == "www.soundcloud.com" && link_[3] != "" || link_[0] == "https:" && link_[2] == "soundcloud.es" && link_[3] != "" || link_[0] == "https:" && link_[2] == "m.soundcloud.com" && link_[3] != "" || link_[0] == "https:" && link_[2] == "soundcloud.com" && link_[3] != "" ){
  console.log("correcto")
  btna.removeAttribute('disabled');
}else {
  console.log("malo")
    Swal.fire({
            icon: "warning",
            title: "URL ERRADO",
            text: "El link no corresponde a la red social seleccionada, por favor  verifique el nombre de usuario. (Ej. https://www.soundcloud.com/minombre)",
            button: false,
          });
  btna.setAttribute('disabled', true);
}
  break;

  case 'url_spotify':
  if(link_[0] == "https:" && link_[2] == "www.spotify.com" && link_[3] != "" || link_[0] == "https:" && link_[2] == "www.spotify.es" && link_[3] != "" || link_[0] == "https:" && link_[2] == "m.spotify.com" && link_[3] != "" || link_[0] == "https:" && link_[2] == "spotify.com" && link_[3] != "" ){
  console.log("correcto")
  btna.removeAttribute('disabled');
}else {
  console.log("malo")
    Swal.fire({
            icon: "warning",
            title: "URL ERRADO",
            text: "El link no corresponde a la red social seleccionada, por favor  verifique el nombre de usuario. (Ej. https://www.spotify.com/minombre)",
            button: false,
          });
  btna.setAttribute('disabled', true);
}
  break;

  case 'url_deezer':
  if(link_[0] == "https:" && link_[2] == "www.deezer.com" && link_[3] != "" || link_[0] == "https:" && link_[2] == "www.deezer.es" && link_[3] != "" || link_[0] == "https:" && link_[2] == "m.deezer.com" && link_[3] != "" || link_[0] == "https:" && link_[2] == "deezer.com" && link_[3] != "" ){
  console.log("correcto")
  btna.removeAttribute('disabled');
}else {
  console.log("malo")
    Swal.fire({
            icon: "warning",
            title: "URL ERRADO",
            text: "El link no corresponde a la red social seleccionada, por favor  verifique el nombre de usuario. (Ej. https://www.deezer.com/minombre)",
            button: false,
          });
  btna.setAttribute('disabled', true);
}
  break;

  case 'url_tiktok':
  if(link_[0] == "https:" && link_[2] == "www.tiktok.com" && link_[3] != "" || link_[0] == "https:" && link_[2] == "www.tiktok.es" && link_[3] != "" || link_[0] == "https:" && link_[2] == "m.tiktok.com" && link_[3] != "" || link_[0] == "https:" && link_[2] == "tiktok.com" && link_[3] != "" ){
  console.log("correcto")
  btna.removeAttribute('disabled');
}else {
  console.log("malo")
    Swal.fire({
            icon: "warning",
            title: "URL ERRADO",
            text: "El link no corresponde a la red social seleccionada, por favor  verifique el nombre de usuario. (Ej. https://www.tiktok.com/minombre)",
            button: false,
          });
  btna.setAttribute('disabled', true);
}
  break;

  case 'url_mixcloud':
  if(link_[0] == "https:" && link_[2] == "www.mixcloud.com" && link_[3] != "" || link_[0] == "https:" && link_[2] == "www.mixcloud.es" && link_[3] != "" || link_[0] == "https:" && link_[2] == "m.mixcloud.com" && link_[3] != "" || link_[0] == "https:" && link_[2] == "mixcloud.com" && link_[3] != "" ){
  console.log("correcto")
  btna.removeAttribute('disabled');
}else {
  console.log("malo")
    Swal.fire({
            icon: "warning",
            title: "URL ERRADO",
            text: "El link no corresponde a la red social seleccionada, por favor  verifique el nombre de usuario. (Ej. https://www.mixcloud.com/minombre)",
            button: false,
          });
  btna.setAttribute('disabled', true);
}
  break;

  case 'url_twitch':
  if(link_[0] == "https:" && link_[2] == "www.twitch.tv" && link_[3] != "" || link_[0] == "https:" && link_[2] == "www.twitch.es" && link_[3] != "" || link_[0] == "https:" && link_[2] == "m.twitch.com" && link_[3] != "" || link_[0] == "https:" && link_[2] == "twitch.tv" && link_[3] != "" ){
  console.log("correcto")
  btna.removeAttribute('disabled');
}else {
  console.log("malo")
    Swal.fire({
            icon: "warning",
            title: "URL ERRADO",
            text: "El link no corresponde a la red social seleccionada, por favor  verifique el nombre de usuario. (Ej. https://www.twitch.tv/minombre)",
            button: false,
          });
  btna.setAttribute('disabled', true);
}
  break;

  case 'url_applemusic':
  if(link_[0] == "https:" && link_[2] == "www.apple.com" && link_[3] != "" || link_[0] == "https:" && link_[2] == "www.apple.es" && link_[3] != "" || link_[0] == "https:" && link_[2] == "music.apple.com" && link_[3] != "" || link_[0] == "https:" && link_[2] == "apple.com" && link_[3] != "" ){
  console.log("correcto")
  btna.removeAttribute('disabled');
}else {
  console.log("malo")
    Swal.fire({
            icon: "warning",
            title: "URL ERRADO",
            text: "El link no corresponde a la red social seleccionada, por favor  verifique el nombre de usuario. (Ej. https://www.apple.com/apple-music/)",
            button: false,
          });
  btna.setAttribute('disabled', true);
}
  break;

default:
  break;
}

}
// redes verificar
(() => {
  

})();
