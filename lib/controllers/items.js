const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const Item = require('../models/Item');

module.exports = Router().post('/', authenticate, async (req, res, next) => {
  try {
    const items = await Item.insert({
      user_id: req.user.id,
      ...req.body,
    });
    res.json(items);
  } catch (e) {
    next(e);
  }
});
