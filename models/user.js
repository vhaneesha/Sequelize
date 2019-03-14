module.exports = (sequelize, type) => {
	const Op = type.Op;
	return sequelize.define('user', {
		id: {
			type: type.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: type.STRING,
			//Adds the not null option to the database schema, but not checked by sequelize
			allowNull: false,
			//Sequelize checks for attribute formats and content, does not alter schema
			validate: {
				notEmpty: true

			}
		},
			username: {
			type: type.STRING,
			allowNull: false,
			unique: true,
			validate: {
				notEmpty: true

			}
		},
			password: {
			type: type.STRING,
			allowNull: false,
			validate: {
				notEmpty: true

			}
		}

	},
	{
		//The paranoid option creates a deletedAt timestamp field in the table and sets this timestamps on deltes without deleting from the table
		paranoid: true,

		//Scopes are a way to define query behavior
		//Default scope will run on all queries unless overriden.
		defaultScope: {
			paranoid: false,
			attributes: { exclude: ['password']},
			where: {
				deletedAt: null
			}
		},
		scopes: {
			deleted: {
				attributes: { exclude: ['password']},
				paranoid: false,
				where: {
					deletedAt : {
						[Op.ne] : null
					}
				}
			}
		},

		//Define behavior at cetatin points of the query lifecycle for this model
		hooks: {
			afterCreate: (user, options) => {
				console.log(`User ${user.username} created.`);
			},
			afterSave: (user, options) => {
			    console.log(`User ${user.username} saved.`);
			},
			afterDestroy: (user, options) => {
			    console.log(`User ${user.username} deleted.`);
			},
			afterUpdate: (user, options) => {
			    console.log(`User ${user.username} updated.`);
			},

		}

	})
}

