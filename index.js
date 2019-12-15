require("dotenv").config();
const express = require("express");
const morgan = require("morgan");

const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const Person = require("./models/person");

app.use(express.static("build"));
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
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person.toJSON());
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.get("/api/info", (req, res) => {
  const date = new Date();
  res.send(`<div><p>Phonebook has info for ${personsNum()}</p> 
    <p>${date}</p></div>`);
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end();
    })
    .catch(error => next(error));
});

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (body.name === undefined) {
    return res.status(400).json({
      error: "name missing"
    });
  } else if (body.number === undefined) {
    return res.status(400).json({
      error: "number missing"
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number
  });

  person.save().then(savedPerson => {
    res.json(savedPerson.toJSON());
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
