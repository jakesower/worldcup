import React from 'react';

export default ({ match, bracket, handleTeamClick }) => {
  const { home, away } = match;
  const winnerMarkup = <div className="rank"> </div>;
  const isWinner = t => bracket[`Winner of ${match.name}`].name === t.name;
  // const x = bracket[`Winner of ${match.name}`];
  // console.log({bracket, match, x})

  return (
    <main className="stack-flags">
      <div className={`country flag ${bracket[home].abbreviation}`} onClick={() => handleTeamClick('home')}>
        <div className="inner-country">
          <h1>{bracket[home].name}</h1>
          { isWinner(bracket[home]) ? <div className="rank"> </div> : '' }
        </div>
      </div>
      <div className={`country flag ${bracket[away].abbreviation}`} onClick={() => handleTeamClick('away')}>
        <div className="inner-country">
          <h1>{bracket[away].name}</h1>
          { isWinner(bracket[away]) ? <div className="rank"> </div> : '' }
        </div>
      </div>
    </main>
  );
};
