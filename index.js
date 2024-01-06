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

app.use(customMorganFunction);

app.use(express.json());

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
	Person.find({}).then((persons) => {
		res.json(persons);
	});
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

	Person.findById(id)
		.then((foundPerson) => {
			if (foundPerson) {
				res.json(foundPerson);
			} else {
				res.status(404).json({ message: 'No Contact Found' }).end();
			}
		})
		.catch((error) => {
			console.error('Error:', error.message);
			res.status(500).json({ error: 'Internal server error.' }).end();
		});
});

app.delete('/api/persons/:id', (req, res) => {
	const { id } = req.params;

	Person.findByIdAndDelete(id).then(console.log('Person deleted from DB'));

	res.status(204).end();
});

app.post('/api/persons', (req, res, next) => {
	const { name, number } = req.body; //need  the json parser for this to work
	// const id = Math.floor(Math.random() * 1000000) + persons.length;

	if (!name || !number) {
		res.status(400).json({ error: 'Either name or number are missing.' }).end();
	}

	Person.findOne({ name: name }).then((foundPerson) => {
		if (foundPerson) {
			return res.status(400).json({ error: 'The name must be unique.' }).end();
		} else {
			const newPerson = new Person({
				name: name,
				number: number,
			});

			return newPerson.save().then((savedNewPerson) => res.json(savedNewPerson));
		}
	});
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
