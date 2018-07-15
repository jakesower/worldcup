import React, { Component } from 'react';
import { ascend, descend, flatten, prop, sortBy, sortWith, values } from 'ramda';
import pots from '../data/2018-pots.json';

export default class ViewPots extends Component {
  constructor(props) {
    super(props);
    console.log(['A','B','C','D'].map(g => allScores(pots[g], props.matchResults)));

    this.players = props.players.map(p => ({
      player: p.player,
      bracket: JSON.parse(p.bracket),
      score: flatten(values(JSON.parse(p.bracket))).reduce((a, t) => a + countryScore(t, props.matchResults), 0),
    }));
    this.group = props.group;
    this.matchResults = props.matchResults;
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
        <div className="note">All games are in. Best possible picks:
         <br/><br/>
          Pot A: BEL (10), FRA (8)<br/>
          Pot B: ENG (5), CRO/URU (4)<br/>
          Pot C: SWE (2), DEN (1)<br/>
          Pot D: KOR (0), JPN/NGA (-1)<br/><br/>
          Best Possible Score: 29
          <br/><br/>
          Worst Picks. :)
          <br/><br/>
          Pot A: ARG (-3), POL (-3)<br/>
          Pot B: MEX (-3), PER/SUI (0)<br/>
          Pot C: EGY (-4), CRC/ISL/TUN (-3)<br/>
          Pot D: PAN (-9), KSA (-5)<br/><br/>
          Worst Possible Score: -30
        </div>
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


function allScores(group, matches) {
  return group.map(c => [c, countryScore(c, matches)]);
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
