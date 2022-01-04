// Alertas
(() => {
  const alertsInputs = document.querySelectorAll("[data-swal-title]");

  if (alertsInputs.length > 0) {
    alertsInputs.forEach((input) => {
      input.addEventListener("click", (e) => {
        e.preventDefault();
        Swal.fire({
          icon: "warning",
          title: input.dataset.swalTitle,
          text: "Te invitamos a mejorar tu membresía",
          button: false,
        });
      });
    });
  }
})();


// select plan
(() => {
  const selectPlan = document.getElementById("select-plan");
  if (selectPlan) {
    const options = selectPlan.querySelectorAll(".select-plan__option");
    const vipPress = document.getElementById("vip-press");
    const goldPress = document.getElementById("gold-press");
    const vipTime = document.getElementById("vip-time");
    const goldTime = document.getElementById("gold-time");

    const vipmensualCost = document.getElementById("mensual_vip");
    const goldmensualCost = document.getElementById("mensual_gold");
    const vipanualCost = document.getElementById("anual_vip");
    const goldanualCost = document.getElementById("anual_gold");

    const monto_planVIP = document.getElementById("monto_planVIP");
    const tipo_planVIP = document.getElementById("tipo_planVIP");
    const modo_planVIP = document.getElementById("modo_planVIP");

    const monto_planGold = document.getElementById("monto_planGold");
    const tipo_planGold = document.getElementById("tipo_planGold");
    const modo_planGold = document.getElementById("modo_planGold");

    var detalle_vip = document.getElementById("vip-detalle");
    var detalle_vip_anual = document.getElementById("vip-detalle_anual");
    var detalle_gold = document.getElementById("gold-detalle");
    var detalle_gold_anual = document.getElementById("gold-detalle_anual");

    selectPlan.addEventListener("click", changePlan);

    function changePlan(e) {
      if (e.target.classList.contains("select-plan__option")) {
        options.forEach((option) => {
          if (option.classList.contains("active")) {
            option.classList.remove("active");
          }
        });
        e.target.classList.add("active");
        if (vipPress && goldPress) {
          if (e.target.dataset.plan === "anual") {
            vipPress.textContent = vipanualCost.innerHTML;
            goldPress.textContent = goldanualCost.innerHTML;
            if (tipo_planGold.value === "Gold") {
              monto_planGold.value = goldanualCost.innerHTML;
              modo_planGold.value = "Anual";
            }
            if (tipo_planVIP.value === "VIP") {
              monto_planVIP.value = vipanualCost.innerHTML;
              modo_planVIP.value = "Anual";
            }

            if (document.body.classList.contains("dashboard-body")) {
              goldTime.innerHTML =
                '/ Año <span style="font-size: .7em;">'+detalle_gold_anual.innerHTML+'</span>';
              vipTime.innerHTML =
                '/ Año <span style="font-size: .7em;">'+detalle_vip_anual.innerHTML+'</span>';
            } else {
              goldTime.innerHTML = "/ Año "+detalle_gold_anual.innerHTML;
              vipTime.innerHTML = "/ Año " +detalle_vip_anual.innerHTML;
            }
          } else {
            vipPress.textContent = vipmensualCost.innerHTML;
            goldPress.textContent = goldmensualCost.innerHTML;
            if (tipo_planGold.value === "Gold") {
              monto_planGold.value = goldmensualCost.innerHTML;
              modo_planGold.value = "Mensual";
            }
            if (tipo_planVIP.value === "VIP") {
              monto_planVIP.value = vipmensualCost.innerHTML;
              modo_planVIP.value = "Mensual";
            }
            if (document.body.classList.contains("dashboard-body")) {
              goldTime.innerHTML = "/ Mes <span style='font-size: .7em;'>"+detalle_gold.innerHTML+'</span>';
              vipTime.innerHTML = "/ Mes <span style='font-size: .7em;'>"+detalle_vip.innerHTML+'</span>';
            } 
            
            
            if (document.body.classList.contains("page-body")){
              console.log("entro aqui")
              goldTime.innerHTML = "/ Mes " +detalle_gold.innerHTML;
              vipTime.innerHTML = "/ Mes " +detalle_vip.innerHTML;
            }
          }
        }
      }
    }
  }
})();


// Steps
(() => {
  const steps = document.querySelector(".steps");

  if (steps) {
    const stepsItems = steps.querySelectorAll(".step");

    // Añadir left al cargar la página
    setLeftToSteps();

    // Recalcular left si el usuario hace resize a la ventana
    window.addEventListener("resize", setLeftToSteps);

    function setLeftToSteps() {
      if (matchMedia("screen and (min-width: 0px)").matches) {
        stepsItems.forEach((item) => {
          const left = item.querySelector(".step__number").offsetLeft;
          item.querySelector(".step__body").style.left = `${left}px`;
        });
      } else {
        stepsItems.forEach((item) => {
          item.querySelector(".step__body").style.left = 0;
        });
      }
    }
  }
})();

// Toggle header
(() => {
  const notifications = document.getElementById("notifications");
  const accountOptions = document.getElementById("account-options");
  const listNotifications = document.getElementById("list-notifications");
  const listAccountOptions = document.getElementById("list-account-options");
  const headerToggleElements = document.getElementById(
    "header-toggle-elements"
  );

  if (headerToggleElements) {
    document.addEventListener("click", (e) => {
      if (
        e.target !== headerToggleElements &&
        e.target !== listNotifications &&
        e.target !== listAccountOptions &&
        e.target !== notifications &&
        e.target !== notifications.querySelector("i") &&
        e.target !== accountOptions &&
        e.target !== accountOptions.querySelector("i") &&
        !e.target.classList.contains("list-notifications__item") &&
        !e.target.classList.contains("list-account-options__title") &&
        !e.target.classList.contains("op") // Solución rapida hahaha :D
      ) {
        headerToggleElements.classList.remove("show");
      }
    });

    notifications.addEventListener("click", activeHeaderElements);
    accountOptions.addEventListener("click", activeHeaderElements);

    headerToggleElements.addEventListener("transitionend", (e) => {
      if (!headerToggleElements.classList.contains("show")) {
        listAccountOptions.classList.remove("active");
        listNotifications.classList.remove("active");
      }
    });

    function activeHeaderElements(e) {
      e.preventDefault();

      let target = e.target;

      headerToggleElements.classList.add("show");

      if (target.classList.contains("account-options")) {
        // Aliminar la el otro si esta activo
        if (listNotifications.classList.contains("active")) {
          listNotifications.classList.remove("active");
        }

        if (listAccountOptions.classList.contains("active")) {
          headerToggleElements.classList.remove("show");
        } else {
          listAccountOptions.classList.add("active");
        }
      } else {
        // Aliminar la el otro si esta activo
        if (listAccountOptions.classList.contains("active")) {
          listAccountOptions.classList.remove("active");
        }

        if (listNotifications.classList.contains("active")) {
          headerToggleElements.classList.remove("show");
        } else {
          listNotifications.classList.add("active");
        }
      }
    }
  }
})();

// Modificar nav de Bootstrap
(() => {
  const mainNavbar = document.querySelector(".main-navbar");
  const navbarCollapse = document.querySelector(".navbar-collapse");
  const toggle = document.querySelector(".navbar-toggler");

  if (toggle && navbarCollapse && mainNavbar) {
    // Eliminar elemento activo despues de la transicion
    toggle.addEventListener("click", () => {
      if (!navbarCollapse.classList.contains("show")) {
        mainNavbar.classList.add("nav-show");
      } else {
        mainNavbar.classList.remove("nav-show");
      }
    });

    /* Al hacer Scroll */
    window.addEventListener("scroll", (e) => {
      if (window.scrollY > 200) {
        mainNavbar.style.padding = ".5rem 1rem";
      } else {
        mainNavbar.style.padding = "";
      }
    });
  }
})();

/* Eliminar form message */
(() => {
  const formMessageContainer = document.querySelector(
    ".form-message-container"
  );
  const formMessageError = document.querySelector(".form-message-error");

  if (formMessageContainer) {
    setTimeout(() => {
      formMessageContainer.remove();
    }, 5000);
  } else if (formMessageError) {
    setTimeout(() => {
      formMessageError.remove();
    }, 5000);
  }
})();

