import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    'Links',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      profileId: { type: DataTypes.INTEGER, allowNull: false },
      github: { type: DataTypes.TEXT },
      linkedin: { type: DataTypes.TEXT },
      portfolio: { type: DataTypes.TEXT },
    },
    {
      tableName: 'links',
      timestamps: false,
    }
  );
};
