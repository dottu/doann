'use strict';
module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define('Movies', {
    name: DataTypes.STRING
  }, {});
  Movie.associate = function(models) {
    // associations can be defined here
    Movie.belongsToMany(models.Actors, { through : 'Actor_Movies'})
    Movie.hasMany(models.Actor_Movies, { forgeinKey : 'MovieId'})
  };
  return Movie;
};