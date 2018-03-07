const Sequelize = require('sequelize');
function visitor(sequelize)
{
	return sequelize.define('visitor',
	{
		userId:{
			type:Sequelize.INTEGER,
			allowNull:false,
			autoIncrement:true,
			primaryKey:true
		},
		user_ip:{
			type:Sequelize.STRING,
			allowNull:false,
		},
		country:{
			type:Sequelize.STRING,
			allowNull:false,
		},
		province:{
			type:Sequelize.STRING,
			allowNull:false,
		},
		city:{
			type:Sequelize.STRING,
			allowNull:false,
		},
		visitTimes:{
			type:Sequelize.INTEGER,
			allowNull:false,
		},
		updated:{
			type:Sequelize.DATE(6),
			allowNull:false,
			defaultValue:Sequelize.NOW
		}
	},
	{
		timestamps:false,
		freezeTableName:true
	})
}

module.exports = visitor;