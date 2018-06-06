import React, { Component, Fragment } from 'react';
import { chain, lensPath, map, set } from 'ramda';

import ViewGroup from '../components/view-group';
import ViewMatch from '../components/view-match';
import Brackets from '../components/brackets';
import { populateBracketSlots } from '../lib/match-functions';

export default class GameBrackets extends Component {
  constructor(props) {
    super(props);
    this.groups = props.groups;
    this.matches = props.matches;

    this.state = {
      viewing: {
        mode: "group",
        group: "A",
      },
      messageVisible: true,
      bracket: {
        groups: {
          A: [],
          B: [],
          C: [],
          D: [],
          E: [],
          F: [],
          G: [],
          H: [],
        },
        knockout: {
          'Octo 1': null,
          'Octo 2': null,
          'Octo 3': null,
          'Octo 4': null,
          'Octo 5': null,
          'Octo 6': null,
          'Octo 7': null,
          'Octo 8': null,
          'Quarter 1': null,
          'Quarter 2': null,
          'Quarter 3': null,
          'Quarter 4': null,
          'Semi 1': null,
          'Semi 2': null,
          'Third': null,
          'Final': null,
        }
      }
    }
  }


  viewGroup() {
    const { bracket, viewing } = this.state;
    const groupTeams = this.groups[viewing.group];
    const rankings = bracket.groups[viewing.group];
    const handleTeamClick = teamIdx => {
      const lens = lensPath(['bracket', 'groups', viewing.group]);
      const next = rankings.includes(teamIdx) ?
        rankings.filter(t => t !== teamIdx) :
        rankings.concat(teamIdx);

      this.setState(set(lens, next, this.state));
    };

    return <ViewGroup teams={groupTeams} rankings={rankings} handleTeamClick={handleTeamClick} />;
  }


  viewMatch() {
    const { viewing } = this.state;
    const bracket = populateBracketSlots(this.state.bracket, this.groups);
    const match = this.matches.find(m => m.name === viewing.matchName);

    return ( <ViewMatch
      match={match}
      bracket={bracket}
      handleTeamClick={t => {
        const lens = lensPath(['bracket', 'knockout', match.name]);
        const next = (bracket[match.name] === t) ? null : t;
        this.setState(set(lens, next, this.state));
      }}
    /> );
  }


  render() {
    const self = this;
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

    return <div className="app-wrapper">
      <aside style={this.state.messageVisible ? {} : {display: 'none'}}>
        <span>Select teams in the order you believe they will place in each group. After that, work your way through the knockout rounds!</span>
        <h1>Scoring for correct picks:</h1>
        <ul>
          <li>Winner of Group: 2pts</li>
          <li>Runner-up of Group: 2pts</li>
          <li>Round of 16 (Octos): 3pts</li>
          <li>Quarterfinals: 5pts</li>
          <li>Semifinals: 8pts</li>
          <li>Third Place: 1pt</li>
          <li>Champion: 13pts</li>
        </ul>
        <button onClick={() => self.setState({ messageVisible: false })}>Got It</button>
      </aside>
      <div className="main-wrapper">
        { main }
        <div className="nav-wrapper">
          <Brackets
            selected={viewing.group}
            setViewing={setViewing}
            bracket={this.state.bracket}
            teamGroups={this.groups}
          />
        </div>
      </div>
    </div>
  }
}
