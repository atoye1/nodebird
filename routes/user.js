const express = require('express');
const User = require('../models/user');
const router = express.Router();
const { isLoggedIn } = require('./middlewares');
const { addFollowing } = require('../controller/user');
router.post('/:id/follow', isLoggedIn, addFollowing);

router.delete('/:id/follow', isLoggedIn, async (req, res, next) => {
  console.log('unfollow id is', req.query.id);
  try {
    const user = await User.findOne({ where: { id: req.params.id } });
    if (user) {
      await user.removeFollowing(parseInt(req.query.id, 10));
      res.status(200).send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});
module.exports = router;