import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';

export const register = async (req, res) => {
  try {
    const { name, username, email, password, role, dob, securityQuestion, securityAnswer } = req.body;
    if (!name || !username || !email || !password || !dob || !securityQuestion || !securityAnswer) {
      return res.status(400).json({ success: false, error: 'Please provide all fields, including security questions' });
    }

    if (role === 'admin' && !email.toLowerCase().endsWith('@ethara.in')) {
      return res.status(403).json({ success: false, error: 'Admin registration requires an internal @ethara.in email address.' });
    }

    if (role === 'user' && email.toLowerCase().endsWith('@ethara.in')) {
      return res.status(400).json({ success: false, error: 'Internal domain emails (@ethara.in) must be registered with admin privileges.' });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ success: false, error: 'Password must contain at least one letter, one number, and one symbol' });
    }

    const userExists = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() }, 
        { username: username.toLowerCase() }
      ] 
    });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'User with this email or username already exists' });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      username,
      email,
      passwordHash,
      role: role === 'admin' ? 'admin' : 'user',
      dob,
      securityQuestion,
      securityAnswer,
    });

    if (user) {
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);
      
      const saltRefresh = await bcrypt.genSalt(10);
      user.refreshToken = await bcrypt.hash(refreshToken, saltRefresh);
      await user.save();

      res.status(201).json({
        success: true,
        data: {
          accessToken,
          refreshToken,
          user: { id: user.id, name: user.name, username: user.username, email: user.email, role: user.role, avatarUrl: user.avatarUrl },
        },
      });
    } else {
      res.status(400).json({ success: false, error: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ success: false, error: 'Please provide username/email and password' });
    }

    const searchIdentifier = identifier.toLowerCase();
    const user = await User.findOne({ 
      $or: [{ email: searchIdentifier }, { username: searchIdentifier }] 
    });

    if (user && (await user.matchPassword(password))) {
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);
      
      const saltRefresh = await bcrypt.genSalt(10);
      user.refreshToken = await bcrypt.hash(refreshToken, saltRefresh);
      await user.save();

      res.json({
        success: true,
        data: {
          accessToken,
          refreshToken,
          user: { id: user.id, name: user.name, username: user.username, email: user.email, role: user.role, avatarUrl: user.avatarUrl },
        },
      });
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ success: false, error: 'No refresh token provided' });
    }

    // Usually you'd verify the token first
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (e) {
      return res.status(401).json({ success: false, error: 'Invalid refresh token' });
    }

    const user = await User.findById(decoded.userId);
    if (!user || !user.refreshToken) {
      return res.status(401).json({ success: false, error: 'User not found or logged out' });
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Invalid refresh token' });
    }

    const newAccessToken = generateAccessToken(user._id);
    res.json({ success: true, data: { accessToken: newAccessToken } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash -refreshToken');
    if (user) {
      res.json({ success: true, data: user });
    } else {
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('_id name email username avatarUrl');
    res.json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (user && (await user.matchPassword(currentPassword))) {
      const salt = await bcrypt.genSalt(12);
      user.passwordHash = await bcrypt.hash(newPassword, salt);
      await user.save();
      res.json({ success: true, message: 'Password updated successfully' });
    } else {
      res.status(401).json({ success: false, error: 'Invalid current password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
export const forgotPassword = async (req, res) => {
  try {
    const { email, dob, securityQuestion, securityAnswer, newPassword } = req.body;
    
    if (!email || !dob || !securityQuestion || !securityAnswer || !newPassword) {
      return res.status(400).json({ success: false, error: 'Please provide all required fields' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Check DOB
    const userDob = new Date(user.dob).toISOString().split('T')[0];
    const providedDob = new Date(dob).toISOString().split('T')[0];

    if (userDob !== providedDob) {
      return res.status(401).json({ success: false, error: 'Verification failed: Incorrect Date of Birth' });
    }

    // Check Security Question and Answer
    if (user.securityQuestion !== securityQuestion) {
      return res.status(401).json({ success: false, error: 'Verification failed: Security question mismatch' });
    }

    if (user.securityAnswer.toLowerCase().trim() !== securityAnswer.toLowerCase().trim()) {
      return res.status(401).json({ success: false, error: 'Verification failed: Incorrect security answer' });
    }

    // All good, reset password
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ success: false, error: 'New password must contain at least one letter, one number, and one symbol' });
    }

    const salt = await bcrypt.genSalt(12);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.refreshToken = null; // Logout from all devices
    await user.save();

    res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server error during password reset' });
  }
};
