import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import './indexChallenge.css'
import App from './App';
import ChallengeCurrencyConv from './ChallengeCurrencyConv';
import ChallengeGeolocation from './ChallengeGeolocation';
// import StarRating from './StarRating';
// import AppChallenge from './AppChallenge';

// const Test = () => {

//   const [movieRating, setMovieRating] = useState(0);

//   return (
//     <div>
//       <StarRating 
//         maxRating={8} 
//         onSetRating={setMovieRating}
//       />
//       <p>This movie is rated {movieRating} </p>
//     </div>
//   )
// }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <StarRating 
      maxRating={5} 
      messages={["Terrible", "Bad", "Average", "Good", "Amazing"]}
      defaultRating={3}
    />
    <StarRating maxRating={10} color="blue" size={20} className="test" />
    <Test /> */}
    {/* <AppChallenge /> */}
    {/* <App /> */}
    {/* <ChallengeCurrencyConv /> */}
    <ChallengeGeolocation />
  </React.StrictMode>
);