/* Section Steps */
(() => {
  // Variables - Esta variable es para la condicion de abajo
  const formSteps = document.querySelector(".form-steps");

  if (formSteps) {
    // Variables
    const formStepsContainer = document.querySelectorAll(
      ".form-control-steps__container"
    );
    const stepsNav = document.querySelector(".steps-nav");
    const stepNavItems = stepsNav.querySelectorAll(".steps-nav__items");
    const beforePage = document.querySelector(".before-page");
    const stepNavDesc = stepsNav.querySelector(".steps-nav__desc");
    const createGateBtn = document.getElementById("create-gate-btn");

    // Llamadas a funciones y eventos de usuarios
    prepare();
    setPaddingToInputs();
    configNavDesc();
    formSteps.addEventListener("submit", (e) => {
      e.preventDefault();
    });
    formSteps.addEventListener("click", (e)=>  
    {
      if (e.target.classList.contains("form-steps__btn--support")) {
        const itemsActive = Array.from(
          document.querySelectorAll(".support-nav__item.active")
        );
  console.log(itemsActive.length)
        if (itemsActive.length == 0) {
            Swal.fire({
              title: '¿Seguro desea continuar?',
              text: "No ha colocado ninguna red social!",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Continuar!'
            }).then((result) => {
              if (result.isConfirmed) {
                changeStep(e)
              }
            })              
        }else{
          changeStep(e)
          }
      }else{
        changeStep(e)
        }
    });
    beforePage.addEventListener("click", beforeStep);
    createGateBtn.addEventListener("click", () => {
      formSteps.submit();
    });

    function prepare() {
      const navNumbers = document.querySelectorAll(".steps-nav__number");
      const sections = formSteps.querySelectorAll(".section-step");

      if (sections.length > 0) {
        sections.forEach((section, i) => {
          ++i;
          section.setAttribute("data-step-page", i);
          section.querySelector(".form-steps__btn").dataset.stepPage = i;
        });
      }

      if (navNumbers.length > 0) {
        navNumbers.forEach((item, i) => {
          ++i;
          item.dataset.stepTarget = i;
          item.textContent = i;
        });
      }
    }

    // Funciones
    function changeStep(e) {
      if (e.target.classList.contains("form-steps__btn")) {
        // Current
        let currentStep = e.target.dataset.stepPage;
        let currentStepSection = e.target.parentElement;
        let currentNavItem = stepsNav.querySelector(
          `[data-step-target="${e.target.dataset.stepPage}"]`
        );

        // Next
        let nextStep = ++currentStep;
        let nextStepSection = formSteps.querySelector(
          `[data-step-page="${nextStep}"]`
        );
        let nextNavItem = stepsNav.querySelector(
          `[data-step-target="${nextStep}"]`
        );

        if (e.target.classList.contains("form-steps__btn--support")) {
          
          if (!validateSupport(e.target)) {
            return;
          }
        }

        // Si existe la siguiente sección
        if (nextStepSection) {
          // Eliminar el paso anterior
          currentStepSection.classList.remove("show");
          currentNavItem.classList.remove("active");

          // Solución para rastro
          currentNavItem.classList.add("check");
          currentNavItem.parentElement.classList.add("color-bar");
          currentNavItem.innerHTML = '<i class="fa fa-check"></i>';

          // Mostrar paso siguiente
          nextStepSection.classList.add("show");
          nextNavItem.classList.add("active");

          // Modificaciones de las páginas
          setPaddingToInputs();
          configNavDesc();
        }
      }
    }

    // Validar los pasos para apoyar
    function validateSupport(button) {
      const itemsActive = Array.from(
        document.querySelectorAll(".support-nav__item.active")
      );
      const sectionsActive = itemsActive.map((item) =>
        document.querySelector(item.getAttribute("href"))
      );
      

      const arrResultG = sectionsActive.map((section) => {
        if (section) {
          if (
            section.querySelector('[type="checkbox"]:not(.optional):checked')
          ) {
            const inputs = section.querySelectorAll(
              'input:not([type="checkbox"])'
            );
            if (inputs.length > 0) {
              const arrayResult = [];
              inputs.forEach((input) => {
                if (input.value !== "" && input.validity.valid) {
                  arrayResult.push(true);
                } else {
                  arrayResult.push(false);
                }
              });
              if (arrayResult.includes(false)) {
                Swal.fire({
                  icon: "warning",
                  text: "Llena los campos correctamente para continuar",
                  button: false,
                });
              }
              return arrayResult.includes(false) ? false : true;
            }
            return true;
          }
          Swal.fire({
            icon: "warning",
            text: "Configurar primero para poder continuar",
            button: false,
          });
          return false;
        }
      });

      return arrResultG.includes(false) ? false : true;
    }

    // Ir al paso anterior :D
    function beforeStep(e) {
      // Obtener la vista actual
      let currentStep = getCurrentStep();
      if (currentStep !== 1) {
        e.preventDefault();
      }
      let currentStepSection = formSteps.querySelector(
        `section[data-step-page="${currentStep}"]`
      );
      let currentNavItem = stepsNav.querySelector(
        `[data-step-target="${currentStep}"]`
      );

      // Solución para rastro
      currentNavItem.classList.remove("check");
      if (
        currentStep ==
        document.querySelector('[data-step-desc="Confirma"]').dataset.stepPage
      ) {
        currentNavItem.parentElement.classList.remove("color-bar");
      } else {
        currentNavItem.parentElement.previousElementSibling.classList.remove(
          "color-bar"
        );
      }
      currentNavItem.innerHTML = currentNavItem.dataset.stepTarget;

      // Prev
      let prevStep = --currentStep;
      let prevStepSection = formSteps.querySelector(
        `[data-step-page="${prevStep}"]`
      );
      let prevNavItem = stepsNav.querySelector(
        `[data-step-target="${prevStep}"]`
      );

      // Eliminar el paso actual
      currentStepSection.classList.remove("show");
      currentNavItem.classList.remove("active");

      // Mostrar paso anterior
      prevStepSection.classList.add("show");
      prevNavItem.classList.add("active");
      prevNavItem.innerHTML = prevNavItem.dataset.stepTarget;

      // Modificaciones de las páginas
      setPaddingToInputs();
      configNavDesc();
    }

    function getCurrentStep() {
      return Number(formSteps.querySelector(".show").dataset.stepPage);
    }

    function setPaddingToInputs() {
      if (formStepsContainer.length > 0) {
        formStepsContainer.forEach((container) => {
          const placeholder = container.querySelector(
            ".form-control-steps__placeholder"
          );
          if (placeholder) {
            const padding = placeholder.getBoundingClientRect().width;

            container.querySelector(
              ".form-control-steps"
            ).style.paddingLeft = `calc(2em + ${padding}px)`;
          }
        });
      }
    }

    function configNavDesc() {
      const currentStep = getCurrentStep();
      const currentNavItem = stepsNav.querySelector(
        `[data-step-target="${currentStep}"]`
      );
      const currentStepSection = formSteps.querySelector(
        `section[data-step-page="${currentStep}"]`
      );
      const desc = currentStepSection.dataset.stepDesc;

      const left = currentNavItem.offsetLeft;
      let html = `
				<p>Paso ${currentStep}</p>
				<p>${desc}</p>
			`;

      stepNavDesc.style.left = `${left}px`;
      stepNavDesc.innerHTML = html;
    }
  }
})();

/* Adaptar alto de secciones */
(() => {
  const calculateHeightEl = document.querySelector(".calculate-height");
  const dashboardTitle = document.querySelector(".dashboard-title");

  if (calculateHeightEl && dashboardTitle) {
    calculateHeight();
    window.addEventListener("resize", calculateHeight);
  }

  function calculateHeight() {
    const height = dashboardTitle.getBoundingClientRect().height;
    const bottom = dashboardTitle.getBoundingClientRect().bottom;

    /* Tener en cuenta el CSS */
    if (matchMedia("screen and (min-width: 1200px)").matches) {
      calculateHeightEl.style.height = `calc(100% - (${height}px + 2rem))`;
    } else if (matchMedia("screen and (min-width: 567px)").matches) {
      calculateHeightEl.style.height = `calc(100% - (${height}px + 5rem))`;
    } else {
      calculateHeightEl.style.height = "";
    }
  }
})();

// Input type color
(() => {
  const inputWrapper = document.querySelector(".input-color-wrapper");

  if (inputWrapper) {
    const input = inputWrapper.querySelector("input");
    input.addEventListener("input", () => {
      inputWrapper.style.background = input.value;
      let pintar = document.getElementById('color_bg');
      pintar.style.background = input.value;
    });
    document.getElementById('input-color_titulo').addEventListener("input", () => {
      let pintar = document.getElementById('color_title');
      let pintar2 = document.getElementById('gate-name-dj');
      let pintar3 = document.getElementById('gate-name-dj2');
      pintar.style.color = document.getElementById('input-color_titulo').value;
      pintar2.style.color = document.getElementById('input-color_titulo').value;
     pintar3.style.color = document.getElementById('input-color_titulo').value;
     $('.main-gate__footer .social-nav__link').attr('style','color:' +document.getElementById('input-color_titulo').value)
    }); 
    document.getElementById('input-color_descripcion').addEventListener("input", () => {
      let pintar = document.getElementById('color_descrip');
      pintar.style.color = document.getElementById('input-color_descripcion').value;
    });
  }
})();

