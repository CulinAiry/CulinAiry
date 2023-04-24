import React from 'react';
import { Link } from "react-router-dom";

interface Props {
  imageUrl?: string;
  size?: number;
}

const RoundModularProfilePicture: React.FC<Props> = ({ imageUrl, size = 40 }) => {
  return (
    <div className={`w-${size} h-${size} border-[2px] border-stone-700 rounded-full overflow-hidden ml-4`}>
      <Link to="/login">
      {imageUrl ? (
        <img className="w-full h-full object-cover object-center" src={imageUrl} alt="Profile pic" />
      ) : (
        <div className="min-h-fit p-2 flex justify-center text-center items-center text-stone-300 text-[0.5em] sm:text-[0.9em] bg-stone-900">
          Sign In to Save Recipes
        </div>
      )}
    </Link>
    </div>
  );
};

export default RoundModularProfilePicture;
