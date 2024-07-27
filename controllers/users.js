const router = require('express').Router();

const { User, Blog } = require('../models');

router.get('/', async (request, response) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  });
  response.json(users);
});

router.post('/', async (request, response) => {
  const user = await User.create(request.body);
  response.json(user);
});

router.get('/:id', async (request, response) => {
  const where = {};
  if (request.query.read) {
    where.read = request.query.read === 'true';

  }
  const user = await User.findByPk(request.params.id, {
    attributes: ['name', 'username'],
    include: {
      model: Blog,
      as: 'readings',
      attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
      through: {
        attributes: ['read', 'id'],
        where
      },
    },
  });
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
    await user.save();
    response.json(user);
  } else {
    response.status(404).end();
  }
});
module.exports = router;