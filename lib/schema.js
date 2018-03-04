const Sequelize = require('sequelize');

var secret;
try {
  secret = require('../secrets.json')
} catch (e) {
  console.error('Create your own secrets file lazybones');
  secret = require('../secret-sample.json')
}

const DATABASE_URL = process.env.DATABASE_URL ||
                    ('postgres://' + secret.DB_USER + ":" + secret.DB_PASSWORD + "@" + secret.DB_HOST + ":5432/" + secret.DATABASE);

const db = new Sequelize(DATABASE_URL, {
  dialect: 'postgres'
});

const User = db.define('users', {
  id: {type: Sequelize.DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  username: Sequelize.DataTypes.STRING,
  repositoryName: Sequelize.DataTypes.STRING
});

db.sync({force: false}).then(() => {
  console.log('Database configured')
});

module.exports = {
  models: {
    User
  },
  db: db
};
