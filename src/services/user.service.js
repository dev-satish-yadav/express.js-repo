const User = require('../models/user.model');
const UserToken = require('../models/user-token.model');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { sortFilterPagination } = require('../utils/pagination');
const userCacheService = require('../cache/user-cache.service');


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
    
    if (!user.isActive) {
      throw new Error('Account disabled');
    }

    const token = crypto.randomBytes(30).toString('hex');
    await UserToken.create({ userId: user._id, token });
    
    const userToCache = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
    };
    await userCacheService.addUserToCache(userToCache, token);
    
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
