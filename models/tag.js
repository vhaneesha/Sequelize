module.exports = (sequelize, type) => {
	return sequelize.define('tag', {
		id: {
			type: type.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: type.STRING,
			allowNull: false,
			unique: true,
			validate: {
				notEmpty: true
			}
		}
	})
}