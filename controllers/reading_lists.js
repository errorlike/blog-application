const ReadingList = require('../models/reading_list');

const router = require('express').Router();

router.get('/', async (request, response) => {
  const readingLists = await ReadingList.findAll(
    {
      attributes: { exclude: ['id'] }
    });
    return response.json(readingLists)
});
module.exports = router;