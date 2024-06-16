import express from 'express';
import ProjectDAO from './../models/project.js';
import {
  createProject,
  getAllProjects,
  lookupProjectByName,
  updateProject,
} from './../services/project_service.js';

const project_router = express.Router();
project_router.use(express.json());

/**
 * Validate the project name and return the project DAO
 * response code 404 if no project name provided of project not found
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function validateProjectName(req, res) {
  var project_name = req.body.project_name;
  if (project_name == undefined) {
    res.status(400).send('Bad request: No project name provided');
    return;
  }
  var [project_dao] = await lookupProjectByName(project_name);
  console.log(project_dao);
  if (project_dao == undefined) {
    res.status(404).send('Project not found');
    return;
  }
  return new ProjectDAO(project_dao);
}

/**
 * Get all projects
 * @route GET /projects
 */
project_router.get('/projects', async (req, res) => {
  const projects = await getAllProjects();
  res.json(projects);
});

/**
 * Create a new project
 * @route POST /create-project
 * @param {ProjectDAO.model} project.body.required - the new project to create
 */
project_router.post('/create-project', async (req, res) => {
  const newProject = await createProject(req.body);
  res.send(newProject);
});

/**
 * Update a project name
 * @route POST /update-project-name
 * @param {string} new_name.body.required - the new name for the project
 * @param {string} project_name.body.required - the name of the project to update
 */
project_router.post('/update-project-name', async (req, res) => {
  //Catch bad request no project name
  var new_name = req.body.new_name;
  if (new_name == undefined) {
    res.status(400).send('Bad request: No new project name provided');
    return;
  }

  //Catch bad request no project name or project name not found
  var project_dao = await validateProjectName(req, res);
  if (project_dao == undefined) {
    return;
  }
  updateProject(project_dao.id, ['name', new_name]);
  res.status(200).send('Project name updated');
});

/**
 * Update a project description
 * @route POST /update-project-description
 * @param {string} new_description.body.required - the new description for the project
 * @param {string} project_name.body.required - the name of the project to update
 */
project_router.post('/update-project-description', async (req, res) => {
  var new_description = req.body.new_description;
  if (new_description == undefined) {
    res.status(400).send('Bad request: No new project description provided');
    return;
  }

  var project_dao = await validateProjectName(req, res);
  if (project_dao == undefined) {
    return;
  }
  updateProject(project_dao.id, ['description', new_description]);
  res.status(200).send('Project description updated');
});

/**
 * Update a project status
 * @route POST /update-project-status
 * @param {string} new_status.body.required - the new status for the project
 * @param {string} project_name.body.required - the name of the project to update=
 */
project_router.post('/update-project-status', async (req, res) => {
  const status = ['active', 'inactive', 'archived'];

  var new_status = req.body.new_status;
  if (new_status == undefined) {
    res.status(400).send('Bad request: No new project status provided');
    return;
  }
  if (!status.includes(new_status)) {
    res.status(400).send('Bad request: Invalid status');
    return;
  }

  var project_dao = await validateProjectName(req, res);
  if (project_dao == undefined) {
    return;
  }
  updateProject(project_dao.id, ['status', new_status]);
  res.status(200).send('Project status updated');
});

/**
 * Update a project version
 * @route POST /update-project-version
 * @param {string} new_version.body.required - the new version for the project
 * @param {string} project_name.body.required - the name of the project to update
 */
project_router.post('/update-project-version', async (req, res) => {
  var new_version = req.body.new_version;
  if (new_version == undefined) {
    res.status(400).send('Bad request: No new project version provided');
    return;
  }

  var project_dao = await validateProjectName(req, res);
  if (project_dao == undefined) {
    return;
  }
  updateProject(project_dao.id, ['version', new_version]);
  res.status(200).send('Project version updated');
});

export default project_router;
