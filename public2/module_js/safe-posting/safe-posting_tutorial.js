const nextPageURL = 'tut_guide';

const stepsList = [
  {
    element: document.querySelectorAll('#step1')[0],
    intro: 'Before you talk to someone online, ask yourself:<br>“<i>Do I know this person offline? Have we met face-to-face?</i>”<br>If the answer is “<i>No</i>” to either, be careful what you share.',
    position: 'left',
    highlightClass:"helperHelper",
    audioFile: ['']
  },
  {
    element: document.querySelectorAll('#step2')[0],
    intro: "If someone you don’t know asks for private information or pressures you to share personal things, there are some strategies you can use to respond.",
    position: 'top',
    highlightClass:"helperHelper",
    audioFile: ['']

  },
  {
    element: document.querySelectorAll('#step2')[0],
    intro: "You can change the subject or say: <br><i>“I don't want to talk about this.”</i>",
    position: 'top',
    highlightClass:"helperHelper",
    audioFile: ['']
  },
  {
    element: document.querySelectorAll('#step2')[0],
    intro: "You can use humor to change the conversation. For example, <br><i>“You're asking so many questions?! Haha you sound like my nosy aunt.”</i>",
    position: 'top',
    highlightClass:"helperHelper",
    scrollTo:'element',
    audioFile: ['']
  },
  {
    element: document.querySelectorAll('#step1')[0],
    intro: "Ask a trusted adult for advice or help if you feel unsure or uncomfortable in any situation.",
    position: 'right',
    scrollTo:'element',
    audioFile: ['']
  },
  {
    element: document.querySelectorAll('#step1')[0],
    intro: "Keep in mind, you do not have to share anything, even if you are pressured! It's not okay for someone to pressure you, and that's not being a good friend.",
    position: 'right',
    audioFile: ['']
  }
];
