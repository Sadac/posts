const express = require('express');
const bodyParser = require('body-parser'); // eslint-disable-line
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json());

const posts = {};

app.get('/posts', (req, res) => {
  res.status(200).send(posts);
});

app.post('/posts', (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = {
    id, title,
  };

  res.status(201).send(posts[id]);
});

app.listen(4000, () => {
  console.log('Listening on port 4000');
});
