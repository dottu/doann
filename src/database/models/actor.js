'use strict';
module.exports = (sequelize, DataTypes) => {
  const Actor = sequelize.define('Actors', {
    name: DataTypes.STRING
  }, {});
  Actor.associate = function(models) {
    // associations can be defined here
    Actor.belongsToMany(models.Movies, { through : 'Actor_Movies'})
    // Actor.hasMany(models.Actor_Movies, { foreignKey : 'ActorId'})
  };
  return Actor;
};