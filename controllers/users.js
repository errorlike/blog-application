const router = require('express').Router();

const { User } = require('../models');

router.get('/', async (request, response) => {
  const users = await User.findAll();
  response.json(users);
});

router.post('/', async (request, response) => {
  try {
    const user = await User.create(request.body);
    response.json(user);
  } catch (error) {
    return response.status(400).json({ error });
  }
});

router.get('/:id', async (request, response) => {
  const user = await User.findByPk(request.params.id);
  if (user) {
    response.json(user);
  } else {
    response.status(404).end();
  }
});
router.put('/:username', async (request, response) => {
  const user = await User.findOne({ where: { username: request.params.username } });
  if (user) {
    user.username = request.body.username;
    user.save()
    response.json(user);
  } else {
    response.status(404).end();
  }
});
module.exports = router;