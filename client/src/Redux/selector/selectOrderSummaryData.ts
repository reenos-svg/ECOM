
import { createSelector } from "reselect";
import { RootState } from "../store";

// Selector function to get productDetails from the cart state
const getOrderDetails = (state: RootState) => state.order;

// Create a selector using createSelector
export const selectOrderDetails = createSelector(
  [getOrderDetails], // Pass in the input selectors
  (orderDetails) => orderDetails // Define the transformation function
);
