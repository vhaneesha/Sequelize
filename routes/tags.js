var express = require('express');
var router = express.Router();

const { sequelize, User, Event, Tag } = require('../sequelize')

// create a tag
router.post('/', (req, res, next) => {
    Tag.create(req.body)
        .then(tag => res.json(tag))
        .catch(err => {return next(err)})
});

// get all tags
router.get('/', (req, res, next) => {
    Tag.findAll().then(tags => res.json(tags))
	    .catch(err => {return next(err)})
});

//get a tag by id
router.get('/:id', (req, res, next) => {
    Tag.findById(req.params.id)
	    .then(tag => res.json(tag))
	    .catch(err => {return next(err)})
});

// get events with this tag uses method generated by belongstoMany on Tag
router.get('/withTag/:id', (req, res, next) => {
    Tag.findById(req.params.id)
	    .then(tag => tag.getTagged())
	    .then(events => res.json(events))
	    .catch(err => {return next(err)})
});

//Use Transaction to rollback an entire chain of actions if it encounters an error anywhere in the chain
router.post('/createAndTag/:eventId', (req, res, next) => {
	Event.findById(req.params.eventId)
		.then( event => {

			return sequelize.transaction( t => {
				return Tag.create(req.body, {transaction: t})
					.then(tag  => {
						if (event == null)
						{
							throw new Error("Event not found");
						}
						
						return tag.addTagged(event, {transaction: t});
					});
			});
		})
        .then(() => Tag.findAll())
        .then( tags => res.json(tags))
        .catch(err => {return next(err)})
});



module.exports = router;