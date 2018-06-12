import React, { Component } from 'react';
import { lensPath, set } from 'ramda';

export default class GamePots extends Component {
  constructor(props) {
    super(props);
    this.pots = props.pots;

    const initState = {
      view: {
        mode: "instructions",
      },
      picks: {
        A: [],
        B: [],
        C: [],
        D: [],
      },
    }

    const savedState = window.worldcup && window.sessionStorage.getItem(window.worldcup.group);
    this.state = savedState ? JSON.parse(savedState) : initState;
  }


  render() {
    return <div className="app-wrapper">
      <div className="nav-wrapper">
        <nav>{ this.nav() }</nav>
      </div>
      <div className="main-container">
        <div className="main-wrapper">
          { this.main() }
        </div>
      </div>
    </div>

    console.log(this.state)
  }


  main() {
    switch(this.state.view.mode) {
      case "instructions":
        return this.instructions();
      case "pot":
        return this.viewPot();
      case "submit":
        return this.submit();
    }
  }


  nav() {
    const inst = <div
      key="inst"
      className={`team group${this.state.view.mode === "instructions" ? " selected" : ""}`}
      onClick={() => this.setState({ view: { mode: "instructions" }})}
      >
      <h1 className="name">Instructions</h1>
    </div>
    const sub = <div
      key="sub"
      className={`team group${this.state.view.mode === "submit" ? " selected" : ""}`}
      onClick={() => this.setState({ view: { mode: "submit" }})}
      >
      <h1 className="name">Submit</h1>
    </div>


    return [inst].concat(this.navPot()).concat([sub]);
  }


  navPot() {
    const team = (pot, idx) =>
      this.state.picks[pot][idx] ? this.state.picks[pot][idx] : '???';

    return Object.keys(this.pots).map((pot) => {
      return <div
        key={pot}
        className={`team group${this.state.view.pot === pot ? " selected" : ""}`}
        onClick={() => this.setState({ view: { mode: "pot", pot }})}
        >
        <h1 className={`name`}>{ team(pot, 0) }</h1>
        <h1 style={{ textTransform: 'lowercase', opacity: 0.5 }}>&nbsp;and&nbsp;</h1>
        <h1 className={`name`}>{ team(pot, 1) }</h1>
      </div>
    });
  }


  mainPot({ teams }) {
    const self = this;
    const picks = this.state.picks[this.state.view.pot];
    const pickedMarkup = <div className="rank-container">
      <div className="rank">✔</div>
    </div>;

    const markup = teams.map(t => {
      return (
        <div key={t.name} className="country" onClick={ () => self.handlePick(self.state. view.pot, t.abbreviation) }>
          <div className={`flag ${t.abbreviation}`}/>
          <div className="inner-country">
            <h1>{t.name}</h1>
            { picks.includes(t.abbreviation) ? pickedMarkup : '' }
          </div>
        </div>
      )
    })

    return ( <main className="flags">
      {markup}
    </main> )
  }


  viewPot() {
    const teams = this.pots[this.state.view.pot];
    return this.mainPot({ teams });
  }


  instructions() {
    return <div className="group-config">
      <div className="question-container" style={{ flexDirection: 'column' }}>
        <div className="question">
          <h1>Instructions</h1>
          <ul>
            <li>There are four pots, each containing eight teams.</li>
            <li>Pick two teams from each pot.</li>
            <li>You will get one point for each goal a selected team scores.</li>
            <li>You will lose one point for each goal scored against a team you selected.</li>
            <li>Most points wins!</li>
          </ul>
          <p>Please note that if you try to select a third team, nothing will happen. Unselect one of your already selected teams before trying to select another.</p>
          <h1>Sharing</h1>
          <p>Copy the following link to share the game. Anyone with the link will be able to play this game, so check with the group organizer before sending it out!</p>
          <p>{ `https://worldcup.jakesower.com/games/${window.worldcup.group}` }</p>
        </div>
      </div>
    </div>
  }

  submit() {

    return <main>
      <div className="group-config">
        { this.isComplete() ? this.complete() : this.incomplete() }
      </div>
    </main>
  }

  isComplete() {
    return ['A', 'B', 'C', 'D'].every(pot => {
      return this.state.picks[pot].length === 2;
    })
  }

  complete() {
    const group = window.worldcup.group;

    return <form action={`/games/${group}/submit`} method="POST">
      <div className="question-container" style={{ flexDirection: 'column' }}>
        <div className="question">
          <label>Your Name</label>
          <input name="name" type="text" required />
        </div>

        <div className="question">
          <input type="hidden" name="bracket" value={ JSON.stringify(this.state.picks) } />
          <input type="submit" value="Finalize Picks" />
          <div className="hint">Once you've submitted your picks, it will be impossible to go back and change them. Please ensure you only submit once.</div>
        </div>
      </div>
    </form>
  }

  incomplete() {
    return <div className="question-container">
      <div className="question">
        Looks like you still need to make some picks. Come back here when you're done.
      </div>
    </div>
  }

  handlePick(pot, teamAbbr) {
    const potPicks = this.state.picks[pot];

    const l = lensPath(['picks', pot], this.state);
    const n = potPicks.includes(teamAbbr) ?
      potPicks.filter(p => p !== teamAbbr) :
      (potPicks.length > 1 ? potPicks : potPicks.concat(teamAbbr))

    this.setState(set(l, n));
  }


  componentDidUpdate() {
    if (window.worldcup) {
      window.sessionStorage.setItem(window.worldcup.group, JSON.stringify(this.state));
    }
  }
}
