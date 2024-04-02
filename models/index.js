const User = require('./User');
const Frienship = require('./friendship')

User.belongsToMany(User, {
    as: 'target',
    through: Frienship,
    foreignKey: 'user_id'
})
User.belongsToMany(User, {
    as: 'friend',
    through: Frienship,
    foreignKey: 'friend_id'
})
module.exports = {User, Frienship}