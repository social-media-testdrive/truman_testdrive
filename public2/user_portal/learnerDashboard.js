async function addLearningMapIcons(){
  const completedModules = await $.get('/getLearnerCompletedModules');
  for(const modName of completedModules) {
    $(`#learningMapTable .container[data-mapTableMod="${modName}"]`).append(`
      <i class="icon large white circular icon check">
    `);
  }
};

$(window).on("load", async function() {
  addLearningMapIcons();
});
