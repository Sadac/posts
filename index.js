const express = require('express');
const bodyParser = require('body-parser'); // eslint-disable-line
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json());

const posts = {};

app.get('/posts', (req, res) => {
  res.status(200).send(posts);
});

app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = {
    id, title,
  };

  // emit an event whenever a post is being created and send it to event-bus service
  await axios.post('http://localhost:4005/events', {
    type: 'PostCreated',
    data: {
      id, title,
    },
  });

  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  console.log('Recevied Event: ', req.body.type);

  res.send({});
});

app.listen(4000, () => {
  console.log('POSTS_SERVICE: Listening on port 4000');
});
