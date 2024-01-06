// const mongoose = require('mongoose');

// if (process.argv.length < 3) {
// 	console.log('give password as argument');
// 	process.exit(1);
// }

// const password = process.argv[2];

// const url = `mongodb+srv://jmchorzempa:${password}@fullstackopencluster.ar4vpt7.mongodb.net/?retryWrites=true&w=majority`;

// mongoose.set('strictQuery', false);
// mongoose.connect(url);

// const personSchema = new mongoose.Schema({
// 	name: String,
// 	number: String,
// 	id: Number,
// });

// const Person = mongoose.model('Person', personSchema);

// const name = process.argv[3];
// const number = process.argv[4];
// const id = Math.floor(Math.random() * 1000000) + 98;
// if (name && number) {
// 	const person = new Person({
// 		name: name,
// 		number: number,
// 		id: id,
// 	});
// 	person.save().then((result) => {
// 		console.log('new person saved!');
// 		mongoose.connection.close();
// 	});
// } else {
// 	Person.find({}).then((persons) => {
// 		console.log('phonebook:');
// 		persons.forEach((contact) => {
// 			console.log(contact.name, contact.number);
// 			mongoose.connection.close();
// 		});
// 	});
// }
