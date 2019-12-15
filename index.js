require("dotenv").config();
const express = require("express");
const morgan = require("morgan");

const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const Person = require("./models/person");

app.use(bodyParser.json());
app.use(cors());

app.use(
  morgan((tokens, req, res) => {
    const body = req.body;

    if (tokens.method(req, res) === "POST") {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, "content-length"),
        "-",
        tokens["response-time"](req, res),
        "ms",
        JSON.stringify(body)
      ].join(" ");
    } else {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, "content-length"),
        "-",
        tokens["response-time"](req, res),
        "ms"
      ].join(" ");
    }
  })
);

// let persons = [
//   {
//     name: "Arto Hellas",
//     number: "040-123-4567",
//     id: 1
//   },
//   {
//     name: "Ada Lovelace",
//     number: "040-345-0987",
//     id: 2
//   },
//   {
//     name: "Dan Abramov",
//     number: "040-213-7648",
//     id: 3
//   },
//   {
//     name: "Mary Poppendieck",
//     number: "040-746-0399",
//     id: 4
//   }
// ];

app.use(express.static("build"));

const personsNum = () => {
  if (persons.length === 1) {
    return `${persons.length} person`;
  } else {
    return `${persons.length} people`;
  }
};

app.get("/api/persons", (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()));
  });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then(person => {
    res.json(person.toJSON());
  });
  // const id = Number(req.params.id);
  // const person = persons.find(person => person.id === id);

  // if (person) {
  //   res.json(person);
  // } else {
  //   res.status(404).end();
  // }
});

app.get("/api/info", (req, res) => {
  const date = new Date();
  res.send(`<div><p>Phonebook has info for ${personsNum()}</p> 
    <p>${date}</p></div>`);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);

  res.status(204).end();
});

// const generateId = () => {
//   const id = persons.length > 0 ? Math.round(Math.random() * 1000) : 0;
//   const personId = persons.find(person => person.id === id);

//   if (personId) {
//     return generateId();
//   } else {
//     return id;
//   }
// };

app.post("/api/persons", (req, res) => {
  const body = req.body;

  // const existingPerson = persons.find(
  //   person => person.name.toLowerCase() === body.name.toLowerCase()
  // );

  if (body.name === undefined) {
    return res.status(400).json({
      error: "name missing"
    });
  } else if (body.number === undefined) {
    return res.status(400).json({
      error: "number missing"
    });
  }
  // else if (existingPerson) {
  //   return res.status(409).json({ error: "name must be unique" });
  // }

  const person = new Person({
    name: body.name,
    number: body.number
    // id: generateId()
  });

  person.save().then(savedPerson => {
    res.json(savedPerson.toJSON());
  });

  // persons = persons.concat(person);

  // res.json(person);
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
