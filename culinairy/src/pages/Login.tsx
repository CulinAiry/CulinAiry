import { auth } from "../firebase";
import { useSelector, useDispatch } from "react-redux";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
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
    <div className="text-center">
      <div id="notification-popup"></div>
      {loggedIn !== undefined && !loggedIn && (
        <div id="logIn">
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
      {/* <>
        <h1>Place To show Google AdSense</h1>
        <AdsComponent dataAdSlot='X7XXXXXX5X' />
      </> */}
    </div>
  );

}
