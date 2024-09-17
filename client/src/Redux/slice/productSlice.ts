import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface Product {
  id: string;
  name: string;
  price: number;
  // other fields...
}

export interface ProductState {
  isLoading: boolean;
  product: Product[];
  error: string | null;
}
const initialState: ProductState = {
  isLoading: false,
  product: [],
  error: null,
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
      productCreateRequest: (state) => {
        state.isLoading = true;
      },
      productCreateSuccess: (state, action: PayloadAction<Product>) => {
        state.isLoading = false;
        state.product.push(action.payload);
      },
      productCreateFailure: (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.error = action.payload;
      },
      // Other reducers...
      clearErrors: (state) => {
        state.error = null;
      },
    },
  });
  
  // Export actions
  export const {
    productCreateRequest,
    productCreateSuccess,
    productCreateFailure,
    clearErrors,
  } = productSlice.actions;
  
  // Export the reducer
  export default productSlice.reducer;