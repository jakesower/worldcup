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
  { id: 1, homeTeam: 'rus', awayTeam: 'ksa', homeScore: 5, awayScore: 0 },
  { id: 2, homeTeam: 'egy', awayTeam: 'uru', homeScore: 0, awayScore: 1 },
  { id: 3, homeTeam: 'por', awayTeam: 'esp', homeScore: 3, awayScore: 3 },
  { id: 4, homeTeam: 'mar', awayTeam: 'irn', homeScore: 0, awayScore: 1 },
  { id: 5, homeTeam: 'fra', awayTeam: 'aus', homeScore: 2, awayScore: 1 },
  { id: 6, homeTeam: 'arg', awayTeam: 'isl', homeScore: 1, awayScore: 1 },
  { id: 7, homeTeam: 'per', awayTeam: 'den', homeScore: 0, awayScore: 1 },
  { id: 8, homeTeam: 'cro', awayTeam: 'nga', homeScore: 2, awayScore: 0 },
  { id: 9, homeTeam: 'crc', awayTeam: 'srb', homeScore: 0, awayScore: 1 },
  { id: 10, homeTeam: 'bra', awayTeam: 'sui', homeScore: 1, awayScore: 1 },
  { id: 11, homeTeam: 'ger', awayTeam: 'mex', homeScore: 0, awayScore: 1 },
  { id: 12, homeTeam: 'swe', awayTeam: 'kor', homeScore: 1, awayScore: 0 },
  { id: 13, homeTeam: 'bel', awayTeam: 'pan', homeScore: 3, awayScore: 0 },
  { id: 14, homeTeam: 'tun', awayTeam: 'eng', homeScore: 1, awayScore: 2 },
  { id: 15, homeTeam: 'col', awayTeam: 'jpn', homeScore: 1, awayScore: 2 },
  { id: 16, homeTeam: 'pol', awayTeam: 'sen', homeScore: 1, awayScore: 2 },
  { id: 17, homeTeam: 'rus', awayTeam: 'egy', homeScore: 3, awayScore: 1 },
  { id: 18, homeTeam: 'uru', awayTeam: 'ksa', homeScore: 1, awayScore: 0 },
  { id: 19, homeTeam: 'por', awayTeam: 'mar', homeScore: 1, awayScore: 0 },
  { id: 19, homeTeam: 'irn', awayTeam: 'esp', homeScore: 0, awayScore: 1 },
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
