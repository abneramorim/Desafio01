const express = require('express');

const server = express();

server.use(express.json());

total_requisicoes = 0;

const projects = [];

function checkTitleExists(req, res, next) {
  if (!req.body.title) {
    return res.status(400).json({ error: 'Title project is required' });
  }

  return next();
}

function checkProjectInArray(req, res, next) {
  const project = projects[req.params.id];
  if (!project) {
    return res.status(400).json({ error: 'Project does not exists' })
  }
  req.project = project;
  return next();
}

server.use((req, res, next) => {
  total_requisicoes++;
  console.log(`Total de requisições até o momento - ${total_requisicoes}`);

  next();
})

server.post('/projects', checkTitleExists, (req, res) => {
  var project_temp = { 'id': (projects.length), 'title': req.body.title, 'tasks': [] };

  projects.push(project_temp);

  return res.json(projects);
});

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.get('/projects/:id', checkProjectInArray, (req, res) => {
  return res.json(req.project);
});

server.put('/projects/:id', checkTitleExists, checkProjectInArray, (req, res) => {
  const { id } = req.params;
  const {title} = req.body;

  projects[id].title = title;

  return res.json(projects[id]);
});

server.delete('/projects/:id', checkProjectInArray, (req, res) => {
  const { id } = req.params;

  projects.splice(id, 1);

  return res.send();
});

server.post('/projects/:id/tasks', checkProjectInArray, checkTitleExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects[id].tasks.push(title);

  return res.json(projects[id]);
})

server.listen(3001);