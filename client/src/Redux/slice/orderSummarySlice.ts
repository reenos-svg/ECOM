// redux/slices/orderSummarySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderSummaryState {
  subtotal: number;
  shippingCharges: number;
  discount: number;
  total: number;
}

const initialState: OrderSummaryState = {
  subtotal: 0,
  shippingCharges: 0,
  discount: 0,
  total: 0,
};

const orderSummarySlice = createSlice({
  name: 'orderSummary',
  initialState,
  reducers: {
    setOrderSummary: (state, action: PayloadAction<OrderSummaryState>) => {
      return { ...state, ...action.payload };
    },
    
    clearOrderSummary: () => initialState,
  },
});

export const { setOrderSummary, clearOrderSummary } = orderSummarySlice.actions;
export default orderSummarySlice.reducer;
