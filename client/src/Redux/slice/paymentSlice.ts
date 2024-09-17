// src/slices/paymentSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  order: null,
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    setOrder: (state, action) => {
      state.order = action.payload;
      state.loading = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setLoading, setOrder, setError } = paymentSlice.actions;
export default paymentSlice.reducer;
