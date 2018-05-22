import React from 'react';

export default ({ match, bracket, handleTeamClick }) => {
  const { home, away } = match;
  // console.log({match, bracket});
  // console.log(bracket[home].name)

  // const markup = teams.map(t => {
  //   const winnerMarkup = (t === winner) ? (<div className="rank">✓</div>) : '';

  //   return (
  //     <div key={t.team} className={`country flag ${t.abbreviation}`} onClick={() => handleTeamClick(t.team)}>
  //       <div className="inner-country">
  //         <h1>{t.team}</h1>
  //         {winnerMarkup}
  //       </div>
  //     </div>
  //   )
  // })

  return (
    <main className="stack-flags">
      <div className={`country flag ${bracket[home].abbreviation}`} onClick={() => handleTeamClick('home')}>
        <div className="inner-country">
          <h1>{bracket[home].name}</h1>
        </div>
      </div>
      <div className={`country flag ${bracket[away].abbreviation}`} onClick={() => handleTeamClick('away')}>
        <div className="inner-country">
          <h1>{bracket[away].name}</h1>
        </div>
      </div>
    </main>
  );
};
