/* global process __dirname */
require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const Person = require('./models/person');

// Custom token to log POST request body
morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '');

const app = express();
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const path = require('path');
app.use(express.static(path.join(__dirname, 'dist')));

// Removed in-memory persons array and generateId function
app.get('/api/persons', (req, res) => {
	Person.find({}).then(result => {
    res.json(result);
  })
});

app.get('/info', (req, res) => {
  Person.countDocuments({}).then(count => {
    res.send(`
      Phonebook has info for ${count} people<br>
      ${new Date()}`);
  });
});

app.get('/api/persons/:id', (request, response, next) => {

  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  }).catch(error => next(error))
});


app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    // eslint-disable-next-line no-unused-vars
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' });
    });
});

app.post('/api/persons', (request, response, next) => {
  const body = request.body;

  if (!body || !body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing',
    });
  }

  Person.findOne({ name: body.name }).then(existingPerson => {
    if (existingPerson) {
      return response.status(400).json({
        error: 'name must be unique',
      });
    }

    const person = new Person({
      name: body.name,
      number: body.number,
    });

    person.save()
      .then(savedPerson => {
        response.json(savedPerson);
      })
      .catch(error => next(error));
  });
});

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body;

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson);
    })
    .catch(error => next(error));
});


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    // Show only the first validation error message
    const messages = Object.values(error.errors).map(e => e.message);
    return response.status(400).json({ error: messages.join(', ') });
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
