import React from 'react';
import { chain, map } from 'ramda';
import { render } from 'react-dom';

import GameBrackets from './components/game-brackets';
import GamePools from './components/game-pots';
import ViewBrackets from './components/view-brackets';
import { draws, matches, teams } from './data';
import { populateBracketSlots } from './lib/match-functions';
import pots from './data/2018-pots.json'

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

const hydratedPlayers = config.players.map((p, i) => ({
  id: i,
  player: p.player,
  bracket: populateBracketSlots(JSON.parse(p.bracket), tournamentGroups),
  score: 0,
}));

const base = false ?
  (window.worldcup.game === 'brackets' ? brackets() : potGame()) :
  (window.worldcup.game === 'brackets' ? viewBrackets() : viewPot());


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
    players={hydratedPlayers}
  />
}
