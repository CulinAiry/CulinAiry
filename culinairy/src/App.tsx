import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import NewRecipe from "./pages/NewRecipe";
import ProfilePicture from "./components/ProfilePic";
import { useSelector, useDispatch } from "react-redux";
import { loginUser, logoutUser, UserState } from "./reducers/userSlice";
import {
  slide as SlideMenu,
  stack as StackMenu,
  elastic as ElasticMenu,
  bubble as BubbleMenu,
  push as PushMenu,
  pushRotate as PushRotateMenu,
  // scaleDown as ScaleDownMenu,
  scaleRotate as ScaleRotateMenu,
  fallDown as FallDownMenu,
  // reveal as RevealMenu
} from 'react-burger-menu';
import SavedRecipes from "./pages/savedRecipes";

function App() {
  // const dispatch = useDispatch();
  const user = useSelector((state: { user: UserState }) => state.user.user);

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [menuStyle, setMenuStyle] = useState<string>('pushRotate');

  const menuStyles: { [key: string]: any } = {
    slide: SlideMenu,
    stack: StackMenu,
    elastic: ElasticMenu,
    bubble: BubbleMenu,
    push: PushMenu,
    pushRotate: PushRotateMenu,
    scaleRotate: ScaleRotateMenu,
    fallDown: FallDownMenu
  }
  const MenuStyle = menuStyles[menuStyle]; // Get the correct menu style from the menuStyles object

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };
  useEffect(() => {
    setMenuOpen(false);
  }, [menuOpen]);

  const handleMenuStyleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    const newMenuStyle = event.target.value;
    setMenuStyle(newMenuStyle);
    setMenuOpen(true);
  };

  const [topBarHeight, setTopBarHeight] = useState(0);
  const topBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleResize() {
      if (topBarRef.current) {
        setTopBarHeight(topBarRef.current.offsetHeight);
      }
    }
    window.addEventListener('resize', handleResize);
    handleResize(); // set the initial height
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Router>
      <div>
        <div id="outer-container">
          <MenuStyle isOpen={menuOpen} id={menuStyle} pageWrapId={"page-wrap"} outerContainerId={"outer-container"}>
            <Link className="menu-item" to="/" onClick={handleMenuToggle}>
              Home
            </Link>
            <Link className="menu-item" to="/new-recipe" onClick={handleMenuToggle}>
              New Recipe
            </Link>
            <Link className="menu-item" to="/about" onClick={handleMenuToggle}>
              About
            </Link>
            <Link className="menu-item" to="/login" onClick={handleMenuToggle}>
              LogIn/LogOut
            </Link>
            <Link className="menu-item" to="/saved-recipes" onClick={handleMenuToggle}>
              Saved
            </Link>
            <select value={menuStyle} onChange={handleMenuStyleChange} className="bg-[#37444c] rounded-md text-white px-2 py-1">
              {Object.keys(menuStyles).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </MenuStyle >
        </div>

        <div id="app">

          <div id="TopBar" ref={topBarRef} className="flex justify-end items-center min-h-[60px] max-h-[100px] pl-[60px] pr-[10px] bg-[#1d2d3a] w-[100vw]">
            <div className="flex">
              <ProfilePicture imageUrl={user.photoURL} />
            </div>
            <Link className="" to="/" onClick={(e) => setMenuOpen(false)}>
              <img src="CulinairyTransBoosted_large.png" className="App-logo w-auto pl-[10px] max-h-[70px] lg:max-h-[100px] sm:my-4 mb-1 flex justify-end items-center" alt="logo" />
            </Link>
          </div>

          <div id="page-wrap" className="pt-[30px] h-auto">
            <style>
              {`
                ::-webkit-scrollbar-track-piece:start {
                  background: transparent;
                  margin-top: clamp(60px, ${topBarHeight}px, 100px);
              }
              `}
            </style>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/saved-recipes" element={<SavedRecipes />} />
              <Route path="/new-recipe" element={<NewRecipe />} />
            </Routes>
          </div>

        </div>
      </div>
    </Router>
  );
}


export default App;
