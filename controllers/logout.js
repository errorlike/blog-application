const router = require('express').Router();

const Session = require('../models/session');
const { tokenExtractor } = require('../util/middleware');

router.delete('/', tokenExtractor, async (request, response) => {
  const session = await Session.findOne({
    where: {
      userId: request.decodedToken.id
    }
  });
  if (session) {
    await session.destroy();
  }
  response.status(204).end()
});
module.exports = router;