import React, { Fragment } from 'react';
import matches from '../../data/matches';
import { ascend, descend, prop, sortWith } from 'ramda';

const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];


export default ({ slots, bracket, slotResults }) => {
  function slotMarkup(slotId, team) {
    const slot = slots[slotId];
    const res = slotResults[slotId];
    const right = res.length === 1 && res.includes(team.abbreviation);
    const wrong = !res.includes(team.abbreviation);
    const c = right ? "right" : (wrong ? "wrong" : "");
    const pointsMarkup = right ? `+${slot.points} pts` : (wrong ? `-${slot.points} pts` : '');

    return <span className={c}><span className="team-name">{ team.name }</span> <span className="points">{ pointsMarkup }</span></span>
  }

  function koMatch(matchName, slotId) {
    const match = matches.find(m => m.name === matchName);
    const home = bracket[match.home].name;
    const away = bracket[match.away].name;
    const w = bracket[`Winner of ${match.name}`].name;

    const homeMarkup = w === home ? slotMarkup(slotId, bracket[match.home]) : home;
    const awayMarkup = w === away ? slotMarkup(slotId, bracket[match.away]) : away;

    return <div>
      <div className="inner">
        <div className="match">
          <div><span className={w === home ? "winner" : 'loser'}>{ homeMarkup }</span></div>
          <div><span className={w === away ? "winner" : 'loser'}>{ awayMarkup }</span></div>
        </div>
      </div>
    </div>
  }

  return <div className="bracket-stages">
    <div className="stage">
      <h1>Group Stage</h1>
      <div className="inner">
        {groups.map(g => {
          return <Fragment key={g}>
            <h2>{`Group ${g}`}</h2>
            <ol>
              <li>{slotMarkup(`${g}1`, bracket[`${g}1`])}</li>
              <li>{slotMarkup(`${g}2`, bracket[`${g}2`])}</li>
            </ol>
          </Fragment>
        })}
      </div>
    </div>

    <div className="stage">
      <h1>Round of 16</h1>
      { koMatch('Ro16 1', 'Ro16-1') }
      { koMatch('Ro16 2', 'Ro16-2') }
      { koMatch('Ro16 3', 'Ro16-3') }
      { koMatch('Ro16 4', 'Ro16-4') }
      { koMatch('Ro16 5', 'Ro16-5') }
      { koMatch('Ro16 6', 'Ro16-6') }
      { koMatch('Ro16 7', 'Ro16-7') }
      { koMatch('Ro16 8', 'Ro16-8') }
    </div>

    <div className="stage">
      <h1>Quarterfinals</h1>
      { koMatch('Quarter 1', 'QF-1') }
      { koMatch('Quarter 2', 'QF-2') }
      { koMatch('Quarter 3', 'QF-3') }
      { koMatch('Quarter 4', 'QF-4') }
    </div>

    <div className="stage">
      <h1>Semifinals</h1>
      { koMatch('Semi 1', 'SF-1') }
      { koMatch('Semi 2', 'SF-2') }
    </div>

    <div className="stage">
      <h1>Third Place</h1>
      { koMatch('Match for Third Place', 'Third') }
    </div>

    <div className="stage">
      <h1>Final</h1>
      { koMatch('Final', 'Final') }
    </div>
  </div>;
};
