const router = require('express').Router();
const { Op } = require('sequelize');
const { Blog, User } = require('../models');
const { tokenExtractor } = require('../util/middleware');
const { sequelize } = require('../models/blog');
const blogFinder = async (request, response, next) => {
  request.blog = await Blog.findByPk(request.params.id);
  next();
};

router.get('/', async (request, response) => {
  const where = {};
  if (request.query.search) {
    where[Op.or] = [
      {
        title: {
          [Op.like]: `%${request.query.search}%`
        }
      },
      {
        author: {
          [Op.like]: `%${request.query.search}%`
        }
      }
    ];
  }
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: [['likes', 'DESC']]
  });

  response.json(blogs);
});

router.post('/', tokenExtractor, async (request, response) => {
  const user = await User.findByPk(request.decodedToken.id);
  const blog = await (Blog.create({ ...request.body, userId: user.id }));
  response.status(201).json(blog);
});

router.delete('/:id', tokenExtractor, blogFinder, async (request, response) => {
  const blog = request.blog;
  if (blog) {
    console.log(blog.userId);
    if (blog.userId === request.decodedToken.id) {
      await blog.destroy();
      response.status(204).end();
    } else {
      response.status(403).end();
    }
  }
});

router.put('/:id', blogFinder, async (request, response) => {
  if (request.blog) {
    request.blog.likes = request.body.likes;
    request.blog.save();
    response.json(request.blog);
  } else {
    response.status(404).end();
  }
});
router.get('/authors', async (request, response) => {
  const authors = Blog.findAll({
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