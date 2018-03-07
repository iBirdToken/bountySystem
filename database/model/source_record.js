const Sequelize = require('sequelize');
function source_record(sequelize)
{
	return sequelize.define('source_record',
	{
		recordId:{
			type:Sequelize.INTEGER,
			allowNull:false,
			autoIncrement:true,
			primaryKey:true
		},
		type:{
			type:Sequelize.STRING,
			allowNull:false,
		},
		ip:{
			type:Sequelize.STRING,
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

module.exports = source_record;