import {
  BulkPurchasePriceDiscount,
  BuyNGetOneFreeDiscount,
} from "./discounts.js";

import { Product } from "./product.js";

// Define here the product codes
export const PRODUCT_CODE_A = "PRODUCT CODE #1";
export const PRODUCT_CODE_B = "PRODUCT CODE #2";
export const PRODUCT_CODE_C = "PRODUCT CODE #3";

// NOTE: All prices in euro cents

// Define here which products can be purchased
const AVAILABLE_PRODUCTS = [
  new Product(PRODUCT_CODE_A, "Product A user-friendly name", 500),
  new Product(PRODUCT_CODE_B, "Product B user-friendly name", 1000),
  new Product(PRODUCT_CODE_C, "Product C user-friendly name", 750),
];

// Define here which discounts are active
/*
  NOTE: If applying multiple discounts to the same product, results might not be correct ones.
  e.g. BuyNGetOneFreeDiscount & BulkPurchasePriceDiscount to the same product, if amount is same in both
  would cause bulk purchase one to count the free item as if were paid.
  This could be solved by making discounts exclusive: e.g. each discount reports if applied and if so, we stop
  checking further discounts.
*/
export const DISCOUNTS = [
  new BuyNGetOneFreeDiscount({ productCode: PRODUCT_CODE_A, amount: 2 }),
  new BulkPurchasePriceDiscount({
    productCode: PRODUCT_CODE_B,
    amount: 3,
    reducedPrice: 900,
  }),
];

export const AVAILABLE_PRODUCTS_MAP = AVAILABLE_PRODUCTS.reduce(
  (mapObject, product) => {
    mapObject[product.code] = product;
    return mapObject;
  },
  {}
);
