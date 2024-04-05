const sequelize = require('../config/connection');
const { User, Friendship } = require('../models/index');

const userData = require('./users.json');
const friendshipData = require('./friendships.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true
  });

  await Friendship.bulkCreate(friendshipData);

  console.log("Database Seeded");

  process.exit(0);
};

seedDatabase();