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
    closable: false,
    onHide: function(){

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
    }
  }).modal('show');
};
