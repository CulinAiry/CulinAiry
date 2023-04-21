import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import NewRecipe from "./pages/NewRecipe";
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

function App() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [menuStyle, setMenuStyle] = useState<string>('scaleRotate');

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
              Login
            </Link>
            <Link className="menu-item" to="/signup" onClick={handleMenuToggle}>
              Signup
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
            <Link className="" to="/" onClick={(e) => setMenuOpen(false)}>
              <img src="CulinairyTransBoosted_large.png" className="App-logo w-auto pl-[10px] max-h-[70px] md:max-h-[100px] sm:my-4 mb-1 flex justify-end items-center" alt="logo" />
            </Link>
          </div>

          <div id="page-wrap" className="pt-[30px] h-auto">
            <style>
              {`
                :root {
                  --log-value: calc(1 + var(--log-base) * log(100vw / var(--log-divisor)));
                }
                ::-webkit-scrollbar {
                  width: 1.5vh;
                  scroll-behavior: smooth;
                }
                ::-webkit-scrollbar-thumb {
                  background-color: #476f9d;
                }
                ::-webkit-scrollbar-button {
                  display: none;
                }
                ::-webkit-scrollbar-track {
                  background-color: #1d2d3a;
                }
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
              {/* <Route path="/signup" element={<Signup />} />
          <Route path="/saved-recipes" element={<SavedRecipes />} /> */}
              <Route path="/new-recipe" element={<NewRecipe />} />
            </Routes>
          </div>

        </div>
      </div>
    </Router>
  );
}


export default App;
