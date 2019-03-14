var express = require('express');
var router = express.Router();

const { sequelize, User, Event, Tag } = require('../sequelize')

// create an event
router.post('/', (req, res, next) => {
    Event.create(req.body)
        .then(event => res.json(event))
        .catch(err => {return next(err)})
});

// get all events
router.get('/', (req, res, next) => {
    Event.findAll({ include: ['host'] })
	    .then(events => res.json(events))
	    .catch(err => {return next(err)})
});


// add a tag to an event, uses method generated by belongsToMany
router.put('/:eventId/addTag/:tagId', (req, res, next) => {
    var eventPromise = Event.findById(req.params.eventId);
    var tagPromise = Tag.findById(req.params.tagId);
    Promise.all([eventPromise, tagPromise])
	    .then(([event, tag]) => event.addTag([tag]))
	    .then(() => eventPromise)
	    .then(event => event.getTags())
	    .then(tags => res.json(tags))
	    .catch(err => {return next(err)})
});


// add an attendee to an event uses method generated by belongsToMany
router.put('/:eventId/addAttendee/:userId', (req, res, next) => {
    var eventPromise = Event.findById(req.params.eventId);
    var userPromise = User.findById(req.params.userId);
    Promise.all([eventPromise, userPromise])
        .then(([event, user]) => event.addAttendee([user]))
        .then(() => eventPromise)
        .then(event => event.getAttendees())
        .then(users => res.json(users))
        .catch(err => {return next(err)})
});


// get all tags of an event using method generated by belongsToMany association with tag
router.get('/tagsOf/:id', (req, res, next) => {
    Event.findById(req.params.id)
    .then(event => event.getTags())
    .then(tags => res.json(tags))
    .catch(err => {return next(err)})
});

//get all attendees of an event using ethod generated by belongsToMany with User
router.get('/attendeesOf/:id', (req, res, next) => {
    Event.findById(req.params.id)
    .then(event => event.getAttendees())
    .then(users => res.json(users))
    .catch(err => {return next(err)})
});

//get the host of an event using method generated by belongsTo with User
router.get('/hostOf/:id', (req, res, next) => {
    Event.findById(req.params.id)
    .then(event => event.getHost())
    .then(user => res.json(user))
    .catch(err => {return next(err)})
});


module.exports = router;