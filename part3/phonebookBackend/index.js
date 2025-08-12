const express = require('express');
const morgan = require('morgan');

// Custom token to log POST request body
morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '');


const app = express();
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const path = require('path');
app.use(express.static(path.join(__dirname, 'dist')));

let persons = [
	{ id: 1, name: 'Arto Hellas', number: '040-123456' },
	{ id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
	{ id: 3, name: 'Dan Abramov', number: '12-43-234345' },
	{ id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
];

const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((n) => Number(n.id))) : 0
  return String(maxId + 1)
}
app.get('/api/persons', (req, res) => {
	res.json(persons);
});

app.get('/info', (req, res) => {
	res.send(`
		Phonebook has info for ${persons.length} people<br>
    ${new Date()}`);
});

app.get('/api/persons/:id', (req, res) => {
	const id = Number(req.params.id);
	const person = persons.find(person => person.id === id);
	if (person) {
		res.json(person);
	} else {
		res.status(404).end();
	}
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter((person) => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body || !body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing',
    });
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique',
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };


  persons = persons.concat(person);

  response.json(person);
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
