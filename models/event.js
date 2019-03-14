module.exports = (sequelize, type) => {
	return sequelize.define('event', {
		id: {
			type: type.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: type.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			}
		},
		date: {
			type: type.DATE,
			allowNull: false,
			defaultValue: type.NOW
		}

	})
}