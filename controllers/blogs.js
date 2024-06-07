const router = require('express').Router();
const { Blog } = require('../models');
const blogFinder = async (request, response, next) => {
  request.blog = await Blog.findByPk(request.params.id);
  next();
};

router.get('/', async (request, response) => {
  const blogs = await Blog.findAll();
  response.json(blogs);
});

router.post('/', async (request, response) => {
  const blog = await (Blog.create(request.body));
  response.status(201).json(blog);
});

router.delete('/:id', blogFinder, async (request, response) => {
  if (request.blog) {
    await request.blog.destroy();
    response.status(204).end();
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