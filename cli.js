require('dotenv').config();

const express = require('express');
const app = express();
app.use(express.json());
const { Sequelize, Model, INTEGER, DataTypes} = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);

class Blog extends Model { }
Blog.init({
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
});
app.get('/api/blogs', async (request, response) => {
  const blogs = await Blog.findAll();
  response.json(blogs);
});
app.post('/api/blogs', async (request, response) => {
  try {
    const blog = await (Blog.create(request.body));
    response.status(201).json(blog);
  } catch (error) {
    response.status(400).json({ error });
  }
});
app.delete('/api/blogs/:id', async (request, response) => {
  const blog = await Blog.findByPk(request.params.id);
  try {
    await blog.destroy();
  } catch (error) {
    response.status(404).json({ error });
  }
  response.status(204).end();
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});