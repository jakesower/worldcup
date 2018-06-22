import { mergeAll, uniq } from 'ramda';

// Given the results of a group, what's the outcome.
export function groupPoints(matches, team) {
  const groupMatches = matches.filter(m => m.stage === 'group');
  const win = (t, m) => (t === m.homeTeam && m.homeScore > m.awayScore) || (t === m.awayTeam && m.awayScore > m.homeScore);
  const tie = (t, m) => (t === m.homeTeam || t === m.awayTeam) && (m.homeScore === m.awayScore);

  return groupMatches.reduce(
    (pts, match) =>
      win(team, match) ? (pts+3) :
      tie(team, match) ? (pts+1) : pts,
    0
  )
}
