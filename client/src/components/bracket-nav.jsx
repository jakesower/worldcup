import React, { Fragment } from 'react';
import { mapObjIndexed, range } from 'ramda';
import { matches } from '../data'; // TODO
import { populateBracketSlots } from '../lib/match-functions';

const points = { 'Group': 2, 'Ro16': 3, 'Quarter': 5, 'Semi': 8, 'Third': 1, 'Final': 13 };
const phaseSize = { 'Ro16': 8, 'Quarter': 4, 'Semi': 2 };

const stages = ['Group', 'Ro16', 'Quarter', 'Semi', 'Third', 'Final', 'Submit Bracket'];
const pluralStages = ['Group', 'Quarter', 'Semi'];

export default ({ viewing, setViewing, selectedNavViewing, setNavViewing, bracket, teamGroups }) => {
  const bracketSlots = populateBracketSlots(bracket, teamGroups);
  const prevStage = stages[stages.indexOf(selectedNavViewing) - 1];
  const nextStage = stages[stages.indexOf(selectedNavViewing) + 1];
  const changeStage = stage => {
    const d = (stage === 'Group') ? { mode: 'group', group: 'A' }
            : (stage === 'Third') ? { mode: 'match', matchName: 'Match for Third Place' }
            : (stage === 'Final') ? { mode: 'match', matchName: 'Final' }
                                  : { mode: 'match', matchName: `${stage} 1` };
    setViewing(d);
    setNavViewing(stage);
  }

  const stageTitle = s => s === 'Third' ? 'Third'
                        : s === 'Ro16' ? 'Round of 16'
                        : pluralStages.includes(s) ? `${s}s`
                        : s;

  const prevMarkup = <div
    className="group"
    onClick={() => changeStage(prevStage)}
    >
    <h1>{prevStage ? `« ${stageTitle(prevStage)}` : '&nbsp;'}</h1>
  </div>

  const nextMarkup = <div
    className="group"
    onClick={() => changeStage(nextStage)}
    >
    <h1>{nextStage ? `${stageTitle(nextStage)} »` : '&nbsp;'}</h1>
  </div>

  const pts = points[selectedNavViewing];

  // return <nav>
  //   { prevStage ? prevMarkup : '' }
  //   {getNav()}
  //   { nextStage ? nextMarkup : '' }
  // </nav>

  return <Fragment>
    <nav className="titleNav">
      <h1 className="nobr">{ prevStage ? prevMarkup : '' }</h1>
      <div className="group">
        <h1>
          <span className="nobr">{ `${stageTitle(selectedNavViewing)} ` }</span>
          <span className="nobr">{ `(${pts} pt${pts === 1 ? '' : 's'})` }</span>
        </h1>
      </div>
      <h1 className="nobr">{ nextStage ? nextMarkup : '' }</h1>
    </nav>
    <nav>
      {getNav()}
    </nav>
  </Fragment>



  function getNav() {
    switch(selectedNavViewing) {
      case "Group":
        return <Fragment>
          {groupPhase()}
        </Fragment>
      case "Ro16":
      case "Quarter":
      case "Semi":
        return knockoutPhase(selectedNavViewing);
    }
  }


  function groupPhase() {
    return Object.values(mapObjIndexed((teams, g) => {
      const rankings = bracket.groups[g];
      const winner = teams[rankings[0]] || {};
      const runnerUp = teams[rankings[1]] || {};

      return (
        <div className="nav-heading-wrapper" key={g}>
          <div
            className={`group${viewing.group === g ? " selected" : ""}`}
            onClick={() => setViewing({ mode: 'group', group: g })}
            >
            <h1>{g}</h1>
            <div className="group-winners">
              <div>{ winner.abbreviation || '' }</div>
              <div>{ runnerUp.abbreviation || '' }</div>
            </div>
          </div>
        </div>
      );
    }, teamGroups));
  }

  function knockoutPhase(phase) {
    const matchesInPhase = phaseSize[phase];
    return range(0, matchesInPhase).map(idx => {
      const matchName = `${phase} ${idx+1}`;
      const match = matches.find(m => m.name === matchName);

      return knockoutMatch(match, viewing.matchName === matchName, idx);
    });
  }

  // function thirdPhase() {
  //   const third = matches.find(m => m.name === 'Match for Third Place');
  //   return knockoutMatch(third, viewing.matchName === 'Match for Third Place', 0);
  // }

  // function finalPhase() {
  //   const final = matches.find(m => m.name === 'Final');
  //   return knockoutMatch(final, viewing.matchName === 'Final', 0);
  // }

  function knockoutMatch(match, isSelected, idx) {
    const unk = x => x === 'unknown' ? '???' : x;
    const winner = bracket.knockout[match.name];
    const homeState = (winner === 'home') ? ' winner' : (winner === 'away' ? ' loser' : '');
    const awayState = (winner === 'away') ? ' winner' : (winner === 'home' ? ' loser' : '');
    const homeName = unk(bracketSlots[match.home].abbreviation);
    const awayName = unk(bracketSlots[match.away].abbreviation);

    return (
      <div
        key={idx}
        className={`team group${isSelected ? " selected" : ""}`}
        onClick={() => setViewing({ mode: 'match', matchName: match.name })}
        >
        <h1 className={`name${homeState}`}>{homeName}</h1>
        <h1 style={{ textTransform: 'lowercase', opacity: 0.5 }}>&nbsp;v&nbsp;</h1>
        <h1 className={`name${awayState}`}>{awayName}</h1>
      </div>
    );
  }
}
