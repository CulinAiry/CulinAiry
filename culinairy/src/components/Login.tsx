import { auth } from "../firebase";
// import { useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  // onAuthStateChanged
} from 'firebase/auth';

export default function Login() {
  // const [authLoaded, setAuthLoaded] = useState(false);

  // useEffect(() => {
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       setAuthLoaded(true);
  //     } else {
  //       setAuthLoaded(false);
  //     }
  //   });
  // }, []);

  const googleProvider = new GoogleAuthProvider();
  const gitProvider = new GithubAuthProvider();


  const googleSignUp = () => {
    signInWithPopup(auth, googleProvider)
      .then((res) => {
        console.log(res);
      })
  }

  const gitSignUp = () => {
    signInWithPopup(auth, gitProvider)
      .then((res) => {
        console.log(res);
      })
  }

  return (
    <div>
      <button type="button" onClick={gitSignUp}>Sign up with GitHub</button>
      <button type="button" onClick={googleSignUp}>Sign up with Google</button>
    </div>
  );
}
