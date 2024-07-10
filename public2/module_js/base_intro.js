const pathArray = window.location.pathname.split('/');

const moduleCards = {
  accounts: ['acctandpasswords.png', 'Accounts and Passwords'],
  'accounts-esp': ['acctandpasswords.png', 'Cuentas y Contraseñas'],
  advancedlit: ['advancednews.png', 'Responding to Breaking News!'],
  'advancedlit-esp': ['advancednews.png', 'Noticias de Último minuto'],
  cyberbullying: ['upstander.png', 'How to Be an Upstander'],
  digfoot: ['digfoot.png', 'Shaping Your Digital Footprint'],
  'digfoot-esp': ['digfoot.png', 'Moldeando tu huella digital'],
  'digital-literacy': ['news.png', 'News in Social Media'],
  'digital-literacy-esp': ['news.png', 'Las noticias en las redes sociales'],
  habits: ['smhabits.png', 'Healthy Social Media Habits'],
  'habits-esp': ['smhabits.png', 'Hábitos saludables de las redes sociales'],
  phishing: ['phishing.png', 'Scams and Phishing'],
  'phishing-esp': ['phishing.png', 'Estafas y fraudes en línea'],
  presentation: ['onlineidentity.png', 'Online Identities'],
  'presentation-esp': ['onlineidentity.png', 'Identidades en línea'],
  privacy: ['smprivacy.png', 'Social Media Privacy'],
  'privacy-esp': ['smprivacy.png', 'La privacidad en las redes sociales'],
  'safe-posting': ['privateinfo.png', 'Is It Private Information?'],
  targeted: ['targetedads.png', 'Ads on Social Media'],
  'targeted-esp': ['targetedads.png', 'Anuncios en las redes sociales'],
  esteem: ['esteem.png', 'The Ups and Downs of Social Media'],
  'esteem-esp': ['esteem.png', 'Los Altibajos de las Redes Sociales']
};

// This function is called when the "Click here to get started!" button is clicked
function startIntro() {
  // check if data collection is enabled
  const enableDataCollection = $('meta[name="isDataCollectionEnabled"]').attr('content') === 'true';
  if (enableDataCollection) {
    // update the user's module progress to "started"
    const modNameNoDashes = pathArray[2].replace('-', '');
    /* modname must have any dashes removed to match the schema. This should be
    changed because it is inconsistent - dashes are fine in every other case. */
    $.post('/moduleProgress', {
      module: modNameNoDashes,
      status: 'started',
      _csrf: $('meta[name="csrf-token"]').attr('content')
    }).then(() => {
      window.location.href = `/start/${pathArray[2]}`;
    });
  } else {
    window.location.href = `/start/${pathArray[2]}`;
  }
}

$(window).on('load', () => {
  // Update the image and the title on the card
  const cdn = 'https://dhpd030vnpk29.cloudfront.net/';
  const moduleName = pathArray[2];
  $.getJSON('/json/moduleInfo.json', (data) => {
    // TODO: put this back when Spanish cards are on Cloudfront storage
    // $("#cardImage").attr("src", cdn + data[moduleName]["image"]);
    // $("#cardTitle").text(data[moduleName]["title"]);
    $('#cardImage').attr('src', cdn + moduleCards[pathArray[2]][0]);
    $('#cardTitle').text(moduleCards[pathArray[2]][1]);
  });
  // Add animation to the tabs on click
  $('#learn, #practice, #explore, #reflect').on('click', function () {
    $(this).transition('tada');
  });
});
