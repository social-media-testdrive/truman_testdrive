function recordModalInputs(modalNameAttrStr) {
  let target = $(event.target);
  const postNumber = target.closest('.ui.card').attr('postNumber');
  const post = target.closest(".ui.fluid.card");
  const postID = post.attr("postID");
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

       $.post("/feed", {
         postID: postID,
         modual: "phishing",
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

function openPhishingModal(phishingLink){
  if(phishingLink.attr('phishingPostType') === "surveyScam"){
    recordModalInputs('phishing_surveyScam');
  } else if (phishingLink.attr('phishingPostType') === "loginScam"){
    recordModalInputs('phishing_loginScam');
  } else if (phishingLink.attr('phishingPostType') === "creditCardScam"){
    recordModalInputs('phishing_creditCardScam');
  }
}

$('.ui.sticky.newPostSticky')
  .sticky({
    context: '#content',
    offset: 90
  });

$('.ui.modal').modal({ closable: false });
$('.newpost').css({"visibility": "visible"})
$('.ui.simple.dropdown.item').css({"display":"inherit"})

//Open the corresponding phishing modal when a phishing link is clicked
$('.phishingLink').on('click', function () { openPhishingModal($(this)) });
