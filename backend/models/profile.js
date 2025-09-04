import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    'Profile',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
      education: { type: DataTypes.TEXT },
    },
    {
      tableName: 'profile',
      timestamps: false,
    }
  );
};
