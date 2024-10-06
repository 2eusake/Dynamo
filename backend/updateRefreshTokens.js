require('dotenv').config(); // Load environment variables

const jwt = require('jsonwebtoken');
const User = require('./models/User'); // Ensure path is correct

const updateRefreshTokens = async () => {
  try {
    if (!process.env.REFRESH_TOKEN_SECRET) {
      throw new Error('REFRESH_TOKEN_SECRET is not defined');
    }

    const users = await User.findAll(); // Get all users

    for (let user of users) {
      const refreshToken = jwt.sign({ id: user.id, role: user.role }, process.env.REFRESH_TOKEN_SECRET);

      user.refreshToken = refreshToken;
      await user.save();
      
      console.log(`Updated user ${user.email} with new refresh token.`);
    }
  } catch (error) {
    console.error('Error updating refresh tokens:', error);
  }
};

updateRefreshTokens();
