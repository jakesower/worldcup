import React from 'react';

export default ({ teams, rankings, handleTeamClick }) => {
  const markup = teams.map(t => {
    const rank = rankings.indexOf(t.team);
    const rankMarkup = (rank > -1) ? (<div className="rank">{rank + 1}</div>) : '';

    return (
      <div key={t.team} className={`country flag ${t.abbreviation}`} onClick={() => handleTeamClick(t.team)}>
        <div className="inner-country">
          <h1>{t.team}</h1>
          {rankMarkup}
        </div>
      </div>
    )
  })

  return ( <main>
    {markup}
  </main> )
};
