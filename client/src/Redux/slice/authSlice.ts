import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode

interface User {
  id: string | null;
  role: string | null;
  vendorId: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  id: string | null;
  token: string | null;
  role: string | null;
}

const initialState: AuthState = {
  id: localStorage.getItem("token")
    ? jwtDecode<string>(localStorage.getItem("token")).id
    : null,
  token: localStorage.getItem("token"),
  user: null,
  isLoggedIn: localStorage.getItem("token") ? true : false,
  role: localStorage.getItem("token")
    ? jwtDecode<string>(localStorage.getItem("token")).role
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.id = action.payload.id;
      state.isLoggedIn = true;
      state.role = action.payload.role;
    },

    resetUser(state) {
      state.id = null;
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      state.role = null;
    },
  },
});

export const { setUser, resetUser } = authSlice.actions;
export default authSlice.reducer;
