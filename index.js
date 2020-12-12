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

app.post('/posts/create', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = {
    id, title,
  };

  // emit an event whenever a post is being created and send it to event-bus service
  /**
   * http://localhost:4005/events this URL works when we are in localhost (local machine)
   * But since we're using kubernetes and creating a Service
   * to communicate Pods (posts/event-bus) we've to replace the url with some new url
   *
   * We need to replace localhost:4005 with the name of the Service:
   * @type kubectl get services
   * NAME: event-bus-srv - TYPE: ClusterIP (take the NAME event-bus-srv)
   */
  try {
    await axios.post('http://event-bus-srv:4005/events', {
      type: 'PostCreated',
      data: {
        id, title,
      },
    });
  } catch (error) {
    console.log('::::: error');
    console.log(error);
  }

  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  console.log('Recevied Event: ', req.body.type);

  res.send({});
});

app.listen(4000, () => {
  console.log('v1000');
  // This port will be exposed on the k8s/posts-srv.yaml
  console.log('POSTS_SERVICE: Listening on port 4000');
});
