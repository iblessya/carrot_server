const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/about', (req, res) => {
    res.send('About page');
});

app.listen(port, () => {
    console.log(`웹서버 구동 ... ${port}`);
});

app.get('/users/:userId', (req, res) => {
    res.send(`User ID: ${req.params.userId}`);
});

app.get('/users', (req, res) => {
    const { sortBy, order } = req.query;
    res.send(`Sorting by ${sortBy} in ${order} order`);
});

app.post('/users', (req, res) => {
    const { name, email } = req.body;
    res.send(`Creating user with name: ${name}, email: ${email}`);
});

app.get('/api/data', (req, res) => {
    res.json({message: "This is a JSON response"});
});

app.get('/download', (req, res) => {
    res.sendFile('/path/to/yourfile.pdf');
});

app.get('/old-page', (req, res) => {
    res.redirect('/new-page');
});

app.post('/api/users', (req, res) => {
    res.status(201).send('User created');
});