// Seleccionar como quieres que apoyen el Gate
(() => {
  const supportNav = document.querySelector(".support-nav");
  const btnSupport = document.querySelector(
    '[data-step-desc="Pasos"] button[data-step-page]'
  );
  const supportSections = document.querySelector(".support-sections");

  if (supportNav) {
    supportNav.addEventListener("click", activeSupport);

    function activeSupport(e) {
      e.preventDefault();
      let target;

      // Ver si el padre o el hijo son .support-nav__item
      if (e.target.classList.contains("support-nav__item")) {
        target = e.target;
      } else if (
        e.target.parentElement.classList.contains("support-nav__item")
      ) {
        target = e.target.parentElement;
      }

      // Si existe el target
      if (target) {
        if (target.classList.contains("sb-disabled")) {
          
            return
        }
        if (target.classList.contains("active")) {
          removePrevShow();
          $('.form-steps__btn--support').removeAttr('disabled')
          document
            .querySelector(target.getAttribute("href"))
            .classList.add("s-show");
        } else {
          if (canNext()) {
            target.classList.add("active");
            $('.form-steps__btn--support').removeAttr('disabled')
            removePrevShow();
            document
              .querySelector(target.getAttribute("href"))
              .classList.add("s-show");
          }
        }
      } else if (e.target.classList.contains("deselect-icon")) {
        e.target.parentElement.parentElement.classList.remove("active");
       // $('.form-steps__btn--support').attr('disabled', true)
        const removeSection = document.querySelector(
          e.target.parentElement.parentElement.getAttribute("href")
        );

        removeSection.classList.remove("s-show");

        removeSection
          .querySelectorAll('[type="checkbox"]:checked')
          .forEach((checkbox) => {
            checkbox.checked = false;
          });

        removeSection
          .querySelectorAll('input:not([type="checkbox"])')
          .forEach((input) => {
            input.value = "";
          });
      }
    }
  }

  // Esta funcion retorna true si se puede seleccionar otro paso y false si no
  function canNext() {
    const sectionActive = document.querySelector(".s-show");

    if (sectionActive) {
      if (
        sectionActive.querySelector('[type="checkbox"]:not(.optional):checked')
      ) {
        const inputs = sectionActive.querySelectorAll(
          'input:not([type="checkbox"])'
        );
        if (inputs.length > 0) {
          const arrayResult = [];
          inputs.forEach((input) => {
            if (input.value !== "" && input.validity.valid) {
              arrayResult.push(true);
            } else {
              arrayResult.push(false);
            }
          });
          if (arrayResult.includes(false)) {
            Swal.fire({
              icon: "warning",
              text: "Llena los campos correctamente para continuar",
              button: false,
            });
          }
          
          if (sectionActive.classList.contains("basic")) {
            Swal.fire({
              icon: "warning",
              text: "Usted esta seleccionando más de una red social, Le invitamos a mejorar tu membresía.",
              button: false,
            });
            return false;
          }
          return arrayResult.includes(false) ? false : true;
        }
        return true;
      }
      Swal.fire({
        icon: "warning",
        text: "Configurar primero para poder continuar",
        button: false,
      });
      return false;
    }
    return true;
  }

  function removePrevShow() {
    document.querySelectorAll(".support-section").forEach((item) => {
      if (item.classList.contains("s-show")) {
        item.classList.remove("s-show");
      }
    });
  }
})();

class validateInput {
  constructor(inputs, button) {
    this.inputs = this.getInputs(inputs);
    this.button = button;
    this.handleInput = this.handleInput.bind(this);
    this.events();
  }
  events() {
    this.inputs.forEach((input) => {
      if (input) {
        input.addEventListener("input", this.handleInput);
      }
    });
  }
  getInputs(inputs) {
    return inputs.map((input) => document.querySelector(input));
  }
  handleInput(e) {
    const inp = e.target;
    const btn = this.button;

    // Añadir clase si el input contiene texto
    if (inp.value.length !== 0) {
      inp.classList.add("non-empty");
    } else {
      inp.classList.remove("non-empty");
    }

    // Opciones del Boton
    if (this.inputs.every((inp) => inp.validity.valid === true)) {
      btn.removeAttribute("disabled");
    } else {
      btn.setAttribute("disabled", "true");
    }
  }
}

// Validaciones de Steps - Activar botones
(() => {
  // input step 1
  new validateInput(
    ["#url-demo"],
    document.querySelector('[data-step-desc="Fuente"] button[data-step-page]')
  );
  new validateInput(
    ["#url-track"],
    document.querySelector('[data-step-desc="Subir"] button[data-step-page]')
  );
  // input step 4
  if (document.querySelector("#music-price")) {
    new validateInput(
      ["#artist-name", "#music-title", "#music-desc", "#music-price"],
      document.querySelector('[data-step-desc="Título"] button[data-step-page]')
    );
  } else {
    new validateInput(
      ["#artist-name", "#music-title", "#music-desc"],
      document.querySelector('[data-step-desc="Título"] button[data-step-page]')
    );
  }

  // otro genero
  const gender = document.getElementById("gender");
  const otherGender = document.getElementById("other-gender");

  if (gender && otherGender) {
    const btnGender =
      gender.parentElement.parentElement.parentElement.querySelector(
        "button[data-step-page]"
      );
    otherGender.addEventListener("input", () => {
      if (otherGender.validity.valid) {
        btnGender.removeAttribute("disabled");
      } else {
        btnGender.setAttribute("disabled", "true");
      }
    });

    gender.addEventListener("change", () => {
      const option = gender.options[gender.selectedIndex].value;

      if (option === "other") {
        otherGender.removeAttribute("disabled");
        otherGender.setAttribute("required", "true");
        btnGender.setAttribute("disabled", "true");
      } else if (option === "default") {
        otherGender.value = "";
        otherGender.setAttribute("disabled", "true");
        btnGender.setAttribute("disabled", "true");
      } else {
        otherGender.value = "";
        otherGender.setAttribute("disabled", "true");
        btnGender.removeAttribute("disabled");
      }
    });
  }

  // Validación url del gate
  const gateLink = document.getElementById("gate-link");
  const buttonGateLink = document.querySelector(
    '[data-step-desc="Privacidad"] button[data-step-page]'
  );
  const gateLinkOutput = document.getElementById("gate-link-output");

  if (gateLink) {
    gateLink.addEventListener("input", (e) => {
      if (
        gateLink.value !== "" &&
        gateLink.value.indexOf(" ") === -1 &&
        gateLink.value.indexOf("ñ") === -1 &&
        gateLink.value.indexOf("Ñ") === -1
      ) {
        gateLink.style.borderColor = "lime";
        buttonGateLink.removeAttribute("disabled");
        gateLinkOutput.querySelector("span").innerHTML =
          gateLink.value;
      } else {
        gateLinkOutput.querySelector("span").innerHTML = "";
        gateLink.style.borderColor = "red";
        buttonGateLink.setAttribute("disabled", true);
      }
    });
  }
})();

