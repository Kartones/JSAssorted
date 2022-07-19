export class Discounts {
  constructor(discounts = [], availableProducts = {}) {
    this.discounts = discounts;
    this.availableProducts = availableProducts;

    discounts.forEach((discount, index) => {
      if (index < discounts.length - 1) {
        discount.setNextDiscount(discounts[index + 1]);
      }
    });
  }

  calculateTotalDiscount(products) {
    if (this.discounts.length === 0) {
      return 0;
    }
    return this.discounts[0].execute(products, this.availableProducts);
  }
}

class BaseDiscount {
  constructor() {
    this.nextDiscount = null;
  }

  setNextDiscount(discount) {
    this.nextDiscount = discount;
  }

  calculateDiscount(products, availableProducts) {
    throw new Error("Not implemented");
  }

  execute(products, availableProducts) {
    const discount = this.calculateDiscount(products, availableProducts);

    if (!this.nextDiscount) {
      return discount;
    }
    return discount + this.nextDiscount.execute(products, availableProducts);
  }
}

// Buy N units and one becomes free e.g. 2x1
export class BuyNGetOneFreeDiscount extends BaseDiscount {
  constructor({ productCode, amount }) {
    super();
    this.productCode = productCode;
    this.amount = amount;
  }

  calculateDiscount(products, availableProducts) {
    let discount = 0;
    let quantity = products[this.productCode];

    if (!quantity) {
      return discount;
    }
    while (quantity > 0 && quantity >= this.amount) {
      quantity -= this.amount;
      discount += availableProducts[this.productCode].price;
    }

    return discount;
  }
}

// Buy at least N units and have a reduced per unit price
export class BulkPurchasePriceDiscount extends BaseDiscount {
  constructor({ productCode, amount, reducedPrice }) {
    super();
    this.productCode = productCode;
    this.amount = amount;
    this.reducedPrice = reducedPrice;
  }

  calculateDiscount(products, availableProducts) {
    let discount = 0;
    let quantity = products[this.productCode];

    if (!quantity) {
      return discount;
    }

    if (quantity >= this.amount) {
      const originalAggregatedPrice =
        availableProducts[this.productCode].price * quantity;
      discount = originalAggregatedPrice - this.reducedPrice * quantity;
    }

    return discount;
  }
}
