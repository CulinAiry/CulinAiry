import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import NewRecipe from "./pages/NewRecipe";

import { reveal as Menu } from 'react-burger-menu';

function App() {

  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };
  useEffect(() => {
    setMenuOpen(false);
  }, [menuOpen]);

  return (
    <Router>
      <div>
        <div id="outer-container">
          <Menu isOpen={menuOpen} id="reveal" pageWrapId={"page-wrap"} outerContainerId={"outer-container"}>
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
          </Menu>
        </div>

        <div id="page-wrap" className="bg-[#243847]">

          {/* <div id="TopBar" className="flex justify-end items-center min-h-[60px] pl-[60px] mr-[60px] z-10 bg-[#243847] fixed w-full">
            <Link className="" to="/" onClick={(e) => setMenuOpen(false)}>
              <img src="transBoostedLogo.png" className="App-logo w-auto max-h-full sm:my-4 mb-1 flex justify-end items-center" alt="logo" />
            </Link>
          </div> */}
          <div id="content" className="mt-[110px]">
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
