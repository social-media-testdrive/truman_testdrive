const hintsList = [
  {
    element: '#hint1',
    hint: `Algunas redes sociales también tienen una página donde puedes 
    controlar el tiempo que las usas, ya sea desde el navegador o en la 
    aplicación. ¡Incluso puedes establecer recordatorios con límites de 
    tiempo de uso diario!`,
    hintPosition: "middle-middle",
    hintButtonLabel: '¡Entendido!',
    // audioFile: ['CUSML.10.4.10.mp3']
  },
  {
    element: '#hint2',
    hint: `Es importante ser consciente de cuánto tiempo necesitas estar en 
    las redes sociales. Piensa en cómo encontrar un balance entre el tiempo 
    que pasas en ellas y el que le dedicas a realizar otras actividades, ¡como 
    salir con tus amigos y hablar cara a cara!`,
    hintPosition: "middle-middle",
    hintButtonLabel: '¡Entendido!',
    // audioFile: ['CUSML.10.4.11.mp3']
  },
  {
    element: '#hint3',
    hint: `Algunas señales que indican que necesitas tomarte un descanso de 
    las redes sociales son: No pasar tanto tiempo con tu familia o amigos, sentirte 
    triste, ansioso o cansado, y tener dificultades para estar al día con tus tareas.`,
    hintPosition: "middle-middle",
    hintButtonLabel: '¡Entendido!',
    // audioFile: ['CUSML.10.4.12.mp3']
  },
  {
    element: '#reminderTimeSelectField',
    hint: `¡Tómate un descanso para poder desconectarte si piensas que las estás usando 
    demasiado!`,
    hintPosition: "middle-middle",
    hintButtonLabel: '¡Entendido!',
    // audioFile: ['CUSML.10.4.13.mp3']
  }
];

//activating a normal dropdown (the one used in the habits module activity page)
$('.ui.selection.dropdown').dropdown();