// Desing preview
(() => {
    // selecting loading div
const loader = document.querySelector("#loadingflyer");

// showing loading
function displayLoading() {
    loader.classList.add("display");
    // to stop loading after some time
   
}

// hiding loading 
function hideLoading() {
    loader.classList.remove("display");
}
  const subirarchivo_flyr = (event) => {
    const archivos = event;
    const data = new FormData();
    data.append("archivo", archivos);
    displayLoading()
    $("#loadingflyer").show()
    $("#info-drop").hide()
    
    $.ajax({
      url: '/create-file-gate/archivo',
      type: 'POST',
      data: data,
      cache: false,
      contentType: false,
      processData: false,
      xhr: function () {        
          var xhr = $.ajaxSettings.xhr();
          xhr.upload.onprogress = function (event) {
              var perc = Math.round((event.loaded / event.total) * 100);
             // $("#nombreArchivoCalendario1").text(inputFile.name);
             
              $("#progressBarflyer").text(perc + '%');
              $("#progressBarflyer").css('width', perc + '%');
          };
          return xhr;
      },
      beforeSend: function (xhr) {
        displayLoading()
          $("#progressBarflyer").text('0%');
          $("#progressBarflyer").css('width', '0%');
      },
      success: function (data, textStatus, jqXHR)
      {      
      //  $("#loadingflyer").hide()
          $("#progressBarflyer").addClass("progress-bar-success");
          $("#progressBarflyer").text('100% - Carga realizada'); 
         
          document.getElementById("resultado_imagen").innerHTML =
          "La imagen se ha subido correctamente.";
          $('#text_btn_flyer').text('Cambiar imagen')
        document.getElementById("img_flyer").value = archivos.name;
        
      const reader = new FileReader();
      reader.addEventListener("load", displayFileInfo);
      reader.readAsDataURL(archivos);
      },
      error: function (jqXHR, textStatus) { 
          $("#progressBarflyer").text('100% - Error al cargar el archivo');
          $("#progressBarflyer").removeClass("progress-bar-success");
          $("#progressBarflyer").addClass("progress-bar-danger");
      }
  });

  };

  // Upload gate flyer
  const uploadFlyer = document.getElementById("upload-flyer");
  const outputImg = document.querySelector(".desing-preview__content");
  const output = document.getElementById("output-upload-flyer");
  const dropUploadFlyer = document.getElementById("drop-upload-flyer");
  const btnStepDesing = document.querySelector(
    '[data-step-desc="Diseño"] button[data-step-page]'
  );
  const confirmationCardBannerImg = document.querySelector(
    ".confirmation-card__banner img"
  );

  if (uploadFlyer) {
    uploadFlyer.addEventListener("change", (event) => {
      const file = uploadFlyer.files[0];

      if (
        file.type !== "image/jpeg" &&
        file.type !== "image/png" &&
        file.type !== "image/jpg"
      ) {
        output.innerHTML = `<p class="mt-2 mb-0 text-danger">Solo se pueden subir archivos .png, .jpg, .jpeg. Intenta de nuevo</p>`;
        setTimeout(() => {
          output.innerHTML = "";
        }, 5000);
        btnStepDesing.setAttribute("disabled", true);
        return;
      }
      const reader = new FileReader();
      reader.addEventListener("load", chekFileInfo);
      reader.readAsDataURL(file);
      // subirarchivo_flyr(event);
      
    });

    

    function enterFile(e) {
      e.preventDefault();
      dropUploadFlyer.style.borderColor = "#D9AD26";
    }

    function overFile(e) {
      e.preventDefault();
    }

    function leaveFile(e) {
      e.preventDefault();
      dropUploadFlyer.style.borderColor = "";
    }

    function dropFile(e) {
      e.preventDefault();

      const data = e.dataTransfer;
      const file = data.files[0];

      dropUploadFlyer.style.borderColor = "";
      uploadingProccess(file);
    }

    function uploadingProccess(file) {
      // calcular mb
      const size = file.size / 1048576;

      if (
        file.type !== "image/jpeg" &&
        file.type !== "image/png" &&
        file.type !== "image/jpg"
      ) {
        output.innerHTML = `<p class="mt-2 mb-0 text-danger">Solo se puden subir archivos .png, .jpg, .jpeg. Intenta de nuevo</p>`;
        setTimeout(() => {
          output.innerHTML = "";
        }, 5000);
        btnStepDesing.setAttribute("disabled", true);
        return;
      }

      const reader = new FileReader();
      reader.addEventListener("load", chekFileInfo);
      reader.readAsDataURL(file);
    }
  }
  function chekFileInfo(e) {
    const img = document.createElement("img");
    img.setAttribute("src", e.target.result);

    img.addEventListener("load", () => {
      if (img.naturalWidth < 1000 || img.naturalHeight < 1000) {
        output.innerHTML = `<p class="mt-2 mb-0 text-danger tamano_img">El tamaño mínimo de tu imágen debe ser 1000px x 1000px</p>`;
        setTimeout(() => {
          output.innerHTML = "";
        }, 5000);
        btnStepDesing.setAttribute("disabled", true);
        return;
      }
      subirarchivo_flyr(uploadFlyer.files[0]);
      
    });
  }
  function displayFileInfo(e) {
    const img = document.createElement("img");
    img.setAttribute("src", e.target.result);
    img.addEventListener("load", () => {      
      confirmationCardBannerImg.setAttribute("src", e.target.result);
      $('#img_flyer2').attr('src', e.target.result)
      outputImg.style.backgroundImage = `url(${e.target.result})`;
      outputImg.style.backgroundSize = "cover";      
      //outputImg.querySelector(".before").style.display = "none";
      btnStepDesing.removeAttribute("disabled");
    });
  }

  // Change preview
  const desingPreview = document.querySelector(".desing-preview");
  const desingSocial = document.getElementById("desing-social");

  if (desingSocial) {
    desingSocial.addEventListener("change", toggleDesingSocial);

    function toggleDesingSocial() {
      const socialNav = desingPreview.querySelector(
        ".main-gate__footer > .row > *:first-child"
      );
      if (desingSocial.checked) {
        socialNav.classList.remove("d-none");
      } else {
        socialNav.classList.add("d-none");
      }
    }
  }

  const showWaterMarker = document.getElementById("show-watermarker");

  if (showWaterMarker) {
    showWaterMarker.addEventListener("change", toggleWaterMarker);

    function toggleWaterMarker() {
      const waterMarker = desingPreview.querySelector(".watermark");

      if (showWaterMarker.checked) {
        waterMarker.classList.add("d-none");
      } else {
        waterMarker.classList.remove("d-none");
      }
    }
  }

  // User logo
  const subirarchivo_logo = (event) => {
    const archivos = event.target.files;
    const data = new FormData();

    data.append("archivo", archivos[0]);

    fetch("/create-file-gate/archivo", {
      method: "POST",
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        // document.getElementById('resultado_imagen').innerHTML = 'La imagen se ha subido correctamente.';
        console.log("La imagen se ha subido correctamente.");
        document.getElementById("logo_flyer").value = archivos[0].name;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const userLogo = document.getElementById("user-logo");

  if (userLogo) {
    userLogo.addEventListener("change", (event) => {
      uploadUserLogo(event);
    });

    const output = document.getElementById("output-user-logo");

    userLogo.addEventListener("click", (e) => {
      const logo = outputImg.querySelector(".user-logo");

      if (logo) {
        userLogo.classList.remove("checked");
        e.preventDefault();
        logo.remove();
      }
    });

    function uploadUserLogo(event) {
      const file = userLogo.files[0];

      if (
        file.type !== "image/jpeg" &&
        file.type !== "image/png" &&
        file.type !== "image/jpg"
      ) {
        userLogo.classList.remove("checked");
        output.innerHTML = `<p class="mt-2 mb-0 text-danger">Solo se puden subir archivos .png, .jpg, .jpeg</p>`;
        setTimeout(() => {
          output.innerHTML = "";
        }, 5000);
        return;
      }

      userLogo.classList.add("checked");
      const reader = new FileReader();
      reader.addEventListener("load", changeWaterMarker);
      reader.readAsDataURL(file);
      subirarchivo_logo(event);
    }

    function changeWaterMarker(e) {
      if (desingPreview.querySelector(".user-logo")) {
        desingPreview.querySelector(".user-logo").remove();
      }

      //const logo = document.createElement('img');
      const logo = document.getElementById("logo-change");
      //logo.classList.add('user-logo');
      logo.setAttribute("src", e.target.result);

      //outputImg.appendChild(logo);
    }
  }
})();

// Select Music
(() => {
  // selecting loading div
const loader = document.querySelector("#loading");
//const loadertext = document.querySelector("#textloading");

// showing loading
function displayLoading() {
    loader.classList.add("display");
    //loadertext.classList.add("display");
    // to stop loading after some time
  
}

  const subirarchivo_zip = (event) => {
    const archivos = event.target.files;
    const data = new FormData();

    data.append("archivo", archivos[0]);
    $("#loading").show()
    $("#info-drop").hide()
    
    const dropArea1 = document.getElementById("upload-audio");
    const infoDrop1 = dropArea1.querySelector(".info-drop");
    $.ajax({
      url: '/create-file-gate/archivo',
      type: 'POST',
      data: data,
      cache: false,
      contentType: false,
      processData: false,
      xhr: function () {        
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
        $('.drop-content').attr('style','display:none')
          $("#progressBar1").text('0%');
          $("#progressBar1").css('width', '0%');
        
      },
      success: function (data, textStatus, jqXHR)
      {  
        $("#loading").hide()    
        $('.drop-content').removeAttr('style')
        
          $("#progressBar1").addClass("progress-bar-success");
          $("#progressBar1").text('100% - Carga realizada');
        
        infoDrop1.innerHTML = `<label for="music-file"><i class="fa fa-upload"></i>Cambiar Archivo</label><p>El archivo " + ${archivos[0].name} + " se ha subido correctamente.</p>`;
        //document.getElementById("resultado_zip").innerHTML = "El archivo " + archivos[0].name + " se ha subido correctamente.";
        document.getElementById("archivo1").value = archivos[0].name;
        const button = musicFile.parentElement.parentElement.querySelector("button[data-step-page]");
      button.removeAttribute("disabled");
      },
      error: function (jqXHR, textStatus) { 
          $("#progressBar1").text('100% - Error al cargar el archivo');
          $("#progressBar1").removeClass("progress-bar-success");
          $("#progressBar1").addClass("progress-bar-danger");
      }
  });
  };

  const musicFile = document.getElementById("music-file");

  if (musicFile) {
    const fileOutput = document.getElementById("file-output");
    const iconState = document.getElementById("drop-icon");
   // const button = musicFile.parentElement.parentElement.querySelector(  "button[data-step-page]" );

    // With Drag and Drop
    const dropArea = document.getElementById("upload-audio");
    const infoDrop = dropArea.querySelector(".info-drop");

    musicFile.addEventListener("change", (event) => {
      const file = musicFile.files[0];

      uploadingProccess(file, event);
    });

    dropArea.addEventListener("dragenter", enterFile);
    dropArea.addEventListener("dragover", overFile);
    dropArea.addEventListener("dragleave", leaveFile);
    dropArea.addEventListener("drop", dropFile);

    function enterFile(e) {
      e.preventDefault();
      dropArea.style.borderColor = "#D9AD26";
    }

    function overFile(e) {
      e.preventDefault();
    }

    function leaveFile(e) {
      e.preventDefault();
      dropArea.style.borderColor = "";
    }

    function dropFile(e) {
      e.preventDefault();

      const data = e.dataTransfer;
      const file = data.files[0];

      dropArea.style.borderColor = "";
      uploadingProccess(file);
    }

    function uploadingProccess(file, event) {
      // calcular mb
      const size = file.size / 1048576;
      const maxSizeFile = musicFile.dataset.maxSizeFile;

      if (maxSizeFile !== "unlimited") {
        if (size > Number(maxSizeFile)) {
          dropArea.classList.add("drop-error", "text-center");
          iconState.innerHTML = '<i class="fa fa-times"></i>';
          infoDrop.innerHTML = `No puedes subir archivos mayores a ${
            maxSizeFile === "10" ? "10mb" : "1gb"
          } actualiza tu membresía<br><label for="music-file">Sube otro archivo</label> o arratralo aquí`;
          return;
        }
      }

      if (musicFile.getAttribute("accept") === "audio/*, .zip, .rar" || musicFile.getAttribute("accept") === ".zip") {
        if (
            file.type !== 'application/x-zip-compressed'
        ) {
          console.log(file.type)
          dropArea.classList.add("drop-error", "text-center");
          iconState.innerHTML = '<i class="fa fa-times"></i>';
          infoDrop.innerHTML = `Solo se pueden subir archivos .zip<br><label for="music-file">Sube otro archivo</label> o arratralo aquí`;
          return;
        }
      } else {
      }
      subirarchivo_zip(event);
      dropArea.classList.remove("uploading", "drop-error");
      dropArea.classList.add("success", "text-center");
      iconState.innerHTML = '<i class="fa fa-check"></i>';
      // infoDrop.innerHTML = `<p>El archivo se subio correctamente<br><label for="music-file">Sube otro</label> o arrastralo aquí</p>`;
     // infoDrop.innerHTML = `<p></p>`;
    }
  }
})();

// Llenar previsualizacion de los steps del form
(() => {
  const artistName = document.getElementById("artist-name");
  const musicTitle = document.getElementById("music-title");
  const musicDesc = document.getElementById("music-desc");
  const urlDemo = document.getElementById("url-demo");
  const gender = document.getElementById("gender");
  const gateLink = document.getElementById("gate-link");

  const previewList = document.getElementById("confirmation-list");

  if (previewList) {
    artistName.addEventListener("input", setPreview);
    musicTitle.addEventListener("input", setPreview);
    musicDesc.addEventListener("input", setPreview);
    gateLink.addEventListener("input", setPreview);
    if (urlDemo) {
      urlDemo.addEventListener("input", setPreview);
    }
    //	gender.addEventListener('change', setPreview);
  }

  function setPreview() {
    let html = `
			<li>Artista: <span>${artistName.value}</span></li>
			<li>Título: <span>${musicTitle.value}</span></li>
			<li>Descripción: <span>${musicDesc.value}</span></li>
			${urlDemo ? `<li>Fuente: <span>${urlDemo.value}</span></li>` : ""}
			<li>Enlace: <span id="p1">https://www.backartist.com/track/${gateLink.value}</span><i class="fa fa-copy" onclick="copyToClipboard('#p1')"  style="margin-left: 5px; cursor: pointer;"></i></li>
		`;

    previewList.innerHTML = html;
  }
})();

// Padding to inputs
(() => {
  const formStepsContainer = document.querySelectorAll(
    ".form-control-steps__container"
  );

  if (formStepsContainer.length > 0) {
    formStepsContainer.forEach((container) => {
      const placeholder = container.querySelector(
        ".form-control-steps__placeholder"
      );
      if (placeholder) {
        const padding = placeholder.getBoundingClientRect().width;

        container.querySelector(
          ".form-control-steps"
        ).style.paddingLeft = `calc(2em + ${padding}px)`;
      }
    });
  }
})();

(() => {
  const gatesNavigation = document.getElementById("gates-navigation");

  if (gatesNavigation) {
    const gatesNavItems = gatesNavigation.querySelectorAll(".nav-link");
    gatesNavigation.addEventListener("click", changeGates);

    function changeGates(e) {
      if (e.target.classList.contains("nav-link")) {
        e.preventDefault();

        if (!e.target.classList.contains("sb-disabled")) {
          gatesNavItems.forEach((item) => {
            if (item.classList.contains("active")) {
              item.classList.remove("active");
            }
          });

          e.target.classList.add("active");
        }
      }
    }
  }
})();

// Subir foto de perfil
(() => {
  const subirImagen = (event) => {
    const archivos = event.target.files;
    const data = new FormData();
    const reader = new FileReader();
console.log(archivos)
    data.append("archivo", archivos[0]);
    $("#loadingP").show()
    $("#info-drop").hide()
    
    $.ajax({
      url: '/create-file-gate/archivo',
      type: 'POST',
      data: data,
      cache: false,
      contentType: false,
      processData: false,
      xhr: function () {        
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
        //displayLoading()
          $("#progressBar1").text('0%');
          $("#progressBar1").css('width', '0%');
      },
      success: function (data, textStatus, jqXHR)
      {      
          $("#loadingP").hide()
          $("#progressBar1").addClass("progress-bar-success");
          $("#progressBar1").text('100% - Carga realizada');
          document.getElementById("resultado").innerHTML =
          "El archivo " + archivos[0].name + " se ha subido correctamente.";
        document.getElementById("profile_img_").value = archivos[0].name;
        reader.addEventListener("load", displayFileInfo);
      reader.readAsDataURL(archivos[0]);
      },
      error: function (jqXHR, textStatus) { 
          $("#progressBar1").text('100% - Error al cargar el archivo');
          $("#progressBar1").removeClass("progress-bar-success");
          $("#progressBar1").addClass("progress-bar-danger");
      }
  });

  };

  const profileImg = document.getElementById("profile-img");
  const dropUploadProfileImg = document.getElementById("upload-user-img");

  if (profileImg) {
    profileImg.addEventListener("change", (event) => {
      const file = profileImg.files[0];

      if (
        file.type !== "image/jpeg" &&
        file.type !== "image/png" &&
        file.type !== "image/jpg"
      ) {
        alert("Elige un archivo válido (.png, .jpg, .jpeg)");
        return;
      }
    subirImagen(event);
      
      
     // console.log(file);
      
    });

    dropUploadProfileImg.addEventListener("dragenter", enterFile);
    dropUploadProfileImg.addEventListener("dragover", overFile);
    dropUploadProfileImg.addEventListener("dragleave", leaveFile);
    dropUploadProfileImg.addEventListener("drop", dropFile);

    function enterFile(e) {
      e.preventDefault();
      dropUploadProfileImg.style.borderColor = "#D9AD26";
    }

    function overFile(e) {
      e.preventDefault();
    }

    function leaveFile(e) {
      e.preventDefault();
      dropUploadProfileImg.style.borderColor = "";
    }

    function dropFile(e) {
      e.preventDefault();

      const data = e.dataTransfer;
      const file = data.files[0];

      dropUploadProfileImg.style.borderColor = "";
      uploadingProccess(file);
    }

    function uploadingProccess(file) {
      // calcular mb
      const size = file.size / 1048576;

      if (
        file.type !== "image/jpeg" &&
        file.type !== "image/png" &&
        file.type !== "image/jpg"
      ) {
        alert("Elige un archivo válido (.png, .jpg, .jpeg)");
        return;
      }

      const reader = new FileReader();
      reader.addEventListener("load", displayFileInfo);
      reader.readAsDataURL(file);
    }

    function displayFileInfo(e) {
      const outputImg = document.createElement("img");
      outputImg.setAttribute("src", e.target.result);
      outputImg.setAttribute("id", 'img_photo');

      dropUploadProfileImg.parentElement.classList.add("divider");
      if (
        document.querySelector(
          ".form-update-account .drop-area__wrapper.divider img"
        )
      ) {
        document
          .querySelector(".form-update-account .drop-area__wrapper.divider img")
          .remove();
      }
      dropUploadProfileImg.parentElement.appendChild(outputImg);
    }
  }
})();

// Validaciones de update user
(() => {
  // Campos
  const formUpdateProfile = document.getElementById("form-update-profile");

  if (formUpdateProfile) {
    const btnSubmit = formUpdateProfile.querySelector('[type="submit"]');

    const inputs = Array.from(formUpdateProfile.elements);

    inputs.forEach((input) => {
      if (input.getAttribute("type") === "submit") {
        input.addEventListener("click", (e) => {
          e.preventDefault();
        });
      } else if (
        input.getAttribute("type") === "text" ||
        input.getAttribute("type") === "password" ||
        input.getAttribute("type") === "email"
      ) {
        input.addEventListener("input", validateCamps);
      } else {
        input.addEventListener("change", validateCamps);
      }
    });

    btnSubmit.addEventListener("click", (e) => {
      const password = document.getElementById("password");
      const confirmPassword = document.getElementById("confirm-password");

      if (password.value !== confirmPassword.value) {
        e.preventDefault();
        Swal.fire({
          icon: "warning",
          text: "Las contraseñas no coinciden",
          button: false,
        });
      } else {
        formUpdateProfile.submit();
      }
    });

    function validateCamps(e) {
      const inputs = Array.from(formUpdateProfile.elements);

      if (e.target.validity.valid && e.target.value !== e.target.defaultValue) {
        e.target.style.borderColor = "lime";
        e.target.classList.add("camp-valid");
      } else {
        e.target.style.borderColor = "";
        e.target.classList.remove("camp-valid");
      }

      const ArrRes = [];
      inputs.forEach((input) => {
        if (input.classList.contains("camp-valid")) {
          ArrRes.push(true);
        } else {
          ArrRes.push(false);
        }
      });

      if (ArrRes.includes(true)) {
        btnSubmit.removeAttribute("disabled");
      } else {
        btnSubmit.setAttribute("disabled", true);
      }
    }
  }
})();
// Validaciones de crear plan
(() => {
  // Campos
  const formUpdateProfile = document.getElementById("form-create-plan");

  if (formUpdateProfile) {
    const btnSubmit = formUpdateProfile.querySelector('[type="submit"]');

    const inputs = Array.from(formUpdateProfile.elements);

    inputs.forEach((input) => {
      if (input.getAttribute("type") === "submit") {
        input.addEventListener("click", (e) => {
          e.preventDefault();
        });
      } else if (input.getAttribute("type") === "text") {
        input.addEventListener("input", validateCamps);
      } else {
        input.addEventListener("change", validateCamps);
      }
    });

    btnSubmit.addEventListener("click", (e) => {
      let todoCorrecto = true;
      for (var i = 0; i < formUpdateProfile.length; i++) {
        if (
          formUpdateProfile[i].type == "text" ||
          formUpdateProfile[i].type == "email"
        ) {
          if (
            formUpdateProfile[i].name == "tiktok" ||
            formUpdateProfile[i].name == "twitter" ||
            formUpdateProfile[i].name == "spotify" ||
            formUpdateProfile[i].name == "souncloud" ||
            formUpdateProfile[i].name == "mixcloud" ||
            formUpdateProfile[i].name == "youtube" ||
            formUpdateProfile[i].name == "facebook" ||
            formUpdateProfile[i].name == "detalles" ||
            formUpdateProfile[i].name == "instagram"  ||
            formUpdateProfile[i].name == "deezer"  ||
            formUpdateProfile[i].name == "twitch"  ||
            formUpdateProfile[i].name == "apple_music"  ||
            formUpdateProfile[i].name == "descuento"
          ) {
            todoCorrecto = true;
          } else if (
            formUpdateProfile[i].value == null ||
            formUpdateProfile[i].value.length == 0 ||
            /^\s*$/.test(formUpdateProfile[i].value)
          ) {
            Swal.fire({
              icon: "warning",
              text:
                formUpdateProfile[i].name +
                " no puede estar vacío o contener sólo espacios en blanco",
              button: true,
            });

            todoCorrecto = false;
          }
        }
      }

      if (todoCorrecto == true) {
        formUpdateProfile.submit();
        console.log("hola");
      }
    });

    function validateCamps(e) {
      const inputs = Array.from(formUpdateProfile.elements);

      if (e.target.validity.valid && e.target.value !== e.target.defaultValue) {
        e.target.style.borderColor = "lime";
        e.target.classList.add("camp-valid");
      } else {
        e.target.style.borderColor = "";
        e.target.classList.remove("camp-valid");
      }

      const ArrRes = [];
      inputs.forEach((input) => {
        if (input.classList.contains("camp-valid")) {
          ArrRes.push(true);
        } else {
          ArrRes.push(false);
        }
      });

      if (ArrRes.includes(true)) {
        btnSubmit.removeAttribute("disabled");
      } else {
        btnSubmit.setAttribute("disabled", true);
      }
    }
  }
})();
// Añadir más campos a los pasos
(() => {
  const otherContainers = document.querySelectorAll(".other-container");
  if (otherContainers.length > 0) {
    otherContainers.forEach((otherContainer) => {
      otherContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("add-other__btn")) {
          if (!document.querySelector('[data-step-desc="Pasos"].basic')) {
            if (!document.querySelector('[data-step-desc="Pasos"].gold')) {
              if (
                otherContainer.querySelectorAll(".remove-other__btn").length < 4
              ) {
                const oInput = e.target.parentElement.querySelector("input");
                let contar_container =
                  otherContainer.querySelectorAll(".remove-other__btn").length +
                  1;
                console.log(oInput.getAttribute(
                  "class"
                ));
               
              let clase =oInput.classList.item(1)
              console.log(clase);
              let name_input = oInput.getAttribute("name");
              const other = `
								<div class="add-other mt-3">
									<input type="url" class="form-control-steps ${clase}" name="${name_input}" placeholder="${oInput.getAttribute(
                "placeholder"
              )}" onchange="validar(this)">
									<button type="button" class="remove-other__btn">
										<i class="fa fa-times"></i>
									</button>
								</div>
							`;
                
              switch (clase) {
                case 'url_facebook':
                  const otherContainersfb = document.querySelectorAll(".cont_fb");
                  $(otherContainersfb).append(other);
                  break;
                  case 'url_youtube':
                    const otherContainersyt = document.querySelectorAll(".cont_yt");
                    $(otherContainersyt).append(other);
                    break;
                    case 'url_twitter':
                      const otherContainers = document.querySelectorAll(".other-container");
                  $('.cont_tw').append(other);
                  break;
                  case 'url_souncloud':
                  $('.cont_so').append(other);
                  break;
                  case 'url_instagram':
                  $('.cont_ins').append(other);
                  break;
                  case 'url_spotify':
                  $('.cont_spt').append(other);
                  break;
                  case 'url_deezer':
                  $('.cont_dee').append(other);
                  break;
                  case 'url_tiktok':
                  $('.cont_tik').append(other);
                  break;
                  case 'url_mixcloud':
                  $('.cont_mix').append(other);
                  break;
                  case 'url_twitch':
                  $('.cont_twic').append(other);
                  break;
                  case 'url_applemusic':
                  $('.cont_appl').append(other);
                  break;
                default:
                  break;
              }
                //otherContainer.innerHTML += other;
              } else {
                Swal.fire({
                  icon: "warning",
                  title:
                    "Solo se pueden agregar campos ilimitados en suscripción Gold",
                  text: "Te invitamos a mejorar tu membresía",
                  button: false,
                });
              }
            } else {
              const oInput = e.target.parentElement.querySelector("input");
              let clase =oInput.classList.item(1)
              console.log(clase);
              let name_input = oInput.getAttribute("name");
              const other = `
								<div class="add-other mt-3">
									<input type="url" class="form-control-steps ${clase}" name="${name_input}" placeholder="${oInput.getAttribute(
                "placeholder"
              )}" onchange="validar(this)">
									<button type="button" class="remove-other__btn">
										<i class="fa fa-times"></i>
									</button>
								</div>
							`;
              switch (clase) {
                case 'url_facebook':
                  const otherContainersfb = document.querySelectorAll(".cont_fb");
                  $(otherContainersfb).append(other);
                  break;
                  case 'url_youtube':
                    const otherContainersyt = document.querySelectorAll(".cont_yt");
                    $(otherContainersyt).append(other);
                    break;
                    case 'url_twitter':
                      const otherContainers = document.querySelectorAll(".other-container");
                  $('.cont_tw').append(other);
                  break;
                  case 'url_souncloud':
                  $('.cont_so').append(other);
                  break;
                  case 'url_instagram':
                  $('.cont_ins').append(other);
                  break;
                  case 'url_spotify':
                  $('.cont_spt').append(other);
                  break;
                  case 'url_deezer':
                  $('.cont_dee').append(other);
                  break;
                  case 'url_tiktok':
                  $('.cont_tik').append(other);
                  break;
                  case 'url_mixcloud':
                  $('.cont_mix').append(other);
                  break;
                  case 'url_twitch':
                  $('.cont_twic').append(other);
                  break;
                  case 'url_applemusic':
                  $('.cont_appl').append(other);
                  break;
                default:
                  break;
              }
              
              
            }
          } else {
            Swal.fire({
              icon: "warning",
              title: "Solo disponible para usuarios VIP y Gold",
              text: "Te invitamos a mejorar tu membresía",
              button: false,
            });
          }
        } else if (e.target.classList.contains("remove-other__btn")) {
          e.target.parentElement.remove();
        }
      });
    });
  }
})();

