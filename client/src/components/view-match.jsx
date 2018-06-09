import React from 'react';

export default ({ match, bracket, handleTeamClick }) => {
  const { home, away } = match;
  const isWinner = t => bracket[`Winner of ${match.name}`].name === t.name;
  const winnerMarkup = <div className="rank-container">
    <div className="rank">✔</div>
  </div>


  return (
    <main className="flags">
      <div className="country" onClick={() => handleTeamClick('home')}>
        <div className={`flag ${bracket[home].abbreviation}`}/>
        <div className="inner-country">
          <h1>{bracket[home].name}</h1>
          { isWinner(bracket[home]) ? winnerMarkup : '' }
        </div>
      </div>
      <div className="country" onClick={() => handleTeamClick('away')}>
        <div className={`flag ${bracket[away].abbreviation}`}/>
        <div className="inner-country">
          <h1>{bracket[away].name}</h1>
          { isWinner(bracket[away]) ? winnerMarkup : '' }
        </div>
      </div>
    </main>
  );
};
