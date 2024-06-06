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
  try {
    const blog = await (Blog.create(request.body));
    response.status(201).json(blog);
  } catch (error) {
    response.status(400).json({ error });
  }
});
router.delete('/:id', blogFinder,async (request,  response) => {
  try {
    if (request.blog) {
      await request.blog.destroy();
      response.status(204).end();
    }
  } catch (error) {
    response.status(404).json({ error });
  }
});
module.exports = router;