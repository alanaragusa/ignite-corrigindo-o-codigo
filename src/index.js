const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

// GET - deve retornar uma lista de todos os repositórios cadastrados //
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

// POST - rota recebe title, url e techs pelo corpo da requisição e retornar um objeto com as informações do repositório criado e status 201 //
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repositoryAlreadyExists = repositories.some((repository) => repository.title === title);

  if(repositoryAlreadyExists){
    return response.status(400).json({error: "Repository already exists!"});
  }

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

// PUT - rota deve receber title, url e techs pelo corpo da requisição e o id do repositório pelo parametro da rota. Deve alterar apenas as informações recebidas pelo corpo da requisição e retornar esse repositório atualizado //
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const updatedRepository = request.body;

  repositoryIndex = repositories.findindex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const repository = { ...repositories[repositoryIndex], ...updatedRepository };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

// DELETE - rota deve receber, pelo parametro da rota, o id do repositório que deve ser excluido e retornar um status 204 após a exclusão //
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex > 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

// POST - rota deve receber, pelo parametro da rota, o id do repositório que deve receber o like e retornar o repositório com as quantidades de likes atualizadas //
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const likes = ++repositories[repositoryIndex].likes;

  return response.json('likes');
});

module.exports = app;
