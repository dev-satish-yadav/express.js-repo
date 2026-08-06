const adminService = require('../services/admin.service');

class AdminController {
  async create(req, res) {
    try {
      const admin = await adminService.create(req.body);
      res.status(201).json({ success: true, data: admin });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await adminService.login(email, password);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(401).json({ success: false, message: error.message });
    }
  }

  async findAll(req, res) {
    try {
      const result = await adminService.findAll(req.query);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async findOne(req, res) {
    try {
      const admin = await adminService.findOne(req.params.id);
      if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });
      res.status(200).json({ success: true, data: admin });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      const admin = await adminService.update(req.params.id, req.body);
      if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });
      res.status(200).json({ success: true, data: admin });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async remove(req, res) {
    try {
      const admin = await adminService.remove(req.params.id);
      if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });
      res.status(200).json({ success: true, message: 'Admin deleted successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AdminController();
