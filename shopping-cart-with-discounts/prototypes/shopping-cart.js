import { AVAILABLE_PRODUCTS_MAP } from "./settings.js";

export const ShoppingCart = (function () {
  function Constructor(discounts) {
    this.discounts = discounts;
    this.cart = {}; // acting as a map of str, int
  }

  Constructor.prototype = {
    addProduct: function (productCode, quantity = 1) {
      if (!AVAILABLE_PRODUCTS_MAP[productCode]) {
        throw new Error(`Product ${productCode} not available`);
      }

      this.cart[productCode] = (this.cart[productCode] || 0) + quantity;
    },

    clear: function () {
      this.cart = {};
    },

    getContents: function () {
      // return a safe copy of the cart
      return Object.assign({}, this.cart);
    },

    getTotalWithoutDiscount: function () {
      return Object.entries(this.cart).reduce(
        (accumulated, [productCode, quantity]) => {
          return (
            accumulated + AVAILABLE_PRODUCTS_MAP[productCode].price * quantity
          );
        },
        0
      );
    },

    getTotal: function () {
      return (
        this.getTotalWithoutDiscount() -
        this.discounts.calculateTotalDiscount(this.cart)
      );
    },
  };

  return Constructor;
})();
