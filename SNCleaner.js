/*
Careful, this will wipe out ALL your messages one by one. No confirm, no go back.
*/

// CUPCAKE / "New Tuenti" (2012/13 redesign)
setInterval(function () {
    YG.one("#wallpost-list").one("[type=submit]")._node.click();
    YG.one(".act-submit.acceptAction")._node.click();
}, 2500);