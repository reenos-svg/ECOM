import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductDetails {
  productId: string;
  productName: string;
  productCategory: string;
  productPrice: number;
  productImage: string;
  productColor: string | null;
  productSize: string;
  productQuantity: number;
  productVendor: string;
}

interface CartState {
  cart: ProductDetails[];
  totalQuantity: number;
  totalPrice: number;
}

const initialState: CartState = {
  cart: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<ProductDetails>) => {
      const productDetails = action.payload;

      const existingProduct = state.cart.find(
        (product) => product.productId === productDetails.productId
      );

      if (existingProduct) {
        existingProduct.productQuantity++;
        state.totalQuantity++;
        state.totalPrice += productDetails.productPrice;
      } else {
        state.cart.push({ ...productDetails, productQuantity: 1 });
        state.totalQuantity++;
        state.totalPrice += productDetails.productPrice;
      }
    },

    incrementProductQuantity: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const product = state.cart.find((item) => item.productId === productId);
      if (product) {
        product.productQuantity += 1;
        state.totalQuantity++;
        state.totalPrice += product.productPrice;
      }
    },

    decrementProductQuantity: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const product = state.cart.find((item) => item.productId === productId);
      if (product && product.productQuantity > 1) {
        product.productQuantity -= 1;
        state.totalQuantity--;
        state.totalPrice -= product.productPrice;
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const product = state.cart.find((item) => item.productId === productId);
      if (product) {
        state.totalQuantity -= product.productQuantity;
        state.totalPrice -= product.productPrice * product.productQuantity;
        state.cart = state.cart.filter((item) => item.productId !== productId);
      }
    },
  },
});

export const {
  addToCart,
  incrementProductQuantity,
  decrementProductQuantity,
  removeFromCart,
} = cartSlice.actions;
export default cartSlice.reducer;
