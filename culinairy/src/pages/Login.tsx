import { auth } from "../firebase";
import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import showNotificationPopup from "../components/showNotificationPopup";
import { loginUser, logoutUser, UserState } from "../reducers/userSlice";
// import AdsComponent from '../components/AdsComponent';

export default function Login() {
  const dispatch = useDispatch();
  const loggedIn = useSelector((state: { user: UserState }) => state.user.loggedIn);
  const googleProvider = new GoogleAuthProvider();
  const gitProvider = new GithubAuthProvider();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        const user = res.user;
        const loginData = { displayName: user.displayName || '', email: user.email || '', photoURL: user.photoURL || '', uid: user.uid, loggedIn: true };
        showNotificationPopup(`Logged in as ${user.email}`, '#15d146');
        dispatch(loginUser(loginData));
      })
      .catch((err) => {
        if (err.code === 'auth/user-not-found') {
          // If user doesn't exist, create a new account with the same email and password
          createUserWithEmailAndPassword(auth, email, password)
            .then((res) => {
              const user = res.user;
              const loginData = { displayName: user.displayName || '', email: user.email || '', photoURL: user.photoURL || '', uid: user.uid, loggedIn: true };
              showNotificationPopup(`Logged in as ${user.email}`, '#15d146');
              dispatch(loginUser(loginData));
            })
            .catch((err) => {
              alert(`${err.name}: ${err.message}`);
            });
        } else {
          alert(`${err.name}: ${err.message}`);
        }
      });
  }


  const googleSignUp = () => {
    signInWithPopup(auth, googleProvider)
      .then((res) => {
        const user = res.user;
        console.log(res);
        const loginData = { displayName: user.displayName || '', email: user.email || '', photoURL: user.photoURL || '', uid: user.uid, loggedIn: true };
        showNotificationPopup(`Logged in as ${user.displayName}`, '#15d146');
        dispatch(loginUser(loginData));
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
        showNotificationPopup(`Logged in as ${user.displayName}`, '#15d146');
        dispatch(loginUser(loginData));
      })
      .catch((err, ...rest) => {
        alert(`${err.name}: ${err.code}. ${err.customData.email} already has an an account!`);
      })
  }

  const logOut = () => {
    showNotificationPopup(`Logged out`, '#de395f');
    dispatch(logoutUser());
  }

  return (
    <div className="flex justify-center h-screen">
  <div id="notification-popup"></div>
  {loggedIn !== undefined && !loggedIn && (
    <div id="logIn" className="max-w-[100vw] flex flex-col items-center">
      <div className="max-w-[100vw] flex md:flex-row items-center">
        <button type="button" id="git" className="signUp mb-2" onClick={gitSignUp}>
          Sign up with GitHub
          <span className="ml-2 fa-brands fa-github" />
        </button>
        <button type="button" id="google" className="signUp mb-4" onClick={googleSignUp}>
          Sign up with Google
          <span className="ml-2 fa-brands fa-google" />
        </button>
      </div>
      <div id="email-sign-in" className="bg-[#476f9d] p-4 rounded-lg max-w-[90vw]">
        <div className="mt-4 flex flex-col items-center">
          <input type="email" placeholder="Email" value={email} onChange={handleEmailChange} className="border rounded-lg p-2 mb-2 w-full max-w-md" />
          <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} className="border rounded-lg p-2 w-full max-w-md" />
          <button type="button" className="bg-[#2e3687] hover:bg-[#3a439c] text-white mt-2 px-4 py-2 rounded-md" onClick={handleSignIn}>
            Sign in with email
          </button>
        </div>
      </div>
    </div>
  )}
  {loggedIn !== undefined && loggedIn && (
    <div id="logIn">
      <button type="button" id="logOut" className="signUp" onClick={logOut}>
        Log Out
      </button>
    </div>
  )}
  {/* <>
    <h1>Place To show Google AdSense</h1>
    <AdsComponent dataAdSlot='X7XXXXXX5X' />
  </> */}
</div>

  );

}