// Promocionar música
(() => {
  const promocionarMusica = document.getElementById("promocionar-musica");
  const btnPromocionar = document.getElementById("btn-promocionar");
  const formulario = document.getElementById("form_fans");
  //let checked = formulario.querySelectorAll('input[type=checkbox]:checked');
  let checkboxes = Array.from(
    document.getElementsByClassName("form-check-input")
  );
  const selected = "";

  if (promocionarMusica) {
    promocionarMusica.addEventListener("change", () => {
      const value =
        promocionarMusica.options[promocionarMusica.selectedIndex].value;
      let suma = 0;
      for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked != true) {
          suma = suma + 1;
        }
      }
      if (suma !== checkboxes.length && value !== "default") {
        btnPromocionar.removeAttribute("disabled");
        return;
      }

      btnPromocionar.setAttribute("disabled", true);
    });

    [...checkboxes].map((e) =>
      e.addEventListener("click", () => {
        const value =
          promocionarMusica.options[promocionarMusica.selectedIndex].value;
        let suma = 0;
        for (var i = 0; i < checkboxes.length; i++) {
          if (checkboxes[i].checked != true) {
            suma = suma + 1;
          }
        }
        if (suma !== checkboxes.length && value !== "default") {
          btnPromocionar.removeAttribute("disabled");
          return;
        }

        btnPromocionar.setAttribute("disabled", true);
      })
    );
  }
})();

