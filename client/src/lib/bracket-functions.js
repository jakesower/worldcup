import { add, map, mergeAll, pick, prop, range, union, values, xprod } from 'ramda';
import { possibleTeamPositions } from './group-functions';

// Two types of slot: group position and knockout winner

/**
 * Slot Type: {
 *   id: string,
 *   type: group | knockout,
 *   points: number,
 *   sources: [slot.id, slot.id] (knockout only),
 *   position: 1 | 2 (group only),
 *   group: [A..H] (group only)
 * }
 */

// Given the results of a group, what's the outcome.
export function possibleTeamsForSlot(slots, matches, teamsByGroup, slotId, loser = false) {
  const slot = slots[slotId];

  function groupSlot() {
    const groupMatches = matches.filter(m => m.stage === 'group');
    const pos = possibleTeamPositions(groupMatches, teamsByGroup[slot.group]);
    return pos
      .filter(({ positions }) => positions.includes(slot.position))
      .map(prop('team'));
  }

  function koSlot() {
    const result = matches.find(m => m.id === slot.id);
    const lookup = idx => possibleTeamsForSlot(slots, matches, teamsByGroup, slot.sources[idx], slot.losers);
    return result ?
      [(loser ? result.loser : result.winner)] :
      union(lookup(0), lookup(1));
  }

  return slot.type === 'group' ? groupSlot() : koSlot();
}


// ideally, this won't be necessary next time
export function bracketToSlots(populatedBracket) {
  const d = mergeAll([
    pick(xprod(['1','2'], ['A','B','C','D','E','F','G','H']).map(([b,a]) => `${a}${b}`), populatedBracket),  // group
    mergeAll(range(1, 9).map(i => ({[`Ro16-${i}`]: populatedBracket[`Winner of Ro16 ${i}`]}))), // ro 16
    mergeAll(range(1, 5).map(i => ({[`QF-${i}`]: populatedBracket[`Winner of Quarter ${i}`]}))),
    mergeAll(range(1, 3).map(i => ({[`SF-${i}`]: populatedBracket[`Winner of Semi ${i}`]}))),
    { Third: populatedBracket['Winner of Match for Third Place'] },
    { Final: populatedBracket['Winner of Final'] }
  ]);

  return map(prop('abbreviation'))(d);
}


// give points for only those slots that are certain to be correct
export function minScore(slots, matches, teamsByGroup, playerSlots) {
  const possibleTeams = slot => possibleTeamsForSlot(slots, matches, teamsByGroup, slot.id);
  return values(slots)
    .filter(slot => {
      const possible = possibleTeams(slot);
      return possible.length === 1 && playerSlots[slot.id] === possible[0];
    })
    .map(prop('points'))
    .reduce(add, 0);
}


// give points for only anything that could possibly be correct
export function maxScore(slots, matches, teamsByGroup, playerSlots) {
  const possibleTeams = slot => possibleTeamsForSlot(slots, matches, teamsByGroup, slot.id);
  return values(slots)
    .filter(slot => {
      const possible = possibleTeams(slot);
      return possible.includes(playerSlots[slot.id]);
    })
    .map(prop('points'))
    .reduce(add, 0);
}
