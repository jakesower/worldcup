import { readFileSync } from 'fs';
import { groupBy, prop } from 'ramda';
import matches from './matches';
import d2010 from './2010-draws';
import d2014 from './2014-draws';
import d2018 from './2018-draws';

const rawTeams = JSON.parse(readFileSync(__dirname + '/teams.json', 'utf8'));
export const teams = groupBy(prop('abbreviation'), rawTeams);

export { matches };
