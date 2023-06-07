const express = require('express');
const router = express.Router();
const User = require('./models/user');
const Review = require('./models/review');


router.get('/signup', (req, res) => {
  res.render('signup');
});


router.post('/signup', (req, res) => {
  const { username, email, password } = req.body;


  const newUser = new User({
    username,
    email,
    password,
  });

  newUser.save()
    .then(() => {
      res.redirect('/login');
    })
    .catch((err) => {
      console.error('Error saving user to the database', err);
      res.status(500).send('An error occurred');
    });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.redirect('/login');
      } else {
        if (password === user.password) {
          res.redirect('/books');
        } else {
          res.redirect('/login');
        }
      }
    })
    .catch((err) => {
      console.error('Error finding user in the database', err);
      res.status(500).send('An error occurred');
    });
});

router.get('/add-review', (req, res) => {
  res.render('add_review');
});

const Book = require('./models/books');

router.get('/books', (req, res) => {
  Book.find({}, 'title author review')
    .then((books) => {
      res.render('book_reviews', { books });
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred' });
    });
});


  

router.post('/add-review', (req, res) => {
  const { title, author, rating, review } = req.body;

  const newReview = new Review({
    title,
    author,
    rating,
    review,
  });

  newReview.save()
    .then(() => {
      res.redirect('/books');
    })
    .catch((err) => {
      console.error('Error saving review to the database', err);
      res.status(500).send('An error occurred');
    });
});

module.exports = router;
