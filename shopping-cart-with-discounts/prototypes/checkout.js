import { ShoppingCart } from "./shopping-cart.js";

export const Checkout = (function () {
  function Constructor(discounts) {
    this.shoppingCart = new ShoppingCart(discounts);
  }

  Constructor.prototype = {
    addProduct: function (productCode, quantity = 1) {
      this.shoppingCart.addProduct(productCode, quantity);
    },

    clear: function () {
      this.shoppingCart.clear();
    },

    getTotal: function () {
      return `${(this.shoppingCart.getTotal() / 100).toFixed(2)}€`;
    },

    getContents: function () {
      return Object.entries(this.shoppingCart.getContents())
        .map(([productCode, quantity]) => {
          return `${productCode} x ${quantity}`;
        })
        .join("\n");
    },
  };

  return Constructor;
})();
