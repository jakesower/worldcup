import { mergeAll, uniq } from 'ramda';

// Given the results of a group, what's the outcome.
export function points(matches, team) {
  const win = (t, m) => (t === m.homeTeam && m.homeScore > m.awayScore) || (t === m.awayTeam && m.awayScore > m.homeScore);
  const tie = (t, m) => (t === m.homeTeam || t === m.awayTeam) && (m.homeScore === m.awayScore);

  return groupMatches.reduce(
    (pts, match) =>
      win(team, match) ? (pts+3) :
      tie(team, match) ? (pts+1) : pts,
    0
  )
}


export function goalDifference(matches, team) {
  return matches.reduce(
    (gd, m) =>
      (team === m.homeTeam) ? (gd + (m.homeScore - m.awayScore)) :
      (team === m.awayTeam) ? (gd + (m.awayScore - m.homeScore)) : gd,
    0
  );
}
