/*
Function that records popup modal data when the popup closes.
Requires the data-modalName attribute string as a parameter.
To add this functionality to a modal: Give the modal a unique data-modalname
attribute, then find where $(modal).show("modal") is called and replace it with
this function.
*/

function recordSimModalInputs(modalNameAttrStr) {
  let target = $(event.target);
  //const simPostNumber = target.closest('.ui.card').attr('simPostNumber');
  const post = target.closest(".ui.card");
  const postID = post.attr("postID");
  const modalOpenedTime = Date.now();
  let checkboxInputs = 0b0; // going to use bit shifting

  $(`.ui.modal[data-modalName=${modalNameAttrStr}] .ui.checkbox`).removeClass("checked");
  $('input[type=checkbox]').prop('checked',false);

  $(`.ui.modal[data-modalName=${modalNameAttrStr}]`).modal({
    allowMultipe: false,
    closable: false,
    onVisible: function(){
      switch(modalNameAttrStr){
        case 'digital-literacy_articleModal':
          Voiceovers.playVoiceover(['CUSML.misc_02.mp3'])
          break;
        case 'digital-literacy_flagModal':
          Voiceovers.playVoiceover(['CUSML.misc_03.mp3'])
          break;
        case 'digfoot_normalPostModal':
          Voiceovers.playVoiceover(['CUSML.misc_04.mp3'])
          break;
        case 'esteem_postModal1':
          Voiceovers.playVoiceover(['CUSML.misc_07.mp3'])
          break;
        case 'esteem_simPostModal1':
          Voiceovers.playVoiceover(['CUSML.misc_05.mp3'])
          break;
      }
    },
    onHide: function(){
      Voiceovers.pauseVoiceover();
      const modalClosedTime = Date.now();
      const modalViewTime = modalClosedTime - modalOpenedTime;
      const pathArrayForHeader = window.location.pathname.split('/');
      const currentModule = pathArrayForHeader[2];
      const modalName = $(this).attr('data-modalName');
      let numberOfCheckboxes = 0;

      $(`.ui.modal[data-modalName=${modalNameAttrStr}] .ui.checkbox input`).each(function(){
        numberOfCheckboxes++;
        if ($(this).is(":checked")){
          checkboxInputs = checkboxInputs << 1; // shift left and add 1 to mark true
          checkboxInputs++;
        } else {
          checkboxInputs = checkboxInputs << 1; //shift left
        }
      });

       $.post("/feed", {
         actionType: 'guided activity',
         postID: postID,
         modual: currentModule,
         modalName: modalName,
         modalOpenedTime: modalOpenedTime,
         modalViewTime: modalViewTime,
         modalCheckboxesCount: numberOfCheckboxes,
         modalCheckboxesInput: checkboxInputs,
         _csrf: $('meta[name="csrf-token"]').attr('content')
       });
    },
    // the following is only relevant in the esteem module:
    onHidden: function(){
      if (modalNameAttrStr === "esteem_simPostModal1" || modalNameAttrStr === "esteem_postModal1" ){
        // if the user has selected a NEGATIVE emotion (indicated by the binary number),
        // show the second module after the first one closes.
        if ((checkboxInputs & 0b001101110) !== 0) {
          const secondModalNameAttr = modalNameAttrStr.replace('1','2');
          $(`.ui.modal[data-modalName=${secondModalNameAttr}]`).modal({
            allowMultipe: false,
            closable: false,
            onVisible: function(){
              if (secondModalNameAttr.includes('sim')) {
                Voiceovers.playVoiceover(['CUSML.misc_06.mp3'])
              } else {
                Voiceovers.playVoiceover(['CUSML.misc_07.mp3'])
              }
            },
            onHide: function(){
              Voiceovers.pauseVoiceover();
              const modalClosedTime = Date.now();
              const modalViewTime = modalClosedTime - modalOpenedTime;
              const pathArrayForHeader = window.location.pathname.split('/');
              const currentModule = pathArrayForHeader[2];
              const modalName = $(this).attr('data-modalName');
              let numberOfCheckboxes = 0;
              let checkboxInputs2 = 0b0;
              $(`.ui.modal[data-modalName=${secondModalNameAttr}] .ui.checkbox input`).each(function(){
                numberOfCheckboxes++;
                if ($(this).is(":checked")){
                  checkboxInputs2 = checkboxInputs2 << 1; // shift left and add 1 to mark true
                  checkboxInputs2++;
                } else {
                  checkboxInputs2 = checkboxInputs2 << 1; //shift left
                }
              });
               $.post("/feed", {
                 actionType: 'guided activity',
                 postID: postID,
                 modual: currentModule,
                 modalName: modalName,
                 modalOpenedTime: modalOpenedTime,
                 modalViewTime: modalViewTime,
                 modalCheckboxesCount: numberOfCheckboxes,
                 modalCheckboxesInput: checkboxInputs2,
                 _csrf: $('meta[name="csrf-token"]').attr('content')
               });
            }
          }).modal('show');
        }
      }
    }
  }).modal('show');
};
