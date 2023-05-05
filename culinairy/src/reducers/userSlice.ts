import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  displayName: string;
  email: string;
  photoURL: string;
  uid: string;
}

export interface UserState {
  loggedIn: boolean;
  user: User;
}

const initialState: UserState = {
  loggedIn: false,
  user: {
    displayName: "",
    email: "",
    photoURL: "",
    uid: "",
  },
};

const savedUser = localStorage.getItem("currentUser");
let user: UserState;
if (savedUser) {
  user = JSON.parse(savedUser);
} else {
  user = initialState;
}

export const userSlice = createSlice({
  name: "user",
  initialState: user,
  reducers: {
    loginUser: (state, action: PayloadAction<UserState["user"]>) => {
      // console.log('loginUser', action.payload)
      state.user = action.payload;
      state.loggedIn = true;
      localStorage.setItem("currentUser", JSON.stringify(state));
    },
    logoutUser: (state) => {
      state.loggedIn = false;
      state.user = {
        displayName: "",
        email: "",
        photoURL: "",
        uid: "",
      };
      localStorage.removeItem("currentUser");
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
