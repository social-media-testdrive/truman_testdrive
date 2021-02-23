function startIntro(){
    var intro = introJs().setOptions({ 'hidePrev': true, 'hideNext': true, 'exitOnOverlayClick': false, 'showStepNumbers':false, 'showBullets':false, 'scrollToElement':false, 'doneLabel':'Listo &#10003' });
      intro.setOptions({
        steps: [
          {
            element: '#step1',
            intro: `Las redes sociales pueden ayudarte a mantenerte conectado con tus amigos y poder saber lo que están haciendo. También, es un buen espacio para aprender y explorar nuevos hobbies e intereses.`,
            position: 'right'
          },
          {
            element: '#step2',
            intro: `Pero algunas veces puedes ver publicaciones que te hagan sentir que te dejan fuera de la diversión o que la vida de otras personas es mucho más emocionante que la tuya, esto puede hacerte sentir preocupado, triste o angustiado.`,
            position: 'right'
          },
          {
            element: '#step2',
            intro: `Estos sentimientos son de alerta roja. Cuando notes esta sensación de alerta roja es importante ir más despacio, pensar en cómo te estás sintiendo y que puedes hacer al respecto.`,
            position: 'right'
          },
          // {
          //   element: '#step3',
          //   intro: `You may sometimes feel like other people's lives are much
          //   more exciting than yours after seeing their posts.`,
          //   position: 'right',
          //   // scrollTo: 'element',
          //   // scrollPadding: 100
          // },
          // {
          //   element: '#step3',
          //   intro: `But remember, people tend to post more about positive and
          //   exciting things, especially when lots of people can see it.`,
          //   position: 'right',
          //   // scrollTo: 'element',
          //   // scrollPadding: 100
          // },
          {
            element: '#step3B',
            intro: `Cuando experimentes la sensación de alerta roja, es probable que tengas ganas de compartir cómo te sientes en las redes sociales. Compartir en redes sociales es genial, pero intenta no compartir en exceso.`,
            position: 'right'
          },
          {
            element: '#step3B',
            intro: `<b>Compartir demasiado</b> nuestros sentimientos, información o experiencias puede sentirse bien en el momento, pero podría causarte a ti o a otros incomodidad después.`,
            position: 'right'
          },
          {
            element: '#step4',
            intro: `Si experimentas la sensación de alerta roja, toma una pausa y desconéctate para hacer otra cosa que disfrutes, esto puede ayudar a que te sientas mejor.`,
            position: 'right'
          },
          {
            element: '#step4',
            intro: `Una buena manera de disfrutar de las redes sociales es <b>balancearlas</b> con otras cosas que disfrutas hacer, como pasar tiempo con tu familia y amigos, leer un libro o jugar afuera.`,
            position: 'right'
          }
        ]
      });
      intro.start().onexit(function() {
      window.location.href='/sim/esteem-esp';
    });

  };

  $(window).on("load", function() {startIntro();});
