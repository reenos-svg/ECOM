import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

interface ProductDetails {
  productId: string | number;
  productImages: string[] | string;
  productName: string;
  productDescription: string | undefined;
  productPrice: number;
  productOldPrice?: number;
}

interface WishlistState {
  wishlist: ProductDetails[];
}

const initialState: WishlistState = {
  wishlist: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<ProductDetails>) => {
      const productDetails = action.payload;

      const existingProduct = state.wishlist.find(
        (product) => product.productId === productDetails.productId
      );

      if (existingProduct) {
        toast.error(`${productDetails.productName} already exists`);
      } else {
        state.wishlist.push({ ...productDetails });
        toast.success(`${productDetails.productName} added to wishlist`, {
          style: {
            border: "1px solid #fb923c",
            padding: "14px",
            color: "#fb923c",
            borderRadius: "40px",
            font: "ubuntu",
          },
          iconTheme: {
            primary: "#fb923c",
            secondary: "#FFFAEE",
          },
        });
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string | number>) => {
      const productId = action.payload;
      state.wishlist = state.wishlist.filter(
        (product) => product.productId !== productId
      );
      toast.success("Product removed from wishlist", {
        style: {
          border: "1px solid #fb923c",
          padding: "14px",
          color: "#fb923c",
          borderRadius: "40px",
          font: "ubuntu",
        },
        iconTheme: {
          primary: "#fb923c",
          secondary: "#FFFAEE",
        },
      });
    },
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export const selectWishlist = (state: { wishlist: WishlistState }) =>
  state.wishlist.wishlist;
export default wishlistSlice.reducer;
