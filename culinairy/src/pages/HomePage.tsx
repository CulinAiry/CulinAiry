import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center" style={{ backgroundColor: '#243847', color: '#fff' }}>
      <h1 className="text-4xl md:text-6xl font-bold mb-8">Welcome to CulinAIry!</h1>
      <p className="text-lg mb-8">Discover new recipes with AI-powered recommendations and save your favorites.</p>
      <Link to="/new-recipe" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded mr-4">
        Get Started
      </Link>
      <Link to="/login" className="bg-transparent text-blue-500 hover:text-blue-600 font-semibold px-4 py-2 rounded">
        Log In
      </Link>
    </div>
  );
}

export default HomePage;
