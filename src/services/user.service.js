const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
    return User.find(query);
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
