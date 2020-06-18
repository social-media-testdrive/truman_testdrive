// Function that records popup modal data once it is closed
// Requires the data-modalName attribute string as a parameter
function recordSimModalInputs(modalNameAttrStr) {
  let target = $(event.target);
  const simPostNumber = target.closest('.ui.card').attr('simPostNumber');
  const post = target.closest(".ui.fluid.card");
  // const postID = post.attr("postID");
  const modalOpenedTime = Date.now();
  let checkboxInputs = 0b0;

  $(`.ui.modal[data-modalName=${modalNameAttrStr}] .ui.checkbox`).removeClass("checked");
  $('input[type=checkbox]').prop('checked',false);

  $(`.ui.modal[data-modalName=${modalNameAttrStr}]`).modal({
    closable: false,
    onHide: function(){

      const modalClosedTime = Date.now();
      const modalViewTime = modalClosedTime - modalOpenedTime;
      const modalName = $(this).attr('data-modalName');
      let numberOfCheckboxes = 0;

      $(`.ui.modal[data-modalName=${modalNameAttrStr}] .ui.checkbox input`).each(function(){
        numberOfCheckboxes++;
        if ($(this).is(":checked")){
          checkboxInputs = checkboxInputs << 1;
          checkboxInputs++;
        } else {
          checkboxInputs = checkboxInputs << 1;
        }
      });

       $.post("/guidedActivityAction", {
         //postID: postID,
         simPostNumber: simPostNumber,
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
