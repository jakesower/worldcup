import React from 'react';

export default ({ teams, rankings, handleTeamClick }) => {
  const markup = teams.map((t, idx) => {
    const rank = rankings.indexOf(idx);
    const rankMarkup = (rank > -1) ? (<div className="rank">{rank + 1}</div>) : '';

    return (
      <div key={t.name} className={`country flag ${t.abbreviation}`} onClick={() => handleTeamClick(idx)}>
        <div className="inner-country">
          <h1>{t.name}</h1>
          {rankMarkup}
        </div>
      </div>
    )
  })

  return ( <main className="stack-flags">
    {markup}
  </main> )
};
