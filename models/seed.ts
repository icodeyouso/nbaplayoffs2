import NbaSeries from './NbaSeries';
import * as mongoose from 'mongoose';
let oneAtATime = require('promise-one-at-a-time'); 
import * as _ from 'lodash';
let keys = Object.keys(NbaSeries);

//drop the db
mongoose.connection.db.dropDatabase();

//your models
// team, game, nbaSeries
console.log('seed keys\n', pj(keys));

//block vars when promises resolve
let teams = null;
let games = null;
let series = null;

function createTeams() {
  return Promise.all([
    NbaSeries.team.create({
      name: 'Pistons',
      logo: 'https://s-media-cache-ak0.pinimg.com/236x/27/ca/6f/27ca6fb102cf33e5786cda0ecd3d4c4c.jpg'
    }),
    NbaSeries.team.create({
      name: 'Blazers',
      logo: 'http://content.sportslogos.net/logos/6/239/full/826.gif'
    })
  ]);
}

function createGames() {
  return Promise.all([
    NbaSeries.game.create({
      homeTeam: teams[0]._id,
      awayTeam: teams[1]._id,
      homeScore: 105,
      awayScore: 99
    }),
    NbaSeries.game.create({
      homeTeam: teams[0]._id,
      awayTeam: teams[1]._id,
      homeScore: 105,
      awayScore: 106
    }),
    NbaSeries.game.create({
      homeTeam: teams[1]._id,
      awayTeam: teams[0]._id,
      homeScore: 106,
      awayScore: 121
    }),
    NbaSeries.game.create({
      homeTeam: teams[1]._id,
      awayTeam: teams[0]._id,
      homeScore: 109,
      awayScore: 112
    }),
    NbaSeries.game.create({
      homeTeam: teams[1]._id,
      awayTeam: teams[0]._id,
      homeScore: 90,
      awayScore: 92
    })
  ])
}

function createSeries() {
  return Promise.all([
    NbaSeries.nbaSeries.create({
     games:_.map(games, (game: mongoose.Document) => game._id)
    })
  ]);
}

let promiseQue = [
  () => new Promise((resolve, reject) => {
    createTeams().then((result) => {
      console.log('i got a list of teams\n', pj(result));
      teams = result;
      resolve(result);
    }).catch((err) => { throw new Error(err) });
  }),
  () => new Promise((resolve, reject) => {
    createGames().then((result) => {
      console.log('then a list of games\n', pj(result));
      games = result;
      resolve(result);
    }).catch((err) => { throw new Error(err) });
  }),
  () => new Promise((resolve, reject) => {
    createSeries().then((result) => {
      console.log('then a list of series\n', pj(result));
      series = result;
      resolve(result);
    }).catch((err) => { throw new Error(err) });
  })
];

//consider this the `INIT` of the script
oneAtATime(promiseQue).then((result) => {
  console.log('\n-==seed script is finished==-\n');

  //an example of a populated one to many
  const firstSeries = series[0]._id;
  NbaSeries.nbaSeries
    .findOne(firstSeries)
    .populate({
      path: 'games',
      populate: {
        path: 'homeTeam awayTeam'
      }
    })
    .exec((err, aSeries) => {
      if (err) throw new Error(err);
      console.log('populated one to many of a series\n', pj(aSeries));
    });

}).catch((err) => { throw new Error(err) });

//readable json
function pj(data) {
  return '\n' + JSON.stringify(data, null, 2) + '\n';
}