import { ShoppingCart } from "./shopping-cart.js";

export class Checkout {
  constructor(discounts) {
    this.shoppingCart = new ShoppingCart(discounts);
  }

  addProduct(productCode, quantity = 1) {
    this.shoppingCart.addProduct(productCode, quantity);
  }

  clear() {
    this.shoppingCart.clear();
  }

  getTotal() {
    return `${(this.shoppingCart.getTotal() / 100).toFixed(2)}€`;
  }

  getContents() {
    return Object.entries(this.shoppingCart.getContents())
      .map(([productCode, quantity]) => {
        return `${productCode} x ${quantity}`;
      })
      .join("\n");
  }
}
