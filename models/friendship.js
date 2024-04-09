const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Friendship extends Model {}

Friendship.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          user_id: {
            type:DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id',
            },
          },
          friend_id: {
            type:DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id',
            },
          },
          ttt_wins:{
            type:DataTypes.INTEGER,
          },
          ttt_draw:{
            type:DataTypes.INTEGER,
          },
          ttt_losses: {
            type:DataTypes.INTEGER,
          },
          active_game_id:{
            type: DataTypes.STRING,
          }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'friendship',
      }
)

module.exports = Friendship;