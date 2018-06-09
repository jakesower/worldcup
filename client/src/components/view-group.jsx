import React from 'react';

export default ({ teams, rankings, handleTeamClick }) => {
  const markup = teams.map((t, idx) => {
    const rank = rankings.indexOf(idx);
    const rankMarkup = (rank > -1) ? (
      <div className="rank-container">
        <div className="rank">{rank + 1}</div>
      </div>
    ) : '';

    return (
      <div key={t.name} className="country" onClick={() => handleTeamClick(idx)}>
        <div className={`flag ${t.abbreviation}`}/>
        <div className="inner-country">
          <h1>{t.name}</h1>
          {rankMarkup}
        </div>
      </div>
    )
  })

  return ( <main className="flags">
    {markup}
  </main> )
};