// Boton Compartir
(() => {
 $(".share_fb").on("click", function (event) {
    console.log("hola bpot");
    event.preventDefault();    
    var that = $(this);
    console.log($('.share_fb_label').text())
    var href = $('.share_fb_label').text();
    console.log(href)
    $.ajax({ cache: true });
    $.getScript("//connect.facebook.net/en_US/sdk.js", function () {
      FB.init({
        appId: "1059585144777269",
        version: "v11.0", // or v2.0, v2.1, v2.0
      });
      FB.ui(
        {
          method: "share",
          title: "Title Goes here",
          description:
            "Description Goes here. Description Goes here. Description Goes here. Description Goes here. Description Goes here. ",
          href: href,
        },
        function (response) {
          console.log(response)
          if (typeof response === "undefined") {
            console.log("aqSiga adelante")
            $('.share_fb').addClass('undone')
          }
          if (response && !response.error_code) {
            var last = document.getElementById("nextBtn").innerHTML;
          let link = document.getElementById("descargar_link");
            
            if($('.fb-like').length){
              if($('.fb-like').length == $('.fb-like.done').length){
           
            if (last === "") {
             $('#next_btn').hide()
             $('#descargar_link').show()
             link.style.pointerEvents = null;
             link.classList.remove("btn_disabled");
             $('#regForm').removeAttr('style');
             $('#gracias').removeAttr('style');
             $('#error_redes').attr('style', 'display: none !important;');
             link.innerHTML = "Descargar";
     
           }else{
             if($('.share_fb').length){
              $('.share_fb').removeClass('share_fb')
           }else{
             
           $("#nextBtn").click();
           $('.fb-like').removeClass('done')
           $('.fb-like').addClass('undone')
           }
           }
                 
         }else{
           console.log("Debe dar me gusta en todas opciones porfavor")
           mostrar()
         }
           }
           if($('.share_fb').length){
            if($('.share_fb').length == $('.share_fb.done').length){
         
          if (last === "") {
           $('#next_btn').hide()
           $('#descargar_link').show()
           link.style.pointerEvents = null;
           link.classList.remove("btn_disabled");
           $('#regForm').removeAttr('style');
           $('#gracias').removeAttr('style');
           $('#error_redes').attr('style', 'display: none !important;');
           link.innerHTML = "Descargar";
   
         }else{
           if($('.share_fb').length){
            $('.share_fb').removeClass('share_fb')
            $("#nextBtn").click();
         }else{
           
         $("#nextBtn").click();
         }
         }
               
       }else{
         console.log("Debe dar me gusta en todas opciones porfavor")
         mostrar()
       }
         }
          }
        }
      );
    });
  });
})();

