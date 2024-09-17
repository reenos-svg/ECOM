import { createSelector } from "reselect";
import { RootState } from "../store";

// Selector function to get productDetails from the wishlist state
const getWishlistProductDetails = (state: RootState) => state.wishlist.wishlist;

// Create a selector using createSelector
export const selectWishlistProductDetails = createSelector(
  [getWishlistProductDetails], // Pass in the input selectors
  (productDetails) => productDetails // Define the transformation function
);
