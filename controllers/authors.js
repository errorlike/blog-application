const router = require('express').Router();
const { Blog } = require('../models');
const { sequelize } = require('../models/blog');
router.get('/', async (request, response) => {
  const authors = await Blog.findAll({
    attributes: ['author',
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
      [sequelize.fn('COUNT', sequelize.col('*')), 'articles']
    ],
    group: 'author',
    order: [['likes', 'DESC']]
  });
  response.json(authors);
});
module.exports = router;