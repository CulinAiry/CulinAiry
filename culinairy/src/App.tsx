import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
      <div>
        <div id="TopBar" className="flex flex-wrap items-start justify-between">
          <img src="logo.png" className="App-logo w-auto max-h-full order-1 md:order-none" alt="logo" />

          <ul className="flex flex-wrap justify-center md:justify-end w-full md:w-auto order-3 md:order-none">
            <li className="my-1 md:mx-3">
              <Link to="/">Home</Link>
            </li>
            <li className="my-1 md:mx-3 ml-6">
              <Link to="/about">About</Link>
            </li>
          </ul>

          <div className="order-2 w-full md:w-auto"></div>
        </div>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/signup" element={<Signup />} />
          <Route path="/saved-recipes" element={<SavedRecipes />} />
          <Route path="/new-recipe" element={<NewRecipe />} /> */}
        </Routes>
      </div>
    </Router >
  );
}

export default App;
