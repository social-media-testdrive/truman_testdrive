function setLearningMapColumnWidths(){
  const tableWidth = $(`#learningMapTable tbody`).width();
  const yAxisWidth = $(`#learningMapTable tbody .yAxisLabel`).first().width();
  const totalPadding = 66; // 11 * 6
  const idealColumnWidth = Math.round((tableWidth - yAxisWidth - 66) / 3);
  $(`td:not(.xAxisLabel, .yAxisLabel)`).css('width', idealColumnWidth);
}

async function addLearningMapIcons(completedModules){
  for(const modName of completedModules) {
    $(`#learningMapTable .container[data-mapTableMod="${modName}"]`).append(`
      <i class="icon large white circular icon check">
    `);
  }
};


$(window).on("load", async function() {
  const moduleGeneralData = await $.get('/getLearnerGeneralModuleData');
  let completedModules = [];
  for (const modName of Object.keys(moduleGeneralData)){
    if(moduleGeneralData[modName].status === "completed") {
      completedModules.push(modName);
    }
  }
  addLearningMapIcons(completedModules);
  setLearningMapColumnWidths();
});
