import React from 'react';
import { groupBy, is, mapObjIndexed, prop, range, values } from 'ramda';
import { matches } from '../data'; // TODO
import { populateBracketSlots } from '../lib/match-functions';

export default ({ selected, setViewing, bracket, teamGroups }) => {
  const bracketSlots = populateBracketSlots(bracket, teamGroups);

  function groupPhase() {
    return Object.values(mapObjIndexed((teams, g) => {
      const rankings = bracket.groups[g];

      const groupTeams = teams.map((t, tIdx) => {
        const rank = rankings.indexOf(tIdx);
        const rankMarkup = (rank > -1) ? (<span className="rank">{rank + 1}</span>) : '';
        return (
          <div className="team" key={t.name} onClick={() => setViewing({ mode: 'group', group: g })}>
            <span className="name">{t.name}</span>
            {rankMarkup}
          </div>
        );
      });

      return (
        <div key={g} className={`group${selected === g ? " selected" : ""}`}>
          <h1>Group {g}</h1>
          {groupTeams}
        </div>
      );
    }, teamGroups));
  }


  function knockoutPhase(phase, matchesInPhase) {
    return range(0, matchesInPhase).map(idx => {
      const matchName = `${phase} ${idx+1}`;
      const match = matches.find(m => m.name === matchName);

      return knockoutMatch(match, selected === idx, idx);
    });
  }

  function knockoutMatch(match, isSelected, idx) {
    const winner = bracket.knockout[match.name];
    const winnerMarkup = <span className="rank">✔</span>;

    return (
      <div
        key={idx}
        className={`group${isSelected ? " selected" : ""}`}
        onClick={() => setViewing({ mode: 'match', matchName: match.name })}
        >
        <div className="team">
          <span className="name">{bracketSlots[match.home].name}</span>
            { winner === 'home' ? winnerMarkup : '' }
        </div>
        <div className="team">
          <span className="name">{bracketSlots[match.away].name}</span>
          { winner === 'away' ? winnerMarkup : '' }
        </div>
      </div>
    );
  }


  const third = matches.find(m => m.name === 'Match for Third Place');
  const final = matches.find(m => m.name === 'Final');

  return (
    <nav>
      <h2>Group Phase</h2>
      <h3>2pts for 1st; 2pts for 2nd</h3>
      {groupPhase()}
      <h2>Round of 16</h2>
      <h3>3pts</h3>
      {knockoutPhase('Octo', 8)}
      <h2>Quarterfinals</h2>
      <h3>5pts</h3>
      {knockoutPhase('Quarter', 4)}
      <h2>Semifinals</h2>
      <h3>8pts</h3>
      {knockoutPhase('Semi', 2)}
      <h2>Match for 3rd Place</h2>
      <h3>1pt</h3>
      {knockoutMatch(third, false)}
      <h2>Final</h2>
      <h3>13pts</h3>
      {knockoutMatch(final, false)}
    </nav>
  );

};

