const express = require('express');

const server = express();

server.use(express.json());

const host = '/projects'

const projects = [];
let requestCounter = 0;

server.use((req, res, next) => {
  requestCounter++;
  console.log(`Request number: ${requestCounter}`);

  next();
});

function checkIfIdExist(req, res, next) {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: 'Missing id parameter' });

  const project = projects.find((project) => {
    return project.id == id;
  });

  if (!project) return res.status(400).json({ error: 'This id project does not exists' });

  req.project = project;

  return next();
};

server.get(`${host}`, (req, res) => {
  return res.json(projects);
});

server.post(`${host}`, (req, res) => {
  const { id, title, tasks = [] } = req.body;
  
  const project = {
    id,
    title,
    tasks
  }
  
  projects.push(project);

  return res.json(projects);
});

server.put(`${host}/:id`, checkIfIdExist, (req, res) => {
  const { title } = req.body;

  req.project.title = title;

  return res.json(projects);
});

server.delete(`${host}/:id`, checkIfIdExist, (req, res) => {
  const { id } = req.params;

  const index = findProjectIndex(id);

  projects.splice(index, 1);

  return res.status(200).json({ message: 'Project deleted successfully'});
});

server.post(`${host}/:id/tasks`, checkIfIdExist, (req, res) => {
  const { title } = req.body;

  if (!title) return res.status(400).json({ error: 'Missing params' });

  req.project.tasks.push(title);

  return res.json(projects);
});

function findProjectIndex(id) {
  return projects.findIndex((project) => {
    return project.id == id;
  });
}

server.listen(3000);