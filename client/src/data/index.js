import { groupBy, prop } from 'ramda';
import matches from './matches';
import d2010 from './2010-draws';
import d2014 from './2014-draws';
import d2018 from './2018-draws';
import rawTeams from './teams';

export const draws = {
  '2010': d2010,
  '2014': d2014,
  '2018': d2018,
}

export const teams = groupBy(prop('abbreviation'), rawTeams);
export { matches };
