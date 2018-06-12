import React from 'react';
import { chain, map } from 'ramda';
import { render } from 'react-dom';

import GameBrackets from './components/game-brackets';
import GamePools from './components/game-pots';
import { draws, matches, teams } from './data';
import pots from './data/2018-pots.json'

const tournamentDraws = draws['2018'];
const tournamentGroups = map(
  draw => chain(d => teams[d], draw),
  tournamentDraws
);
const tournamentPools = map(
  draw => chain(d => teams[d], draw),
  pots
)


render(
  (window.worldcup.game === 'brackets' ? brackets() : potGame()),
  document.getElementById("app")
);


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
