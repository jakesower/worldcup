import React, { Component } from 'react';
import { ascend, lensPath, prop, set, sort } from 'ramda';
import Leaderboard from './view/bracket-leaderboard';
import Player from './view/bracket-player';

const byPlayer = ascend(prop('player'));

export default class ViewBrackets extends Component {
  constructor(props) {
    super(props);
    this.players = props.players;
    this.group = props.group;

    this.state = {
      view: {
        mode: "player", activePlayer: 1,
        // mode: "leaderboard",
      }
    }
    console.log(props)
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
    return <Leaderboard players={this.players} />
  }


  viewPlayer() {
    console.log({p: this.players, s: this.state})
    const p = this.players.find(p => p.id === this.state.view.activePlayer);
    return <Player player={ p.player } bracket={ p.bracket } />;
  }
}
