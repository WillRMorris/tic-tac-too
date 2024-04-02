const sequelize = require('../config/connection');
const { User, Frienship } = require('../models/index');

const userData = require('./users.json');
const friendshipData = require('./friendships.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await User.bulkCreate(userData);

  await Frienship.bulkCreate(friendshipData);

  console.log("Database Seeded");

  process.exit(0);
};

seedDatabase();