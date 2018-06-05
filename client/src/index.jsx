import React, { Component, Fragment } from 'react';
import { chain, map } from 'ramda';
import { render } from 'react-dom';

import GameBrackets from './components/game-brackets';
import { draws, matches, teams } from './data';

const tournamentDraws = draws['2018'];
const tournamentGroups = map(
  draw => chain(d => teams[d], draw),
  tournamentDraws
);


render(
  <GameBrackets
    groups={tournamentGroups}
    matches={matches}>
  </GameBrackets>,

  document.getElementById("app")
);
