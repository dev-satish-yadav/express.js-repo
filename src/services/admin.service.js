const Admin = require('../models/admin.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sortFilterPagination } = require('../utils/pagination');

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
    const { page, limit, sort, sort_type, ...filters } = query;
    const sortData = { _id: '_id', email: 'email', name: 'name' };
    
    const totalRecord = await Admin.countDocuments(filters);
    const pagination = sortFilterPagination(page, limit, totalRecord, sortData, sort, sort_type);
    
    const items = await Admin.find(filters)
      .sort(pagination.sort)
      .skip(pagination.start_from)
      .limit(pagination.per_page);
      
    return {
      data: items,
      total_count: totalRecord,
      prev_enable: pagination.prev_enable,
      next_enable: pagination.next_enable,
      total_pages: pagination.total_pages,
      per_page: pagination.per_page,
      page: pagination.page
    };
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
