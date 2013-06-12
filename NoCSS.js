/*
Remove all CSS stylesheets, script blocks and includes, iframes and custom CSS styles from current page.
Expanded from http://dorward.me.uk/software/disablecss/ original idea
*/

// add "javascript:" before the code to use it as a bookmarklet in Firefox/Chrome
var el, i, size;
for (i=0, size=document.styleSheets.length; i<size; i++) {
    void (document.styleSheets.item(i).disabled = true);
}
el = document.getElementsByTagName('script');
while (el.length > 0) {
    void (el[0].parentNode.removeChild(el[0]));
}
el = document.getElementsByTagName('link');
while (el.length > 0) {
    void (el[0].parentNode.removeChild(el[0]));
}
el = document.getElementsByTagName('iframe');
while (el.length > 0) {
    void (el[0].parentNode.removeChild(el[0]));
}
el = document.getElementsByTagName('*');
for (i = 0, size = el.length; i < size; i++) {
    void (el[i].style.cssText = '');
}