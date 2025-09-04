import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    'Skill',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      profileId: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING },
    },
    {
      tableName: 'skills',
      timestamps: false,
    }
  );
};
