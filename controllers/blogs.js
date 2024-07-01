const router = require('express').Router();
const { Blog, User } = require('../models');
const { SECRET } = require('../util/config');
const jwt = require('jsonwebtoken');
const blogFinder = async (request, response, next) => {
  request.blog = await Blog.findByPk(request.params.id);
  next();
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      return res.status(401).json({ error: 'token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }
  next();
};
router.get('/', async (request, response) => {
  const blogs = await Blog.findAll({ attributes: { exclude: ['userId'] },include:{
    model:User,
    attributes:['name']
  } });
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
module.exports = router;