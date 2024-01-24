async function postNewCompletedBadge(modName) {
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

$('.ui.big.green.labeled.icon.button.finish').on('click', async function() {
    const isResearchVersion = $('meta[name="isResearchVersion"]').attr('content') === "true";
    if (isResearchVersion) {
        const pathArray = window.location.pathname.split('/');
        const modNameNoDashes = pathArray[2].replace('-', '');
        await $.post("/moduleProgress", {
            module: modNameNoDashes,
            status: 'completed',
            _csrf: $('meta[name="csrf-token"]').attr('content')
        });
        await postNewCompletedBadge(pathArray[2]);
        window.location.href = '/';
    } else {
        console.log("delete")
        $.post("/delete", { _csrf: $('meta[name="csrf-token"]').attr('content') })
            .done(function() {
                window.location.href = 'https://socialmediatestdrive.org/modules.html';
            });
    }
});