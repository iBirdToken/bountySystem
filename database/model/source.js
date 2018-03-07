const Sequelize = require('sequelize');
function source(sequelize)
{
	return sequelize.define('source',
	{
		sourceId:{
			type:Sequelize.INTEGER,
			allowNull:false,
			autoIncrement:true,
			primaryKey:true
		},
		type:{
			type:Sequelize.STRING,
			allowNull:false,
		},
		total_ip:{
			type:Sequelize.INTEGER,
			allowNull:false,
		},
		totalTimes:{
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

module.exports = source;