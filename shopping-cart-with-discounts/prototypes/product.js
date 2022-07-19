export const Product = (function () {
  function Constructor(code, friendlyName, price) {
    this.code = code;
    this.friendlyName = friendlyName;
    this.price = price;
  }

  return Constructor;
})();
