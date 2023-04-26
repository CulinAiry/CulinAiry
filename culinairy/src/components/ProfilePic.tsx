import React from 'react';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { UserState } from "../reducers/userSlice";

interface Props {
  imageUrl?: string;
  size?: number;
}

const RoundModularProfilePicture: React.FC<Props> = ({ imageUrl, size = 40 }) => {
  const loggedIn = useSelector((state: { user: UserState }) => state.user.loggedIn);

  return (
    <div className={`w-${size} h-${size} border-[2px] border-stone-700 rounded-full overflow-hidden ml-4`}>
      <Link to="/login">
        {imageUrl ? (
          <img className="w-full h-full object-cover object-center" src={imageUrl} alt="Profile pic" />
        ) : (
          !loggedIn ? (
            < div className="min-h-fit p-2 flex justify-center text-center items-center text-stone-300 text-[0.5em] sm:text-[0.9em] bg-stone-900">
              Sign In to Save Recipes
            </div>
          ) : (
            <img className="w-20 h-15 object-cover object-center" src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?20200418092106" alt="Profile pic" />
          )
        )}
      </Link>
    </div>
  );
};

export default RoundModularProfilePicture;
