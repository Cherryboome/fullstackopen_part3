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

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
