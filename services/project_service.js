import ProjectDAO from '../models/project.js';
import { query } from './database.js';

export async function getAllProjects() {
  const result = await query('SELECT * FROM projects');
  const projects = result.map((entry) => {
    return new ProjectDAO(entry);
  });

  return projects;
}

export async function createProject(request) {
  var newProject = new ProjectDAO(request);
  var [command, args] = newProject.createProject();
  console.log(command);
  const result = await query(command, args);
  return result;
}
/**
 *
 * @param {*} id - the ID of the project to update
 * @param {*} update - a [key, value] pair to update the project where the key is the column name and value is the new value
 */
export async function updateProject(id, update) {
  var command = `UPDATE projects 
      SET ${update[0]} = ? , updated = CURRENT_TIMESTAMP
      WHERE id = ?`;
  const result = await query(command, [update[1], id]);

  return result;
}

export async function lookupProjectByName(project_name) {
  var command = `SELECT * FROM projects WHERE name = ?`;
  const result = await query(command, [project_name]);

  return result;
}
