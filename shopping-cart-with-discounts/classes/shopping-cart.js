import { AVAILABLE_PRODUCTS_MAP } from "./settings.js";

export class ShoppingCart {
  constructor(discounts) {
    this.discounts = discounts;
    this.cart = {}; // acting as a map of str, int
  }

  addProduct(productCode, quantity = 1) {
    if (!AVAILABLE_PRODUCTS_MAP[productCode]) {
      throw new Error(`Product ${productCode} not available`);
    }

    this.cart[productCode] = (this.cart[productCode] || 0) + quantity;
  }

  clear() {
    this.cart = {};
  }

  getContents() {
    // return a safe copy of the cart
    return Object.assign({}, this.cart);
  }

  getTotalWithoutDiscount() {
    return Object.entries(this.cart).reduce(
      (accumulated, [productCode, quantity]) => {
        return (
          accumulated + AVAILABLE_PRODUCTS_MAP[productCode].price * quantity
        );
      },
      0
    );
  }

  getTotal() {
    return (
      this.getTotalWithoutDiscount() -
      this.discounts.calculateTotalDiscount(this.cart)
    );
  }
}
