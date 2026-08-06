const Admin = require('../models/admin.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class AdminService {
  async create(data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const admin = new Admin(data);
    await admin.save();
    return admin;
  }

  async login(email, password) {
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      throw new Error('Invalid email or password');
    }
    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    return { admin, token };
  }

  async findAll(query = {}) {
    return Admin.find(query);
  }

  async findOne(id) {
    return Admin.findById(id);
  }

  async update(id, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return Admin.findByIdAndUpdate(id, data, { new: true });
  }

  async remove(id) {
    return Admin.findByIdAndDelete(id);
  }
}

module.exports = new AdminService();
