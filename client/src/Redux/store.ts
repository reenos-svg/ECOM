import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./slice/cartSlice";
import wishlistSlice from "./slice/wishlistSlice";
import { registerApi } from "./rtk/userApi";
import authSlice from "./slice/authSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import { vendorApi } from "./rtk/vendorApi";
import productSlice from "./slice/productSlice";
import { productApi } from "./rtk/productApi";
import { categoryApiSlice } from "./rtk/categoryApi";
import { orderApi } from "./rtk/orderApi";
import orderSummarySlice from "./slice/orderSummarySlice";
import { newsletterApi } from "./rtk/newsLetterApi";
import { withdrawalApi } from "./rtk/withdrawalApi";
import { couponsApi } from "./rtk/couponApi";
import paymentApi from "./rtk/paymentApi";
import paymentSlice from "./slice/paymentSlice";
import { homepageApi } from "./rtk/homepageApi";

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    wishlist: wishlistSlice,
    userDetails: authSlice,
    product: productSlice,
    order: orderSummarySlice,
    payment: paymentSlice,

    [registerApi.reducerPath]: registerApi.reducer,
    // [loginApi.reducerPath]: loginApi.reducer,
    [vendorApi.reducerPath]: vendorApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [categoryApiSlice.reducerPath]: categoryApiSlice.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [newsletterApi.reducerPath]: newsletterApi.reducer,
    [withdrawalApi.reducerPath]: withdrawalApi.reducer,
    [couponsApi.reducerPath]: couponsApi.reducer,
    [homepageApi.reducerPath]: homepageApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      registerApi.middleware,
      vendorApi.middleware,
      productApi.middleware,
      categoryApiSlice.middleware,
      orderApi.middleware,
      newsletterApi.middleware,
      couponsApi.middleware,
      withdrawalApi.middleware,
      paymentApi.middleware,
      homepageApi.middleware,
    ),
});

// for type safety and autocompletion.
export type RootState = ReturnType<typeof store.getState>;
setupListeners(store.dispatch);
