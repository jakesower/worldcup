import React from 'react';

export default ({ teams, winner, handleTeamClick }) => {
  const markup = teams.map(t => {
    const winnerMarkup = (t === winner) ? (<div className="rank">✓</div>) : '';

    return (
      <div key={t.team} className={`country flag ${t.abbreviation}`} onClick={() => handleTeamClick(t.team)}>
        <div className="inner-country">
          <h1>{t.team}</h1>
          {winnerMarkup}
        </div>
      </div>
    )
  })

  return ( <main>
    {markup}
  </main> )
};
