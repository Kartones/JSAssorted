import assert from "assert";
import { Checkout } from "./checkout.js";
import { Discounts } from "./discounts.js";
import {
  AVAILABLE_PRODUCTS_MAP,
  DISCOUNTS,
  PRODUCT_CODE_A,
  PRODUCT_CODE_B,
  PRODUCT_CODE_C,
} from "./settings.js";

const checkoutInstance = (products) => {
  const discounts = new Discounts(DISCOUNTS, AVAILABLE_PRODUCTS_MAP);
  const checkout = new Checkout(discounts);

  products.forEach((productCode) => {
    checkout.addProduct(productCode);
  });

  return checkout;
};

const testData = [
  [[PRODUCT_CODE_A, PRODUCT_CODE_B, PRODUCT_CODE_C], "22.50€"],
  [[PRODUCT_CODE_A, PRODUCT_CODE_B, PRODUCT_CODE_A], "15.00€"],
  [
    [
      PRODUCT_CODE_B,
      PRODUCT_CODE_B,
      PRODUCT_CODE_B,
      PRODUCT_CODE_A,
      PRODUCT_CODE_B,
    ],
    "41.00€",
  ],
  [
    [
      PRODUCT_CODE_A,
      PRODUCT_CODE_B,
      PRODUCT_CODE_A,
      PRODUCT_CODE_A,
      PRODUCT_CODE_C,
      PRODUCT_CODE_B,
      PRODUCT_CODE_B,
    ],
    "44.50€",
  ],
];

// tests that total price correctly applies discounts
testData.forEach(([products, expectedTotal]) => {
  const checkout = checkoutInstance(products);
  const actualTotal = checkout.getTotal();
  assert(
    actualTotal === expectedTotal,
    `Expected total ${expectedTotal} but got ${actualTotal}`
  );

  console.log("\nCart contents:");
  console.log(checkout.getContents());
  console.log("Total:", checkout.getTotal());
});

// NOTE: probability is not equal for all elements, but close enough for this tests
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

// tests addProduct order doesn't affects total price
testData.forEach(([products, expectedTotal]) => {
  shuffle(products);
  const checkout = checkoutInstance(products);
  const actualTotal = checkout.getTotal();

  assert(
    actualTotal === expectedTotal,
    `Expected total ${expectedTotal} but got ${actualTotal}`
  );
});

console.log("\nAll tests passed");
