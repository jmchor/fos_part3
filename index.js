const express = require('express');
const app = express();
app.use(express.json());

let persons = [
	{
		id: 1,
		name: 'Arto Hellas',
		number: '040-123456',
	},
	{
		id: 2,
		name: 'Ada Lovelace',
		number: '39-44-5323523',
	},
	{
		id: 3,
		name: 'Dan Abramov',
		number: '12-43-234345',
	},
	{
		id: 4,
		name: 'Mary Poppendieck',
		number: '39-23-6423122',
	},
];

app.get('/api/persons', (req, res, next) => {
	res.json(persons);
});

app.get('/api/info', (req, res, next) => {
	const requestTime = new Date().toTimeString();
	const requestDate = new Date().toDateString();
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const message = `Phonebook has info for ${persons.length} people. <br/> </br> ${requestDate}${requestTime} ${timezone}`;
	res.send(message);
});

app.get('/api/persons/:id', (req, res, next) => {
	const { id } = req.params;

	console.log(id);

	const foundPerson = persons.find((person) => person.id === Number(id));
	if (foundPerson) {
		res.json(foundPerson);
	} else {
		console.log('No Contact Found');
		res.status(404).json({ message: 'No Contact Found' }).end();
	}
});

app.delete('/api/persons/:id', (req, res) => {
	const { id } = req.params;
	persons = persons.filter((person) => person.id !== Number(id));

	res.status(204).end();
});

app.post('/api/persons', (req, res, next) => {
	const { name, number } = req.body; //need  the json parser for this to work
	const id = Math.floor(Math.random() * 1000000) + persons.length;

	if (!name || !number) {
		res.status(400).json({ error: 'Either name or number are missing.' }).end();
	}

	if (persons.some((person) => person.name === name)) {
		res.status(400).json({ error: 'The name must be unique.' }).end();
	}

	const newPerson = { id, name, number };
	persons = [...persons, newPerson];
	res.json(persons);
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