// Boton Megusta
(() => {
  //$(".div_share").on('click', '.share_fb', function(event) {
  jQuery(".div_share").click(function (event) {
    var that = $(this);
    //var href = document.getElementById('url_facebook').innerHTML
    var post1 = that.parents(".label_url");
    var post =
      that.parents(".label_url").prevObject[0].nextElementSibling.innerHTML;

    var last = document.getElementById("nextBtn").innerHTML;
    console.log(post);
    var url = post;
    //var url = document.getElementById('url_facebook').innerHTML;
    var openDialog = function (uri, name, options, closeCallback) {
      var win = window.open(uri, name, options);
      
      var interval = window.setInterval(function () {
        try {
          if (win == null || win.closed) {
            clearInterval(interval);
            //window.setInterval(0)
            closeCallback(win);
            console.log("click");
          }
        } catch (e) {
          console.log(e)
        }
      }, 2000);
      return win;
    };

    openDialog(url, "Social Media", "width=640,height=580", function (e) {
      console.log("se creo la venta")      
      
    });
  });

})();
// Añadir más campos a las preguntas
(() => {
  var maxField = 10; //Input fields increment limitation
  var addButton = $(".add-other__btn"); //Add button selector
  var pregunta = $(".other-container_ayuda"); //Input field pregunta
  //New input field html
  var x = 1; //Initial field counter is 1
  $(pregunta).on("click", (e) => {
    //Once add button is clicked
    if (e.target.classList.contains("add-other__btn")) {
      const oInput = e.target.parentElement.querySelector("input");
      let name_input = oInput.getAttribute("name");
      var preguntaField = `			
				<div class="col" >
			<label class="form-steps__title">Pregunta</label>	
				<input type="text" class="form-control-steps pregunta_input" name="pregunta" placeholder="Coloque aqui su pregunta" required>
				<button type="button" class="remove-other__btn" style="height: 35%;top: 40px" >
					<i class="fa fa-plus"></i>
				</button>
			</div>
			<div class="col">
				<label class="form-steps__title">Respuesta</label>					
				<input type="text" class="form-control-steps pregunta_input" id="respuesta" name="respuesta" placeholder="Nombre del canal" required>
				<button type="button" class="remove-other__btn" style="height: 35%;top: 40px" >
					<i class="fa fa-plus"></i>
				</button><!-- .col -->
			</div>	`;

      if (x < maxField) {
        //Check maximum number of input fields
        x++; //Increment field counter
        $(pregunta).append(preguntaField); // Add field html
        const btnayuda = document.getElementById("btn_Ayuda");
      }
    } else if (e.target.classList.contains("remove-other__btn")) {
      e.target.parentElement.remove();
      x--; //Decrement field counter
    }
  });
})();
// Select Music
(() => {
  // selecting loading div
const loader2 = document.querySelector("#loading3");
//const loadertext = document.querySelector("#textloading");

// showing loading
function displayLoading() {
    loader2.classList.add("display");
    //loadertext.classList.add("display");
    // to stop loading after some time
  
}

  const subirarchivo_music = (event) => {
    const archivos2 = event.target.files;
    const data2 = new FormData();

    data2.append("archivo", archivos2[0]);
    $("#loading3").show()
    $("#info-drop").hide()
    
    const dropArea12 = document.getElementById("upload-audio2");
    const infoDrop12 = dropArea12.querySelector(".info-drop");
    $.ajax({
      url: '/create-file-gate/archivo',
      type: 'POST',
      data: data2,
      cache: false,
      contentType: false,
      processData: false,
      xhr: function () {        
          var xhr = $.ajaxSettings.xhr();
          xhr.upload.onprogress = function (event) {
              var perc = Math.round((event.loaded / event.total) * 100);
             // $("#nombreArchivoCalendario1").text(inputFile.name);
             
              $("#progressBar3").text(perc + '%');
              $("#progressBar3").css('width', perc + '%');
          };
          return xhr;
      },
      beforeSend: function (xhr) {
        displayLoading()
        $('.drop-content2').attr('style','display:none')
          $("#progressBar3").text('0%');
          $("#progressBar3").css('width', '0%');
        
      },
      success: function (data, textStatus, jqXHR)
      {  
        $("#loading3").hide()    
        $('.drop-content2').removeAttr('style')
        
          $("#progressBar3").addClass("progress-bar-success");
          $("#progressBar3").text('100% - Carga realizada');
        
        infoDrop12.innerHTML = `<label for="music-fileback"><i class="fa fa-upload"></i>Cambiar Archivo</label><p>El archivo " + ${archivos2[0].name} + " se ha subido correctamente.</p>`;
        //document.getElementById("resultado_zip").innerHTML = "El archivo " + archivos[0].name + " se ha subido correctamente.";
        document.getElementById("archivo_back").value = archivos2[0].name;
        const button2 = musicBack.parentElement.parentElement.querySelector("button[data-step-page]");
      button2.removeAttribute("disabled");
      $('#btn_url').removeAttr('disabled')

      
      },
      error: function (jqXHR, textStatus) { 
          $("#progressBar2").text('100% - Error al cargar el archivo');
          $("#progressBar2").removeClass("progress-bar-success");
          $("#progressBar2").addClass("progress-bar-danger");
      }
  });
  };

  const musicBack = document.getElementById("music-fileback");

  if (musicBack) {
    console.log('musica-back')
    const fileOutput = document.getElementById("file-outputback");
    const iconState2 = document.getElementById("drop-icon2");
   // const button = musicBack.parentElement.parentElement.querySelector(  "button[data-step-page]" );

    // With Drag and Drop
    const dropArea2 = document.getElementById("upload-audio2");
    const infoDrop2 = dropArea2.querySelector(".info-drop");

    musicBack.addEventListener("change", (event) => {
      const file2 = musicBack.files[0];

      uploadingProccess2(file2, event);
    });


    function uploadingProccess2(file, event) {
      // calcular mb
      const size2 = file.size / 1048576;
      const maxSizeFile2 = musicBack.dataset.maxSizeFile;

      if (maxSizeFile2 !== "unlimited") {
        if (size2 > Number(maxSizeFile2)) {
          dropArea2.classList.add("drop-error", "text-center");
          iconState2.innerHTML = '<i class="fa fa-times"></i>';
          infoDrop2.innerHTML = `No puedes subir archivos mayores a ${
            maxSizeFile2 === "10" ? "10mb" : "1gb"
          } actualiza tu membresía<br><label for="music-file">Sube otro archivo</label> o arratralo aquí`;
          return;
        }
      }

      if (musicBack.getAttribute("accept") === "audio/*, .zip, .rar") {
        if (
          file2.type !== "audio/mpeg" &&
          file2.type !== "audio/mp3" &&
          file2.type !== "audio/wav" &&
          file2.type !== "audio/aiff" &&
          file2.type !== "application/zip"
        ) {
          dropArea2.classList.add("drop-error", "text-center");
          iconState2.innerHTML = '<i class="fa fa-times"></i>';
          infoDrop2.innerHTML = `Solo se pueden subir archivos .mp3, .mpeg, .wav, .aiff, .zip<br><label for="music-file">Sube otro archivo</label> o arratralo aquí`;
          return;
        }
      } else {
      }
      subirarchivo_music(event);
      dropArea2.classList.remove("uploading", "drop-error");
      dropArea2.classList.add("success", "text-center");
      iconState2.innerHTML = '<i class="fa fa-check"></i>';
      // infoDrop.innerHTML = `<p>El archivo se subio correctamente<br><label for="music-file">Sube otro</label> o arrastralo aquí</p>`;
     // infoDrop.innerHTML = `<p></p>`;
    }
  }
})();

