import { readFileSync } from 'fs';
import { groupBy, prop } from 'ramda';
import matches from './matches';

export const draws = {
  '2010': JSON.parse(readFileSync(__dirname + '/2010-draws.json', 'utf8')),
  '2014': JSON.parse(readFileSync(__dirname + '/2014-draws.json', 'utf8')),
  '2018': JSON.parse(readFileSync(__dirname + '/2018-draws.json', 'utf8')),
};

const rawTeams = JSON.parse(readFileSync(__dirname + '/teams.json', 'utf8'));
export const teams = groupBy(prop('abbreviation'), rawTeams);

export { matches };
