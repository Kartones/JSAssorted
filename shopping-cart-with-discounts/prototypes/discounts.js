export const Discounts = (function () {
  function Constructor(discounts = [], availableProducts = {}) {
    this.discounts = discounts;
    this.availableProducts = availableProducts;

    discounts.forEach((discount, index) => {
      if (index < discounts.length - 1) {
        discount.setNextDiscount(discounts[index + 1]);
      }
    });
  }

  Constructor.prototype.calculateTotalDiscount = function (products) {
    if (this.discounts.length === 0) {
      return 0;
    }
    return this.discounts[0].execute(products, this.availableProducts);
  };

  return Constructor;
})();

const BaseDiscount = (function () {
  function Constructor() {
    this.nextDiscount = null;
  }

  Constructor.prototype.setNextDiscount = function (discount) {
    this.nextDiscount = discount;
  };

  Constructor.prototype.calculateDiscount = function (
    products,
    availableProducts
  ) {
    throw new Error("Not implemented");
  };

  Constructor.prototype.execute = function (products, availableProducts) {
    const discount = this.calculateDiscount(products, availableProducts);

    if (!this.nextDiscount) {
      return discount;
    }
    return discount + this.nextDiscount.execute(products, availableProducts);
  };

  return Constructor;
})();

// Buy N units and one becomes free e.g. 2x1
export const BuyNGetOneFreeDiscount = (function () {
  function Constructor({ productCode, amount }) {
    BaseDiscount.call(this);
    this.productCode = productCode;
    this.amount = amount;
  }

  Constructor.prototype = Object.create(BaseDiscount.prototype);
  Constructor.prototype.constructor = Constructor;

  Constructor.prototype.calculateDiscount = function (
    products,
    availableProducts
  ) {
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
  };

  return Constructor;
})();

// Buy at least N units and have a reduced per unit price
export const BulkPurchasePriceDiscount = (function () {
  function Constructor({ productCode, amount, reducedPrice }) {
    BaseDiscount.call(this);
    this.productCode = productCode;
    this.amount = amount;
    this.reducedPrice = reducedPrice;
  }

  Constructor.prototype = Object.create(BaseDiscount.prototype);
  Constructor.prototype.constructor = Constructor;

  Constructor.prototype.calculateDiscount = function (
    products,
    availableProducts
  ) {
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
  };

  return Constructor;
})();
