import { createSelector } from "reselect";
import { RootState } from "../store";

// Selector function to get UserDetails from the cart state
const getUserDetails = (state: RootState) => state.userDetails;



// Create a selector using createSelector
export const selectUserDetails = createSelector(
  [getUserDetails], // Pass in the input selectors
  (UserDetails) => UserDetails // Define the transformation function
);
