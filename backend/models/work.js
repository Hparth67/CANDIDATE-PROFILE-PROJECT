import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define(
    'Work',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      profileId: { type: DataTypes.INTEGER, allowNull: false },
      company: { type: DataTypes.STRING },
      role: { type: DataTypes.STRING },
      from_date: { type: DataTypes.DATE },
      to_date: { type: DataTypes.DATE },
      description: { type: DataTypes.TEXT },
    },
    {
      tableName: 'work',
      timestamps: false,
    }
  );
};