// Visualizar terminos o preguntas
(() => {
  const seleccion = $("#tipo"); //Add button selector
  const btnayuda = document.getElementById("btn_Ayuda");
  //New input field html
  var x = 1; //Initial field counter is 1
  $(seleccion).on("change", (e) => {
    //Once add button is clicked
    valor = document.getElementById("tipo").value;
    if (valor == "Términos y Condiciones") {
      $("#terminos").removeAttr("hidden");
      $(".pregunta_input").removeAttr("required");
      $("#preguntas_").prop("hidden", !this.checked);
      $(".pregunta_input").val("");
      $("#politicas_privacidad").val("");
      $("#politicas_privacidad").removeAttr("required");
      $("#politicas").prop("hidden", !this.checked);
      btnayuda.setAttribute("disabled", false);
    }
    if (valor == "Preguntas Frecuentes") {
      $("#preguntas_").removeAttr("hidden");
      $("#terminos").prop("hidden", !this.checked);
      $("#politicas").prop("hidden", !this.checked);
      $("#summernote").val("");
      $("#summernote").removeAttr("required");
      $("#politicas_privacidad").val("");
      $("#politicas_privacidad").removeAttr("required");
      $(".pregunta_input").prop("required", !this.checked);
      btnayuda.setAttribute("disabled", true);
    }
    if (valor == "Politicas") {
      $("#politicas").removeAttr("hidden");
      $("#terminos").prop("hidden", !this.checked);
      $("#preguntas_").prop("hidden", !this.checked);
      $("#summernote").val("");
      $("#summernote").removeAttr("required");
      $(".pregunta_input").removeAttr("required");
      $(".pregunta_input").val("");
      $("#politicas_privacidad").prop("required", !this.checked);
      btnayuda.setAttribute("disabled", false);
    }
    if (valor == "default") {
      $("#preguntas_").removeAttr("hidden");
      $("#terminos").prop("hidden", !this.checked);
      $("#preguntas_").prop("hidden", !this.checked);
      btnayuda.setAttribute("disabled", true);
    }
  });

  $("#summernote").on("change", (e) => {
    //Once add button is clicked
    const valor_terminos = document.getElementById("summernote").value;
    if (valor_terminos != "") {
      btnayuda.removeAttribute("disabled");
      return;
    } else {
      btnayuda.setAttribute("disabled", true);
    }
  });

  $(".pregunta_input").on("change", (e) => {
    //Once add button is clicked
    const valor_pregunt = document.getElementById("pregunta1").value;
    const valor_respuesta = document.getElementById("respuesta").value;
    if (valor_pregunt != "" && valor_respuesta != "") {
      btnayuda.removeAttribute("disabled");
      return;
    } else {
      btnayuda.setAttribute("disabled", true);
    }
  });

  $("#politicas_privacidad").on("change", (e) => {
    //Once add button is clicked
    const valor_pregunt = document.getElementById("politicas_privacidad").value;
    if (valor_pregunt != "") {
      btnayuda.removeAttribute("disabled");
      return;
    } else {
      btnayuda.setAttribute("disabled", true);
    }
  });
})();

// Boton Copiar Portapapeles
(() => {

  var gate = document.getElementsByClassName('main-gate')
  if (gate.length >0){
    console.log(gate)
    var progress = document.getElementById("progress_");
    progress.addEventListener("click", adelantar);
    function adelantar(e) {
      const scrubTime = (e.offsetX / progress.offsetWidth) * player.duration;
      player.currentTime = scrubTime;
      //console.log(e);
    }
  
    var currentTab = 0; // Current tab is set to be the first tab (0)
    showTab(currentTab); // Display the current tab
  
    function showTab(n) {
      // This function will display the specified tab of the form ...
      var x = document.getElementsByClassName("tab");
      //x[n].style.display = "block";
      x[n].classList.add('show-tab');
      x[n].addEventListener("animationend", function () {
        console.log("hola mundo");
        x[n].style.display = "block";
      });
      // ... and fix the Previous/Next buttons:
      if (n == 0) {
        document.getElementById("prevBtn").style.display = "none";
      } else {
        document.getElementById("prevBtn").style.display = "none";
      }
      if (n == x.length - 1) {
        document.getElementById("nextBtn").innerHTML = "";
        document.getElementById("nextBtn").setAttribute("disabled", "disabled");
      } else {
        document.getElementById("nextBtn").innerHTML =
          "<i class='fa fa-angle-right' style='display:none'></i>";
      }
      // ... and run a function that displays the correct step indicator:
      fixStepIndicator(n);
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
      var x,
        y,
        i,
        valid = true;
      x = document.getElementsByClassName("tab");
      y = x[currentTab].getElementsByTagName("input");
      // A loop that checks every input field in the current tab:
      for (i = 0; i < y.length; i++) {
        // If a field is empty...
        if (y[i].value == "") {
          // add an "invalid" class to the field:
          y[i].className += " invalid";
          // and set the current valid status to false:
          valid = false;
        }
      }
      // If the valid status is true, mark the step as finished and valid:
      if (valid) {
        document.getElementsByClassName("step")[currentTab].className +=
          " finish";
      }
      return valid; // return the valid status
    }
  
    function fixStepIndicator(n) {
      // This function removes the "active" class of all steps...
      var i,
        x = document.getElementsByClassName("step");
      for (i = 0; i < x.length; i++) {
        x[i].className = x[i].className.replace(" active", "");
      }
      //... and adds the "active" class to the current step:
      x[n].className += " active";
    }
  }
  
})();

(() => {
  const ayuda = document.getElementById("tipo");

  const formulario = document.getElementById("form_fans");
  //let checked = formulario.querySelectorAll('input[type=checkbox]:checked');
  let checkboxes = Array.from(
    document.getElementsByClassName("form-check-input")
  );
  const selected = "";
  const valor_terminos = document.getElementById("terminos");
  const valor_pregunta = $(".pregunta");
  const valor_respuesta = $(".respuesta");

  console.log(valor_pregunta);
  console.log(valor_respuesta);
  $(valor_pregunta).on("change", (e) => {
    //Once add button is clicked
    if (valor_pregunta.value != "" && valor_respuesta.value != "") {
      console.log("hola");
      btnayuda.removeAttribute("disabled");
      return;
    }
  });

  $(valor_terminos).on("change", (e) => {
    //Once add button is clicked
    if (valor_terminos.value != "") {
      console.log("hola2");
      btnayuda.removeAttribute("disabled");
      return;
    }
  });
})();

(() => {
  $("#url_youtube").on("keyup", function () {
   // this.value = this.value.toLowerCase();
    input = $(this).val();
    //const btna = $('.form-steps__btn--support');
    console.log("hola");
    let link = $("#url_youtube").val();
    console.log(input);
    link_ = link.split("/");
    console.log(link_);
    console.log(link_.length);
    /*	if(link_[0] == "https:" && link_[2] == "soundcloud.com" && link_.length > 4){
			console.log("correcto")
			btna.removeAttribute('disabled');
		}else if(link_[0] == "https:" && link_[2] == "soundcloud.es" && link_.length > 4){
			console.log("correcto1")
			btna.removeAttribute('disabled');
		}else{
			console.log("malo")
			btna.setAttribute('disabled', true);
		}*/
  });
})();
