import React, { Component } from 'react';
import { ascend, map, prop, sort } from 'ramda';
import { populateBracketSlots } from '../lib/match-functions';
import Leaderboard from './view/bracket-leaderboard';
import Player from './view/bracket-player';
import { possibleTeamsForSlot, bracketToSlots, maxScore, minScore } from '../lib/bracket-functions';

/**
 * Each player's brackets can be represented as a range of possible scores.
 * Picking correct teams brings up the bottom end of the range, while picking
 * wrong teams lowers the top of the range. At the end of the tournament, the
 * range will contain a single number, which is the player's score.
 *
 * A bracket is essentially a collection of slots representing either a team's
 * position at the end of the group stage, or the result of a knockout round
 * game.
 *
 * Each of these slots can be in one of three states:
 *
 * - Correct: The slot has only one potential winner, and the player chose it.
 * - Possible: There are multiple ways the slot could be resolved, and the
 *   player's choice is among them.
 * - Incorrect: The player's choice is or cannot be correct.
 *
 * Knockout games either have a result, or potential results, which are the
 * results from earlier knockout games, or from group results.
 */


const byPlayer = ascend(prop('player'));
const zomg = (bracket, tournamentGroups) => {
  const popd = populateBracketSlots(JSON.parse(bracket), tournamentGroups);
  return bracketToSlots(popd);
}

export default class ViewBrackets extends Component {
  constructor(props) {
    super(props);

    const teamsByGroup = map(map(prop('abbreviation')))(props.tournamentGroups);
    this.slotResults = map(s => possibleTeamsForSlot(props.slots, props.matchResults, teamsByGroup, s.id))(props.slots);
    console.log(this.slotResults);

    this.players = props.players.map((p, i) => ({
      id: i,
      player: p.player,
      bracket: populateBracketSlots(JSON.parse(p.bracket), props.tournamentGroups),
      minScore: minScore(props.slots, props.matchResults, teamsByGroup, zomg(p.bracket, props.tournamentGroups)),
      maxScore: maxScore(props.slots, props.matchResults, teamsByGroup, zomg(p.bracket, props.tournamentGroups)),
    }));
    this.group = props.group;
    this.slots = props.slots;

    this.state = {
      view: {
        mode: "leaderboard",
      }
    }
  }


  render() {
    const setView = v => this.setState({ view: v });

    return <div className="app-wrapper">
      <h1>{this.group.replace(/[-_]/, ' ')}</h1>
      <nav>
        <h2
          className={this.state.view.mode === 'leaderboard' ? 'selected' : ''}
          style={{ color: '#D30208' }}
          onClick={ () => setView({ mode: 'leaderboard' })}
        >
          Leaderboard
        </h2>
        {sort(byPlayer, this.players).map(player =>
          <h2
            key={player.player}
            className={this.state.view.activePlayer === player.id ? 'selected' : ''}
            onClick={ () => setView({ mode: 'player', activePlayer: player.id })}
          >
            {player.player}
          </h2>
        )}
      </nav>
      <main>
        { this.state.view.mode === 'leaderboard' ? this.viewLeaderboard() : this.viewPlayer() }
      </main>
    </div>
  }


  viewLeaderboard() {
    return <Leaderboard players={this.players} slotResults={this.slotResults} />
  }


  viewPlayer() {
    const p = this.players.find(p => p.id === this.state.view.activePlayer);
    return <Player slots={ this.slots } slotResults={ this.slotResults } bracket={ p.bracket } />;
  }
}
