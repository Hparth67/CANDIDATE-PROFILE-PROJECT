import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

import ProfileModel from './profile.js';
import SkillModel from './skill.js';
import ProjectModel from './project.js';
import WorkModel from './work.js';
import LinksModel from './links.js';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME, // database name
  process.env.DB_USER, // username
  process.env.DB_PASSWORD, // password
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
  }
);

/* const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false  // Important for Render's managed PostgreSQL SSL
    }
  },
  logging: false,
});
 */

/* let sequelize;
if (process.env.DATABASE_URL) {
  console.log("Connecting to production database...");
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Important for Render's managed PostgreSQL SSL
      },
    },
    logging: false,
  });
} else {
  // Local development configuration
  console.log("Connecting to local database...");
  sequelize = new Sequelize(
    process.env.DB_NAME, // database name
    process.env.DB_USER, // username
    process.env.DB_PASSWORD, // password
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      dialect: "postgres",
      logging: console.log, // Enable logging for local development
    }
  );
} */

// Initialize models
const Profile = ProfileModel(sequelize);
const Skill = SkillModel(sequelize);
const Project = ProjectModel(sequelize);
const Work = WorkModel(sequelize);
const Links = LinksModel(sequelize);

// Associations
Profile.hasMany(Skill, { foreignKey: 'profileId', onDelete: 'CASCADE' });
Skill.belongsTo(Profile, { foreignKey: 'profileId' });

Profile.hasMany(Project, { foreignKey: 'profileId', onDelete: 'CASCADE' });
Project.belongsTo(Profile, { foreignKey: 'profileId' });

Profile.hasMany(Work, { foreignKey: 'profileId', onDelete: 'CASCADE' });
Work.belongsTo(Profile, { foreignKey: 'profileId' });

Profile.hasOne(Links, { foreignKey: 'profileId', onDelete: 'CASCADE' });
Links.belongsTo(Profile, { foreignKey: 'profileId' });

// Test connection and sync database
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync database (create tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');
    
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Exit the process if database connection fails
  }
})();

export {
  sequelize,
  Profile,
  Skill,
  Project,
  Work,
  Links
};