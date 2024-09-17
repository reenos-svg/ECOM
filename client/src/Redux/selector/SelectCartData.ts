
import { createSelector } from "reselect";
import { RootState } from "../store";

// Selector function to get productDetails from the cart state
const getProductDetails = (state: RootState) => state.cart.cart;

// Create a selector using createSelector
export const selectProductDetails = createSelector(
  [getProductDetails], // Pass in the input selectors
  (productDetails) => productDetails // Define the transformation function
);
