import React, { Component } from 'react';
import { ascend, descend, flatten, prop, sortBy, sortWith, values } from 'ramda';

export default class ViewPots extends Component {
  constructor(props) {
    super(props);

    this.players = props.players.map(p => ({
      player: p.player,
      bracket: JSON.parse(p.bracket),
      score: flatten(values(JSON.parse(p.bracket))).reduce((a, t) => a + countryScore(t, props.matchResults), 0),
    }));
    this.group = props.group;
    this.matchResults = props.matchResults;
    console.log(props)
  }


  render() {
    const byPlayer = ascend(prop('player'));
    const byScore = descend(prop('score'));

    const potList = pot => {
      const teams = sortBy(x => x, pot);
      return <div>
        <ul className="pot-list">
          <li>{ `${teams[0]}: ${countryScore(teams[0], this.matchResults)}` }</li>
          <li>{ `${teams[1]}: ${countryScore(teams[1], this.matchResults)}` }</li>
        </ul>
      </div>
    }

    return <div className="app-wrapper">
      <h1>{this.group.replace(/[-_]/, ' ')}</h1>
      <main>
        <div className="note">Last games uploaded: MEX 0 - 3 SWE / KOR 2 - 0 GER</div>
        <div className="note">I do my best to keep these scores current, but they may lag. Expect spoilers when checking this page.</div>
        <div className="note">Rule Clarification: During knockout round matches, only goals scored during regulation will be counted.</div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Score</th>
              <th>Pot A</th>
              <th>Pot B</th>
              <th>Pot C</th>
              <th>Pot D</th>
            </tr>
          </thead>
          <tbody>
            {sortWith([byScore, byPlayer], this.players).map(player =>
              <tr key={player.player}>
                <td>{player.player}</td>
                <td className="numeric">{player.score}</td>
                <td>{potList(player.bracket['A'])}</td>
                <td>{potList(player.bracket['B'])}</td>
                <td>{potList(player.bracket['C'])}</td>
                <td>{potList(player.bracket['D'])}</td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  }
}


function countryScore(country, matches) {
  return matches.reduce(
    (acc, match) => {
      if (match.homeTeam === country) {
        return acc + (match.homeScore - match.awayScore);
      }
      else if (match.awayTeam === country) {
        return acc + (match.awayScore - match.homeScore);
      }
      else {
        return acc;
      }
    },
    0
  );
}
