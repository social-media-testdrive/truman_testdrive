var stepsList = [
  {
    element: '#step1',
    intro: `Dale clic en "Siguiente" para empezar.`,
    position: 'left',
    scrollTo: 'tooltip',
    audioFile: ['']
  },
  {
    element: document.querySelectorAll('#step1')[0],
    intro: `Ahora que ya conoces las diferentes configuraciones de privacidad, ¡practiquemos cómo cambiarlas!`,
    scrollTo:'tooltip',
    position:'left',
    audioFile: ['CUSML.7.6.1.mp3']
  },
  {
    element: document.querySelectorAll('#step1')[0],
    intro: `Dale clic a "Listo" y busca los puntos azules&nbsp;&nbsp;<a role='button' tabindex='0' class='introjs-hint'><div class='introjs-hint-dot'></div><div class='introjs-hint-pulse'></div></a> &nbsp; &nbsp; &nbsp; &nbsp; para aprender más...`,
    scrollTo:'tooltip',
    position:'left',
    audioFile: ['CUSML.7.6.2.mp3']
  }
];

var hintsList = [
  {
    hint: `Si tu cuenta está en configuración "<i>Pública</i>", todos en Internet pueden acceder a tu cuenta y ver lo que publicas. En este momento, está configurada como una cuenta pública.`, 
    element: '#hint1',
    hintPosition: 'top-middle',
    audioFile: ['CUSML.7.6.3.mp3']
  },
  {
    hint: `Intentemos cambiarlo a "<i>Privado</i>" para que solo las personas que apruebes puedan ver tus publicaciones. Desliza el botón para seleccionar "<i>Cuenta privada</i>".`,
    element: '#hint2',
    hintPosition: 'bottom-middle',
    audioFile: ['CUSML.7.6.4.mp3']
  },
  {
    hint: `Aquí es donde puedes cambiar quién puede contactarte en el sitio de redes sociales. Intenta cambiar la configuración a "<i>Amigos</i>" o "<i>Amigos de amigos</i>" para que extraños no puedan comentar tus publicaciones ni enviarte solicitudes de amistad.`,
    element: '#hint3',
    hintPosition: 'top-middle',
    audioFile: ['CUSML.7.6.5.mp3']
  },
  {
    hint: `Utiliza esta configuración para controlar cómo se comparte tu información de ubicación. En este momento, está configurado para que coloques tu ubicación en cada publicación.`,
    element: '#hint4',
    hintPosition: 'middle-middle',
    audioFile: ['CUSML.7.6.6.mp3']
  },
  {
    hint: `Puedes intentar desactivar esto por completo o restringir quién puede ver la información de tu ubicación.`,
    element: '#hint5',
    hintPosition: 'middle-middle',
    audioFile: ['CUSML.7.6.7.mp3']
  }
];

let clickAction = false;

function applyPrivacySimDropdownDefaults() {
  $('#step1 select.privacy-sim-single').each(function () {
    const $wrap = $(this).closest('.ui.dropdown');
    if (!$wrap.length) return;
    try {
      $wrap.dropdown('set selected', '0');
    } catch (e) { /* noop */ }
  });
}

function eventsAfterHints() {
  applyPrivacySimDropdownDefaults();
}

$(function () {
  $('.ui.toggle.checkbox').checkbox();

  $('#step1 select.privacy-sim-single').dropdown({
    fullTextSearch: false,
    forceSelection: false,
    onChange: function (value, text) {
      clickAction = true;
      $('#confirmContinueCheck').hide();

      const $module = $(this);
      const $select = $module.is('select') ? $module : $module.find('select').first();

      let cat = {};
      cat.subdirectory1 = 'sim';
      cat.subdirectory2 = 'privacy';
      cat.inputField = $select.attr('name');
      cat.absoluteTimestamp = Date.now();
      cat.inputText = text;

      $.post('/privacyAction', {
        action: cat,
        actionType: 'privacy',
        _csrf: $('meta[name="csrf-token"]').attr('content'),
      });
    },
  });
  applyPrivacySimDropdownDefaults();

  $('.blocklistDropdown').dropdown({
    onAdd: function (addedValue, addedText, $addedChoice) {
      clickAction = true;
      $('#confirmContinueCheck').hide();
      let cat = {};
      cat.subdirectory1 = 'sim';
      cat.subdirectory2 = 'privacy';
      cat.inputField = 'blockList- add';
      cat.absoluteTimestamp = Date.now();
      cat.inputText = addedValue;

      $.post('/privacyAction', {
        action: cat,
        actionType: 'privacy',
        _csrf: $('meta[name="csrf-token"]').attr('content'),
      });
    },
    onRemove: function (addedValue, removedText, $removedChoice) {
      clickAction = true;
      $('#confirmContinueCheck').hide();

      let cat = {};
      cat.subdirectory1 = 'sim';
      cat.subdirectory2 = 'privacy';
      cat.inputField = 'blockList- remove';
      cat.absoluteTimestamp = Date.now();
      cat.inputText = addedValue;

      $.post('/privacyAction', {
        action: cat,
        actionType: 'privacy',
        _csrf: $('meta[name="csrf-token"]').attr('content'),
      });
    },
  });

  $('.ui.toggle.checkbox input').on('change', function () {
    clickAction = true;
    $('#confirmContinueCheck').hide();

    let cat = {};
    cat.subdirectory1 = 'sim';
    cat.subdirectory2 = 'privacy';
    cat.inputField = $(this).attr('name');
    cat.absoluteTimestamp = Date.now();
    cat.inputText = $(this).is(':checked') ? 'true' : 'false';

    $.post('/privacyAction', {
      action: cat,
      actionType: 'privacy',
      _csrf: $('meta[name="csrf-token"]').attr('content'),
    });
  });

  $(window).on('load', function () {
    setTimeout(applyPrivacySimDropdownDefaults, 300);
  });
});