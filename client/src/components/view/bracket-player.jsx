import React, { Fragment } from 'react';
import matches from '../../data/matches';
import { ascend, descend, prop, sortWith } from 'ramda';

const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];


export default ({ player, bracket }) => {
  function koMatch(matchName) {
    const match = matches.find(m => m.name === matchName);
    const home = bracket[match.home].name;
    const away = bracket[match.away].name;
    const w = bracket[`Winner of ${match.name}`].name;

    return <div>
      <div className="inner">
        <div className="match">
          <div><span className={w === home ? "winner" : 'loser'}>{ home }</span></div>
          <div><span className={w === away ? "winner" : 'loser'}>{ away }</span></div>
        </div>
      </div>
    </div>
  }

  return <div className="bracket-stages">
    <div className="stage">
      <h1>Group Stage</h1>
      <div className="inner">
        {groups.map(g =>
          <Fragment key={g}>
            <h2>{`Group ${g}`}</h2>
            <ol>
              <li>{bracket[`${g}1`].name}</li>
              <li>{bracket[`${g}2`].name}</li>
            </ol>
          </Fragment>
        )}
      </div>
    </div>

    <div className="stage">
      <h1>Round of 16</h1>
      { koMatch('Ro16 1') }
      { koMatch('Ro16 2') }
      { koMatch('Ro16 3') }
      { koMatch('Ro16 4') }
      { koMatch('Ro16 5') }
      { koMatch('Ro16 6') }
      { koMatch('Ro16 7') }
      { koMatch('Ro16 8') }
    </div>

    <div className="stage">
      <h1>Quarterfinals</h1>
      { koMatch('Quarter 1') }
      { koMatch('Quarter 2') }
      { koMatch('Quarter 3') }
      { koMatch('Quarter 4') }
    </div>

    <div className="stage">
      <h1>Semifinals</h1>
      { koMatch('Semi 1') }
      { koMatch('Semi 2') }
    </div>

    <div className="stage">
      <h1>Third Place</h1>
      { koMatch('Match for Third Place') }
    </div>

    <div className="stage">
      <h1>Final</h1>
      { koMatch('Final') }
    </div>
  </div>;
};
