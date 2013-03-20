/*
Careful, this will wipe out ALL your messages one by one. No confirm, no go back.
Choose the version you want to run, but I recommend the "Nuevo Tuenti" one, the old
one got into an inconsistant state after some thousands of deletions.
*/

// Normal Tuenti / "Tuenti Classic"
setInterval(function () {
    var wallId = "SEARCH THE SOURCE CODE FOR THE FOLLOWING AND PLACE HERE THE WALL ID";
    var csrf = "SEARCH THE SOURCE CODE ALSO FOR EITHER csrf or csfr";
    Profile.delete_wall_post.click('?m=Wall&func=process_delete_wall_post&wall_id=' + wallId
        + '&wall_page=0&filter=&filter_author=0&ajax=1&store=0&ajax_target=wall',
        {
            "wall_post_id": Tuenti.Core.DOM.getByPartialId("wall_post_").current().getId().substring(Tuenti.Core.DOM.getByPartialId("wall_post_").current().getId().lastIndexOf("_") + 1),
            "csfr": csfr, "type": 0
        },
        { "message": ".", "acceptButton": "Delete", "skipConfirmation": true, "itemKey": null });
}, 2500);

// -----------------------

// CUPCAKE / "Nuevo Tuenti"
setInterval(function () {
    YG.one("#wallpost-list").one("[type=submit]")._node.click();
    YG.one(".act-submit.acceptAction")._node.click();
}, 2500);