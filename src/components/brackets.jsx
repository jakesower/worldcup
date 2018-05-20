import React from 'react';
import { groupBy, prop, values } from 'ramda';
import { teamData } from '../team-data';
import { knockoutMatches } from '../lib/match-functions';

const groups = values(groupBy(prop('group'), teamData));
const teamLookup = groupBy(t => t.team, teamData);

export default ({ selected, setViewing, groupRankings }) => {
  function groupPhase() {
    return groups.map(g => {
      const groupId = g[0].group;
      const rankings = groupRankings[groupId];

      const groupTeams = g.map(t => {
        const rank = rankings.indexOf(t.team);
        const rankMarkup = (rank > -1) ? (<span className="rank">{rank + 1}</span>) : '';
        return (
          <div className="team" key={t.team} onClick={() => setViewing({ mode: 'group', group: groupId})}>
            <span className="name">{t.team}</span>
            {rankMarkup}
          </div>
        );
      });

      return (
        <div key={groupId} className={`group${selected === groupId ? " selected" : ""}`}>
          <h1>Group {groupId}</h1>
          {groupTeams}
        </div>
      );
    });
  }


  function knockoutPhase() {
    const matches = knockoutMatches(groupRankings);
    const matchId = 1;
    console.log(matches)

    return matches.map(match => {
      const [t1, t2] = match.teams.map(prop(teamLookup));
      return (
        <div
          key={match.matchId}
          className={`group${selected === matchId ? " selected" : ""}`}
          onClick={() => setViewing({ mode: 'match', match })}
          >
          <h3>{`Match ${match.matchId}`}</h3>
          <div className="team">
            <span className="name">{t1.team}</span>
          </div>
          <div className="team">
            <span className="name">{t2.team}</span>
          </div>
        </div>
      );

    })
  }


  return (
    <nav>
      <h2>Group Phase</h2>
      {groupPhase()}
      <h2>Round of 16</h2>
      {/* {knockoutPhase()} */}
      <h2>Quarterfinals</h2>
      <h2>Semifinals</h2>
      <h2>Match for 3rd Place</h2>
      <h2>Final</h2>
    </nav>
  );

};

