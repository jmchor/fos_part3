require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const customMorganFunction = morgan((tokens, req, res) => {
	return [
		tokens.method(req, res),
		tokens.url(req, res),
		tokens.status(req, res),
		tokens.res(req, res, 'content-length'),
		'-',
		req.method === 'POST' ? JSON.stringify(req.body) : '-',
		tokens['response-time'](req, res),
		'ms',
	].join(' ');
});

const Person = require('./models/person');

app.use(cors());

app.use(express.static('dist'));
app.use(express.json());
app.use(customMorganFunction);

// let persons = [
// 	{
// 		id: 1,
// 		name: 'Arto Hellas',
// 		number: '040-123456',
// 	},
// 	{
// 		id: 2,
// 		name: 'Ada Lovelace',
// 		number: '39-44-5323523',
// 	},
// 	{
// 		id: 3,
// 		name: 'Dan Abramov',
// 		number: '12-43-234345',
// 	},
// 	{
// 		id: 4,
// 		name: 'Mary Poppendieck',
// 		number: '39-23-6423122',
// 	},
// ];

app.get('/api/persons', (req, res, next) => {
	Person.find({})
		.then((persons) => {
			res.json(persons);
		})
		.catch((error) => next(error));
});

app.get('/api/info', (req, res, next) => {
	const requestTime = new Date().toTimeString();
	const requestDate = new Date().toDateString();
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	let allPersons = [];

	Person.find({})
		.then((persons) => {
			allPersons = persons;
			const message = `Phonebook has info for ${allPersons?.length} people. <br/> </br> ${requestDate}${requestTime} ${timezone}`;
			res.send(message);
		})
		.catch((error) => {
			next(error);
			console.error('Error:', error.message);
		});
});

app.get('/api/persons/:id', (req, res, next) => {
	const { id } = req.params;

	Person.findById(id)
		.then((foundPerson) => {
			if (foundPerson) {
				res.json(foundPerson);
			} else {
				res.status(404).json({ message: 'No Contact Found' }).end();
			}
		})
		.catch((error) => {
			next(error);
			console.error('Error:', error.message);
			res.status(500).json({ error: 'Internal server error.' }).end();
		});
});

app.delete('/api/persons/:id', (req, res, next) => {
	const { id } = req.params;

	Person.findByIdAndDelete(id)
		.then(console.log('Person deleted from DB'))
		.catch((error) => next(error));

	res.status(204).end();
});

app.post('/api/persons', (req, res, next) => {
	const { name, number } = req.body;

	if (!name || !number) {
		return res.status(400).json({ error: 'Both name and number are required.' }).end();
	}

	const newPerson = new Person({
		name: name,
		number: number,
	});

	return newPerson
		.save()
		.then((savedNewPerson) => res.status(201).json(savedNewPerson)) // 201 Created status code
		.catch((error) => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
	const { id } = req.params;
	const { number, name } = req.body;

	console.log(id, number, name);

	Person.findByIdAndUpdate(id, { number, name }, { new: true, runValidators: true, context: 'query' })
		.then((updatedPerson) => res.json(updatedPerson))
		.catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' });
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message });
	}

	next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
