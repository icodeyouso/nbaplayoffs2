import * as express from 'express';
import * as mongoose from 'mongoose';
import models from '../models/Nbaseries';
let router = express.Router();


router.get('/nbaseries', function(req, res, next) {
    models.nbaSeries
    .find()
    .populate({
      path: 'games',
      populate: {
        path: 'homeTeam awayTeam'
      }
    })
    .exec((err, result) => {
      if (err)  next({error:err})
      res.json(result);
    });
})

export default router;