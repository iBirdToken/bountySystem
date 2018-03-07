const Sequelize = require('sequelize');
const candyuser = require('./model/candyuser');
const source_record = require('./model/source_record');
const visitor = require('./model/visitor');
const source = require('./model/source');
const databaseName = '';
const databaseUser = '';
const databasePwd = '';
const databaseHost = '';


const sequelize = new Sequelize(databaseName, databaseUser, databasePwd, {
  host: databaseHost,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});

sequelize.authenticate().then(()=>{
	console.log('Connection has been established successfully.');
}).catch(err => {
	console.error('Unable to connect to the database:', err);
});



const models = {
	candyuser:candyuser(sequelize),
  source_record:source_record(sequelize),
  visitor:visitor(sequelize),
  source:source(sequelize)
}


module.exports = {
	sequelize:sequelize,
	models:models
}

