const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sortFilterPagination } = require('../utils/pagination');

class UserService {
  async create(data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const user = new User(data);
    await user.save();
    return user;
  }

  async login(email, password) {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid email or password');
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    return { user, token };
  }

  async findAll(query = {}) {
    const { page, limit, sort, sort_type, ...filters } = query;
    const sortData = { _id: '_id', email: 'email', name: 'name' };
    
    const totalRecord = await User.countDocuments(filters);
    const pagination = sortFilterPagination(page, limit, totalRecord, sortData, sort, sort_type);
    
    const items = await User.find(filters)
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
    return User.findById(id);
  }

  async update(id, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return User.findByIdAndUpdate(id, data, { new: true });
  }
}

module.exports = new UserService();
