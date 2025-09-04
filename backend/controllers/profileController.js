import { Profile, Skill, Project, Work, Links, sequelize } from '../models/index.js';
import { Op } from 'sequelize';

export const health = (req, res) => {
  res.sendStatus(200);
};

export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      include: [Skill, Project, Work, Links],
      order: [[Work, 'from_date', 'DESC']]
    });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, email, education, skills, projects, work, links } = req.body;
    const profile = await Profile.findOne({ transaction: t });
    if (!profile) {
      await t.rollback();
      return res.status(404).json({ error: 'No profile to update' });
    }

    await profile.update({ name, email, education }, { transaction: t });

    // Delete old and create new related data
    await Skill.destroy({ where: { profileId: profile.id }, transaction: t });
    if (skills && skills.length) {
      const skillRows = skills.map(name => ({ profileId: profile.id, name }));
      await Skill.bulkCreate(skillRows, { transaction: t });
    }

    await Project.destroy({ where: { profileId: profile.id }, transaction: t });
    if (projects && projects.length) {
      const projectRows = projects.map(p => ({ ...p, profileId: profile.id }));
      await Project.bulkCreate(projectRows, { transaction: t });
    }

    await Work.destroy({ where: { profileId: profile.id }, transaction: t });
    if (work && work.length) {
      const workRows = work.map(w => ({ ...w, profileId: profile.id }));
      await Work.bulkCreate(workRows, { transaction: t });
    }

    await Links.destroy({ where: { profileId: profile.id }, transaction: t });
    if (links) {
      await Links.create({ ...links, profileId: profile.id }, { transaction: t });
    }

    await t.commit();
    res.json({ message: 'Profile updated' });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getProjectsBySkill = async (req, res) => {
  const { skill } = req.query;
  if (!skill) return res.status(400).json({ error: 'Skill query param required' });

  try {
    const projects = await Project.findAll({
      include: [{
        model: Skill,
        where: { name: { [Op.iLike]: `%${skill}%` } },
        attributes: []
      }],
      distinct: true,
    });
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getTopSkills = async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT name, COUNT(*) as count
      FROM skills
      GROUP BY name
      ORDER BY count DESC
      LIMIT 5;
    `);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const searchAll = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: "Query param 'q' required" });

  try {
    const searchTerm = `%${q}%`;

    const projects = await Project.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: searchTerm } },
          { description: { [Op.iLike]: searchTerm } }
        ]
      }
    });

    const skills = await Skill.findAll({
      where: { name: { [Op.iLike]: searchTerm } },
      attributes: ['name'],
      distinct: true
    });

    const work = await Work.findAll({
      where: {
        [Op.or]: [
          { company: { [Op.iLike]: searchTerm } },
          { role: { [Op.iLike]: searchTerm } },
          { description: { [Op.iLike]: searchTerm } }
        ]
      }
    });

    res.json({
      projects,
      skills: skills.map(s => s.name),
      work
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createProfile = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, email, education, skills, projects, work, links } = req.body;

    // Create new Profile
    const profile = await Profile.create({ name, email, education }, { transaction: t });

    // Create related data
    if (skills && skills.length) {
      const skillRows = skills.map(name => ({ profileId: profile.id, name }));
      await Skill.bulkCreate(skillRows, { transaction: t });
    }

    if (projects && projects.length) {
      const projectRows = projects.map(p => ({ ...p, profileId: profile.id }));
      await Project.bulkCreate(projectRows, { transaction: t });
    }

    if (work && work.length) {
      const workRows = work.map(w => ({ ...w, profileId: profile.id }));
      await Work.bulkCreate(workRows, { transaction: t });
    }

    if (links) {
      await Links.create({ ...links, profileId: profile.id }, { transaction: t });
    }

    await t.commit();

    // Fetch the created profile with associations
    const createdProfile = await Profile.findOne({
      where: { id: profile.id },
      include: [Skill, Project, Work, Links],
    });

    res.status(201).json({ message: 'Profile created', profile });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
