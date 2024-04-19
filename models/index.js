const User = require('./User');
const Friendship = require('./friendship')

User.belongsToMany(User, {
    as: 'target',
    through: Friendship,
    foreignKey: 'user_id'
})
User.belongsToMany(User, {
    as: 'friend',
    through: Friendship,
    foreignKey: 'friend_id'
})
module.exports = {User, Friendship}