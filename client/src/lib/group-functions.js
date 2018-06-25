import { descend, findIndex, flatten, merge, prop, range, sortBy, sortWith, union, xprod } from 'ramda';
import { countTrue } from './utils';

export function points(matches, team) {
  const win = (t, m) => (t === m.homeTeam && m.homeScore > m.awayScore) || (t === m.awayTeam && m.awayScore > m.homeScore);
  const tie = (t, m) => (t === m.homeTeam || t === m.awayTeam) && (m.homeScore === m.awayScore);

  return matches.reduce(
    (pts, match) =>
      win(team, match) ? (pts+3) :
      tie(team, match) ? (pts+1) : pts,
    0
  );
}


export function matchesWithTeams(matches, teams) {
  return matches.filter(m => teams.includes(m.homeTeam) || teams.includes(m.awayTeam));
}


export function goalDifference(matches, team) {
  return matches.reduce(
    (gd, m) =>
      (team === m.homeTeam) ? (gd + (m.homeScore - m.awayScore)) :
      (team === m.awayTeam) ? (gd + (m.awayScore - m.homeScore)) : gd,
    0
  );
}


export function goalsFor(matches, team) {
  return matches.reduce(
    (gf, m) =>
      (team === m.homeTeam) ? (gf + m.homeScore) :
      (team === m.awayTeam) ? (gf + m.awayScore) : gf,
    0
  );
}


export function gamesPlayed(matches, team) {
  matches.reduce(
    (pl, m) => (team === m.homeTeam || team === m.awayTeam) ? (pl+1) : pl,
    0
  );
}


export function pairings(teams) {
  return xprod(teams, teams).filter(([t1, t2]) => t1 < t2);
}


export function homeSortedMatches(matches) {
  return matches.map(
    m => (m.homeTeam < m.awayTeam) ? m :
      merge(m, { homeTeam: m.awayTeam, awayTeam: m.homeTeam, homeScore: m.awayScore, awayScore: m.homeScore })
  );
}


export function groupPositions(matches, teams) {
  const cDesc = fn => descend(t => fn(matches, t)); // curry descend with matches
  const sorted = sortWith([cDesc(points), cDesc(goalDifference), cDesc(goalsFor)])(teams);
  return teams.map(team => ({
    team,
    positions: [sorted.indexOf(team) + 1],
  }));
}


// assume 3 games will be played by each team
// since this is about potential, points are the only thing that matter--all tie breakers are assumed to go either way
// NOTE: this is an approximate function--impossible scenarios might slip through, though no one will likely notice
export function possibleTeamPositions(matches, teams) {
  const toPlay = pairings(teams);
  const played = matchesWithTeams(matches, teams);
  const unplayed = toPlay.filter(([t1, t2]) =>
    !played.some(m => (m.homeTeam === t1 && m.awayTeam === t2) || (m.homeTeam === t2 && m.awayTeam === t1))
  );

  if (unplayed.length === 0) {
    return groupPositions(matches, teams);
  }

  const potentials = unplayed.map(([t1, t2]) => [
    { homeTeam: t1, homeScore: 1, awayTeam: t2, awayScore: 0 },
    { homeTeam: t1, homeScore: 0, awayTeam: t2, awayScore: 0 },
    { homeTeam: t1, homeScore: 0, awayTeam: t2, awayScore: 1 },
  ]);

  // creates a list of all possible match outcomes, given the current match results
  const allPotentials = potentials.reduce((acc, pot) =>
    xprod(acc, pot).map(flatten),
    [played]
  );

  const toOutcome = ms => {
    const pairs = teams.map(team => {
      const score = points(ms, team);
      return { score, team };
    });

    return sortBy(prop('score'), pairs).reverse();
  }

  // list of outcomes -> list of finishing positions
  const placesWithoutTiebreakers = (outcome, targetTeam) => {
    const targetScore = outcome.find(({ team }) => targetTeam === team).score;
    return range(1, 5).filter(i => outcome[i-1].score === targetScore);
  }

  // const placesWithTiebreakers = (outcome, targetTeam) => {
  //   const cDesc = fn => descend(t => fn(matches, t)); // curry descend with matches
  //   const results = sortWith([cDesc(points), cDesc(goalDifference), cDesc(goalsFor)])(teams);
  //   return findIndex()
  // }


  return allPotentials.reduce(
    (teamPairs, matchSet) => {
      const outcome = toOutcome(matchSet);
      return teamPairs.map(({ team, positions }) => {
        return { team, positions: union(positions, placesWithoutTiebreakers(outcome, team)) };
      });
    },
    teams.map(team => ({ team, positions: [] }))
  );

}
