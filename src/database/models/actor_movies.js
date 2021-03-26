'use strict';
module.exports = (sequelize, DataTypes) => {
  const Actor_Movies = sequelize.define('Actor_Movies', {
    ActorId: DataTypes.INTEGER,
    MovieId: DataTypes.INTEGER
  }, {});
  Actor_Movies.associate = function(models) {
    // associations can be defined here
    Actor_Movies.belongsTo(models.Actors , { foreignKey : 'ActorId'})
    Actor_Movies.belongsTo(models.Movies , { foreignKey : 'MovieId'})
  };
  return Actor_Movies;
};