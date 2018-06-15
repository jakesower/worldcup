import React from 'react';
import { chain, map } from 'ramda';
import { render } from 'react-dom';

import GameBrackets from './components/game-brackets';
import GamePools from './components/game-pots';
import ViewBrackets from './components/view-brackets';
import { draws, matches, teams } from './data';
import pots from './data/2018-pots.json'
import ViewPots from './components/view-pots';

const tournamentDraws = draws['2018'];
const tournamentGroups = map(
  draw => chain(d => teams[d], draw),
  tournamentDraws
);
const tournamentPools = map(
  draw => chain(d => teams[d], draw),
  pots
);

const config = window.worldcup;
const matchResults = [
  { id: 1, homeTeam: 'rus', awayTeam: 'ksa', homeScore: 5, awayScore: 0 }
];

const base = false ?
  (window.worldcup.game === 'brackets' ? brackets() : potGame()) :
  (window.worldcup.game === 'brackets' ? viewBrackets() : viewPots());



render(base, document.getElementById("app"));


function brackets() {
  return <GameBrackets
    groups={tournamentGroups}
    matches={matches}>
  </GameBrackets>
}


function potGame() {
  return <GamePools
    pots={tournamentPools}
  >
  </GamePools>
}


function viewBrackets() {
  return <ViewBrackets
    group={config.group}
    players={config.players}
    tournamentGroups={tournamentGroups}
  />
}

function viewPots() {
  return <ViewPots
    group={config.group}
    players={config.players}
    tournamentPools={tournamentPools}
    matchResults={matchResults}
  />
}
