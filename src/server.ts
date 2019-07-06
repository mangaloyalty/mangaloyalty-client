// Initialize the server router paths.
const express = require('express');
const router = express.Router();
router.use(express.static(`${__dirname}/../public`));

// Initialize the server.
if (require.main === module) {
  const server = express();
  server.disable('x-powered-by');
  server.use(router);
  server.listen(7767, () => console.log(`Client running on http://localhost:7767/`));
} else {
  module.exports = router;
}
