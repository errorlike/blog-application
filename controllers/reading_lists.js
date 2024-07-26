const ReadingList = require('../models/reading_list');
const { tokenExtractor } = require('../util/middleware');
const router = require('express').Router();

const readingListFinder = async (request, response, next) => {
  request.readingList = await ReadingList.findByPk(request.params.id);
  next();
};
router.get('/', async (request, response) => {
  const readingLists = await ReadingList.findAll(
    {
      attributes: { exclude: ['id'] }
    });
  return response.json(readingLists);
});
router.put('/:id', tokenExtractor, readingListFinder, async (request, response) => {
  const readingList = request.readingList;
  if (request.decodedToken.id === readingList.userId && readingList) {
    request.readingList.read = request.body.read;
    request.readingList.save();
    response.json(request.readingList);
  } else {
    response.status(404).end();
  }
});
module.exports = router;