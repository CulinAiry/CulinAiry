import { auth } from "../firebase";
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { loginUser, logoutUser, UserState } from "../reducers/userSlice";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import showNotificationPopup from "../components/showNotificationPopup";

export default function Login() {
  const dispatch = useDispatch();
  const loggedIn = useSelector((state: { user: UserState }) => state.user.loggedIn);
  const googleProvider = new GoogleAuthProvider();
  const gitProvider = new GithubAuthProvider();

  const googleSignUp = () => {
    signInWithPopup(auth, googleProvider)
      .then((res) => {
        const user = res.user;
        console.log(res);
        const loginData = { displayName: user.displayName || '', email: user.email || '', photoURL: user.photoURL || '', uid: user.uid, loggedIn: true };
        dispatch(loginUser(loginData));
        showNotificationPopup(`Logged in as ${user.displayName}`, '#15d146');
      })
      .catch((err) => {
        alert(`${err.name}: ${err.code}. ${err.customData.email} already has an an account!`);
      })
  }

  const gitSignUp = () => {
    signInWithPopup(auth, gitProvider)
      .then((res) => {
        const user = res.user;
        console.log(res);
        const loginData = { displayName: user.displayName || '', email: user.email || '', photoURL: user.photoURL || '', uid: user.uid, loggedIn: true };
        dispatch(loginUser(loginData));
        showNotificationPopup(`Logged in as ${user.displayName}`, '#15d146');
      })
      .catch((err, ...rest) => {
        alert(`${err.name}: ${err.code}. ${err.customData.email} already has an an account!`);
      })
  }
  const logOut = () => {
    dispatch(logoutUser());
    showNotificationPopup(`Logged out`, '#de395f');
  }

  return (
    <div className="text-center">
      {loggedIn !== undefined && !loggedIn && (
        <div id="logIn">
          <div id="notification-popup"></div>
          <button type="button" id="git" className="signUp" onClick={gitSignUp}>
            Sign up with GitHub
            <span className="ml-2 fa-brands fa-github" />
          </button>
          <button type="button" id="google" className="signUp" onClick={googleSignUp}>
            Sign up with Google
            <span className="ml-2 fa-brands fa-google" />
          </button>
        </div>
      )}
      {loggedIn !== undefined && loggedIn && (
        <div id="logIn">
          <div id="notification-popup"></div>
          <button type="button" id="logOut" className="signUp" onClick={logOut}>
            Log Out
          </button>
        </div>
      )}
    </div>
  );

}
