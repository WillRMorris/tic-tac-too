const User = require('./User');
const Frienship = require('./friendship')

User.belongsToMany(User, {
    through: Frienship,
    foreignKey: 'user_id'
})
User.belongsToMany(User, {
    through: Frienship,
    foreignKey: 'friend_id'
})
module.exports = {User, Frienship}