const Sequelize = require('sequelize')

//Load model classes, these are functions that return a promisified model
const UserModel = require('./models/user')
const EventModel = require('./models/event')
const TagModel = require('./models/tag')

//Set up connection to database with a thread pool
const sequelize = new Sequelize('sequelizedemo', 'root', 'Vhan@283!', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 10, 
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    //define behavior at certain points of the query lifecycle globally, applies to all models
    hooks: {
        beforeValidate: () => {
            console.log('Beginning validation');
        },
        afterValidate: () => {
            console.log('Validation Successful');
        }

    }
  }
})

//Test if connection to the database is successful
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

//use model function to create usable mappings between tables and models
const User = UserModel(sequelize, Sequelize)
const Event = EventModel(sequelize, Sequelize)
const Tag = TagModel(sequelize, Sequelize)

// Attendee is an empty class that will tack the realationship betweeen  many events and  many users
const Atendee = sequelize.define('attendee', {})
Event.belongsToMany(User, { as:'attendees', through: Atendee, unique: false })
User.belongsToMany(Event, { as:'attended', through: Atendee, unique: false })

//Can also enter table name for the table that will keep track of the relationship between many events and  many tags
Event.belongsToMany(Tag, {as:'tags', through: 'eventTags', unique: false })
Tag.belongsToMany(Event, { as:'tagged', through: 'eventTags', unique: false })

//Will create a foreign key in event to track realtionship between one user and one event, defaults name to userId
Event.belongsTo(User, {as:'host', foreignKey: 'hostId', targetKey: 'id'});
User.hasMany(Event, {as:'hosted', foreignKey: 'hostId', sourceKey: 'id'} );

//Gennerates all models intialized by this sequelize instance, the force option drops existing tables before generating
sequelize.sync({force: true})
//sequelize.sync()
.then(() => {
  console.log(`Database & tables created!`)
})

//export the usable mappings for use in other files.
module.exports = {
  sequelize,
  User,
  Event,
  Tag
}