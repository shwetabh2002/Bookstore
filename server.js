const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();


mongoose.connect('mongodb+srv://shwetabh183:123456admin@shwetabhapi.1i7iowa.mongodb.net/Node-API?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
      console.log('Server started on port 3000');
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

const routes = require('./routes');

app.use('/', routes);


const Book = require('./models/books');


app.get('/add_review', (req, res) => {
  res.render('add_review');
});

app.post('/books', (req, res) => {
  const { title, author, rating, review } = req.body;

  
  const newBook = new Book({
    title,
    author,
    rating,
    review,
  });

  newBook.save()
    .then(() => {
      console.log('Book review added to the database');
      res.redirect('/books');
    })
    .catch((err) => {
      console.error('Error saving book review to the database', err);
      res.status(500).send('An error occurred');
    });
});



app.get('/books/search', (req, res) => {
    const { query } = req.query;
  
    const searchRegex = new RegExp(query, 'i');
      Book.find({ $or: [{ title: searchRegex }, { author: searchRegex }] })
      .then((books) => {
        res.render('book_list', { books });
      })
      .catch((err) => {
        console.error('Error searching books', err);
        res.status(500).send('An error occurred');
      });
  });
  
module.exports = app;
