// Automatically add unique card IDs to guided activity posts
// Each post must have an ID to have any actions on it written to the DB
function addCardIds() {
    const pathArray = window.location.pathname.split('/');
    const subdirectory1 = pathArray[1];
    const subdirectory2 = pathArray[2];
    let id = 1;
    let idString = "";
    $('.ui.card').each(function() {
        idString = `${subdirectory2}_${subdirectory1}_post${id}`;
        $(this).attr('postID', idString);
        // give comments IDs as well
        let commentID = 1;
        let commentIdString = "";
        $(this).find('.comment').not('.like').not('.flag').each(function() {
            commentIdString = `${subdirectory2}_${subdirectory1}_post${id}_comment${commentID}`;
            $(this).attr('commentID', commentIdString);
            commentID++;
        })
        id++;
    });
}

$(window).on("load", function() {
    addCardIds();
});