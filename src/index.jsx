import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { lensPath, set } from 'ramda';

import { teamData } from './team-data';
import ViewGroup from './components/view-group.jsx';
import ViewMatch from './components/view-match.jsx';
import Brackets from './components/brackets.jsx';

class WCApp extends Component {
  constructor() {
    super();

    this.state = {
      viewing: {
        mode: "group",
        group: "A",
      },
      groupRankings: {
        A: [],
        B: [],
        C: [],
        D: [],
        E: [],
        F: [],
        G: [],
        H: [],
      },
      knockoutWinners: {
        "octos-1": null,
        "octos-2": null,
        "octos-3": null,
        "octos-4": null,
        "octos-5": null,
        "octos-6": null,
        "octos-7": null,
        "octos-8": null,
        "quarters-1": null,
        "quarters-2": null,
        "quarters-3": null,
        "quarters-4": null,
        "semis-1": null,
        "semis-2": null,
        third: null,
        final: null,
      }
    }
  }


  viewGroup() {
    const { viewing } = this.state;
    const groupTeams = teamData.filter(team => team.group === viewing.group);
    const rankings = this.state.groupRankings[viewing.group];
    const handleTeamClick = team => {
      const lens = lensPath(['groupRankings', viewing.group]);
      const next = rankings.includes(team) ?
        rankings.filter(t => t !== team) :
        rankings.concat(team);

      this.setState(set(lens, next, this.state));
    };

    return <ViewGroup teams={groupTeams} rankings={rankings} handleTeamClick={handleTeamClick} />;
  }


  viewMatch() {
    const { viewing } = this.state;

    return ( <ViewMatch
      teams={matchTeams}
      winner={this.state.knockoutWinners[viewing.match]}
      handleTeamClick={() => {}}
    /> );
  }


  render() {
    console.log(this.state);
    const { viewing } = this.state;
    const main = (() => {
      const mode = this.state.viewing.mode;
      if (mode === 'group') {
        return this.viewGroup();
      } else if (mode === 'match') {
        return this.viewMatch();
      }
    })();

    const setViewing = viewing => this.setState({ viewing });

    return ( <Fragment>
      { main }
      <div className="nav-wrapper">
        <Brackets
          selected={viewing.group}
          setViewing={setViewing}
          groupRankings={this.state.groupRankings}
        />
      </div>
    </Fragment> );
  }
}

ReactDOM.render(<WCApp></WCApp>, document.getElementById("app"));
