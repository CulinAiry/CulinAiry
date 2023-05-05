import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center" style={{ backgroundColor: '#243847', color: '#fff' }}>
      <h1 className="text-4xl md:text-6xl font-bold mb-8">Welcome to CulinAIry!</h1>
      <p className="text-lg mb-8">Discover new recipes with AI-powered recommendations and save your favorites.</p>
      <Link to="/new-recipe" className="hyper font-bold py-2 px-7 sm:text-lg sm:py-3 sm:px-6 md:text-xl md:py-4 md:px-8 lg:text-2xl lg:py-5 lg:px-10">
        Get Started
      </Link>
    </div>
  );
}

export default HomePage;
