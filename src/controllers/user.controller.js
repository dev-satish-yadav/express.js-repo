const userService = require('../services/user.service');

class UserController {
  async create(req, res) {
    try {
      const user = await userService.create(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await userService.login(email, password);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(401).json({ success: false, message: error.message });
    }
  }

  async findAll(req, res) {
    try {
      const result = await userService.findAll(req.query);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async findOne(req, res) {
    try {
      const user = await userService.findOne(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      const user = await userService.update(req.params.id, req.body);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new UserController();
