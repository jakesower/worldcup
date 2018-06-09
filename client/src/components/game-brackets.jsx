import React, { Component } from 'react';
import { lensPath, set } from 'ramda';

import ViewGroup from '../components/view-group';
import ViewMatch from '../components/view-match';
import Submit from './submit';
import BracketNav from '../components/bracket-nav';
import { populateBracketSlots } from '../lib/match-functions';

export default class GameBrackets extends Component {
  constructor(props) {
    super(props);
    this.groups = props.groups;
    this.matches = props.matches;

    const initState = {
      navViewing: "Group",
      viewing: {
        mode: "group",
        group: "A",
      },
      messageVisible: false,
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
          'Ro16 1': null,
          'Ro16 2': null,
          'Ro16 3': null,
          'Ro16 4': null,
          'Ro16 5': null,
          'Ro16 6': null,
          'Ro16 7': null,
          'Ro16 8': null,
          'Quarter 1': null,
          'Quarter 2': null,
          'Quarter 3': null,
          'Quarter 4': null,
          'Semi 1': null,
          'Semi 2': null,
          'Match for Third Place': null,
          'Final': null,
        }
      }
    }

    const savedState = window.worldcup && window.sessionStorage.getItem(window.worldcup.group);
    this.state = savedState ? JSON.parse(savedState) : initState;
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


  viewSubmit() {
    // const bracket = populateBracketSlots(this.state.bracket, this.groups);

    return <Submit
      bracket={this.state.bracket}
      teamGroups={this.groups}
    />
  }


  render() {
    console.log(this.state);
    const self = this;
    const { viewing } = this.state;
    const main = (() => {
      const mode = this.state.viewing.mode;
      if (mode === 'group') {
        return this.viewGroup();
      } else if (mode === 'match') {
        return this.viewMatch();
      } else {
        return this.viewSubmit();
      }
    })();

    const setViewing = viewing => this.setState({ viewing });
    const setNavViewing = navViewing => this.setState({ navViewing });

    return <div className="app-wrapper">
      <aside style={this.state.messageVisible ? {} : {display: 'none'}}>
        <span>Select teams in the order you believe they will place in each group. After that, work your way through the knockout rounds!</span>
        <h1>Scoring for correct picks:</h1>
        <ul>
          <li>Winner of Group: 2pts</li>
          <li>Runner-up of Group: 2pts</li>
          <li>Round of 16 (Ro16s): 3pts</li>
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
          <BracketNav
            viewing={viewing}
            selectedNavViewing={this.state.navViewing}
            setViewing={setViewing}
            setNavViewing={setNavViewing}
            bracket={this.state.bracket}
            teamGroups={this.groups}
          />
        </div>
      </div>
    </div>
  }

  componentDidUpdate() {
    if (window.worldcup) {
      window.sessionStorage.setItem(window.worldcup.group, JSON.stringify(this.state));
      console.log(this.state)
    }
  }
}
