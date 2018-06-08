import React from 'react';

export default ({ match, bracket, handleTeamClick }) => {
  const { home, away } = match;
  const isWinner = t => bracket[`Winner of ${match.name}`].name === t.name;

  return (
    <main className="flags">
      <div className="country" onClick={() => handleTeamClick('home')}>
        <div className={`flag ${bracket[home].abbreviation}`}/>
        <div className="inner-country">
          <h1>{bracket[home].name}</h1>
          { isWinner(bracket[home]) ? <div className="rank"> </div> : '' }
        </div>
      </div>
      <div className="country" onClick={() => handleTeamClick('away')}>
        <div className={`flag ${bracket[away].abbreviation}`}/>
        <div className="inner-country">
          <h1>{bracket[away].name}</h1>
          { isWinner(bracket[away]) ? <div className="rank"> </div> : '' }
        </div>
      </div>
    </main>
  );
};
