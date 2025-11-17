async function postNewCompletedBadge(modName){
  const completedTypeBadges = await $.getJSON('/json/testdriveBadges.json');
  const badgeId = `completed_${modName}`;
  const badgeTitle = completedTypeBadges[badgeId].title;
  const badgeImage = completedTypeBadges[badgeId].image;
  await $.post('/postUpdateNewBadge', {
    badgeId: badgeId,
    badgeTitle: badgeTitle,
    badgeImage: badgeImage,
    _csrf: $('meta[name="csrf-token"]').attr('content')
  });
  return;
}

$('.ui.big.green.labeled.icon.button.finish')
  .on('click', async function () {
    const isResearchVersion = $('meta[name="isResearchVersion"]').attr('content') === "true";
    if (isResearchVersion) {
      const pathArray = window.location.pathname.split('/');
      const modNameNoDashes = pathArray[2].replace('-','');
      try {
        await $.post("/moduleProgress", {
          module: modNameNoDashes,
          status: 'completed',
          _csrf: $('meta[name="csrf-token"]').attr('content')
        });
        await postNewCompletedBadge(pathArray[2]);
      } catch (error) {
        console.error('Error updating module progress:', error);
        // Navigate anyway even if POST fails
      }
      window.location.href = '/';
    } else {
      // Non-research version: clear data and redirect
      // Navigate immediately - don't wait for POST (which may fail without DB)
      window.location.href = 'https://es.socialmediatestdrive.org/';
      
      // Try to clear data in background (fire and forget)
      $.post("/delete", {_csrf: $('meta[name="csrf-token"]').attr('content') })
      .done(function(){
        console.log('Account data cleared');
      })
      .fail(function(xhr) {
        console.log('Could not clear account data (expected if no DB):', xhr.status);
        // Navigation already happened above, so ignore error
      });
    }
});

// Handle "See Other Modules" button - just redirect to modules page
$('.ui.big.green.labeled.icon.button.viewModules')
  .on('click', function () {
    window.location.href = '/';
  });
