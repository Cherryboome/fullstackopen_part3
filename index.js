const express = require("express");
const app = express();

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123-4567",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "040-345-0987",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "040-213-7648",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "040-746-0399",
    id: 4
  }
];

const personsNum = () => {
  if (persons.length === 1) {
    return `${persons.length} person`;
  } else {
    return `${persons.length} people`;
  }
};

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.get("/info", (req, res) => {
  const date = new Date();
  res.send(`<div><p>Phonebook has info for ${personsNum()}</p> 
    <p>${date}</p></div>`);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);

  res.status(204).end();
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
