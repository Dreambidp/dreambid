import User from '../models/User.js';
import UserActivity from '../models/UserActivity.js';

class UserController {
  static formatUserResponse(user) {
    if (!user) {
      return user;
    }

    const response = {
      ...user,
      profile_photo_data: undefined,
      profile_photo_mime_type: undefined
    };

    if (user.profile_photo_data) {
      const base64Photo = Buffer.from(user.profile_photo_data).toString('base64');
      response.profile_photo = `data:${user.profile_photo_mime_type || 'image/jpeg'};base64,${base64Photo}`;
    }

    return response;
  }

  // Get current logged-in user info
  static async getMe(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const formattedUser = UserController.formatUserResponse(user);
      const { password_hash, ...userWithoutPassword } = formattedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Failed to fetch user info' });
    }
  }

  // Update user profile
  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { full_name, phone } = req.body;

      // Validate input
      if (!full_name || full_name.trim().length === 0) {
        return res.status(400).json({ message: 'Full name is required' });
      }

      const updatedUser = await User.update(userId, {
        full_name,
        phone
      });

      // Log activity
      UserActivity.log(userId, 'profile_updated', 'user_profile', {
        fields_updated: ['full_name', 'phone']
      }).catch(err => console.warn('Activity logging failed:', err.message));

      const { password_hash, ...userWithoutPassword } = updatedUser;
      res.json({
        message: 'Profile updated successfully',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Failed to update profile' });
    }
  }

  // Upload profile photo
  static async uploadPhoto(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file provided' });
      }

      const userId = req.user.id;
      const updatedUser = await User.updateProfilePhoto(
        userId,
        req.file.buffer,
        req.file.mimetype
      );

      // Log activity
      UserActivity.log(userId, 'profile_photo_uploaded', 'user_profile', {
        mime_type: req.file.mimetype
      }).catch(err => console.warn('Activity logging failed:', err.message));

      const formattedUser = UserController.formatUserResponse(updatedUser);
      const { password_hash, ...userWithoutPassword } = formattedUser;
      res.json({
        message: 'Profile photo uploaded successfully',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      res.status(500).json({ message: 'Failed to upload photo' });
    }
  }

  // Delete profile photo
  static async deletePhoto(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);

      if (!user || (!user.profile_photo && !user.profile_photo_data)) {
        return res.status(404).json({ message: 'No profile photo found' });
      }

      // Remove binary profile photo from database
      const updatedUser = await User.updateProfilePhoto(userId, null, null);

      // Log activity
      UserActivity.log(userId, 'profile_photo_deleted', 'user_profile').catch(
        err => console.warn('Activity logging failed:', err.message)
      );

      const formattedUser = UserController.formatUserResponse(updatedUser);
      const { password_hash, ...userWithoutPassword } = formattedUser;
      res.json({
        message: 'Profile photo deleted successfully',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Error deleting photo:', error);
      res.status(500).json({ message: 'Failed to delete photo' });
    }
  }

  // Change password
  static async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword, confirmPassword } = req.body;

      // Validate input
      if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'New passwords do not match' });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters' });
      }

      // Verify current password
      const user = await User.findByIdWithPassword(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const isPasswordValid = await User.verifyPassword(currentPassword, user.password_hash);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      // Update password
      await User.updatePassword(userId, newPassword);

      // Log activity
      UserActivity.log(userId, 'password_changed', 'security').catch(
        err => console.warn('Activity logging failed:', err.message)
      );

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ message: 'Failed to change password' });
    }
  }

  // Get user activity
  static async getUserActivity(req, res) {
    try {
      const userId = req.user.id;
      const { limit = 50, offset = 0, daysBack = 30 } = req.query;

      const activities = await UserActivity.getUserActivity(
        userId,
        parseInt(limit),
        parseInt(offset)
      );

      const count = await UserActivity.getUserActivityCount(userId);
      
      // Also fetch activity stats for the dashboard
      const stats = await UserActivity.getUserActivityStats(userId, parseInt(daysBack));

      res.json({
        activities,
        stats,
        total: count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (error) {
      console.error('Error fetching user activity:', error);
      res.status(500).json({ message: 'Failed to fetch activity' });
    }
  }

  // Get user activity statistics
  static async getActivityStats(req, res) {
    try {
      const userId = req.user.id;
      const { daysBack = 30 } = req.query;

      const stats = await UserActivity.getUserActivityStats(userId, parseInt(daysBack));

      res.json(stats);
    } catch (error) {
      console.error('Error fetching activity stats:', error);
      res.status(500).json({ message: 'Failed to fetch activity stats' });
    }
  }

  // Get all users (admin only)
  static async getAllUsers(req, res) {
    try {
      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized - Admin access required' });
      }

      const { limit = 50, offset = 0, search = '' } = req.query;

      let query = `SELECT id, email, full_name, phone, role, is_active, created_at, updated_at 
                   FROM users`;
      const params = [];

      if (search && search.trim()) {
        query += ` WHERE (email ILIKE $1 OR full_name ILIKE $1 OR phone ILIKE $1)`;
        params.push(`%${search}%`);
      }

      query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(parseInt(limit), parseInt(offset));

      const result = await pool.query(query, params);
      const users = result.rows;

      // Get total count
      let countQuery = 'SELECT COUNT(*) as total FROM users';
      const countParams = [];

      if (search && search.trim()) {
        countQuery += ` WHERE (email ILIKE $1 OR full_name ILIKE $1 OR phone ILIKE $1)`;
        countParams.push(`%${search}%`);
      }

      const countResult = await pool.query(countQuery, countParams);
      const total = parseInt(countResult.rows[0].total);

      res.json({
        data: users,
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (error) {
      console.error('Error fetching all users:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  }

  // Get user details by ID (admin only)
  static async getUserDetails(req, res) {
    try {
      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized - Admin access required' });
      }

      const { userId } = req.params;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Get user activities
      const activities = await UserActivity.getUserActivity(userId, 10, 0);
      const activityStats = await UserActivity.getUserActivityStats(userId, 30);
      const formattedUser = UserController.formatUserResponse(user);

      res.json({
        user: formattedUser,
        activities,
        stats: activityStats
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({ message: 'Failed to fetch user details' });
    }
  }

  // Update user status (admin only)
  static async updateUserStatus(req, res) {
    try {
      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized - Admin access required' });
      }

      const { userId } = req.params;
      const { is_active } = req.body;

      if (is_active === undefined) {
        return res.status(400).json({ message: 'is_active field is required' });
      }

      const updatedUser = await User.update(userId, { is_active });

      res.json({
        message: 'User status updated successfully',
        user: updatedUser
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      res.status(500).json({ message: 'Failed to update user status' });
    }
  }

  // Update user role (admin only)
  static async updateUserRole(req, res) {
    try {
      // Check if user is admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized - Admin access required' });
      }

      const { userId } = req.params;
      const { role } = req.body;

      if (!role || !['user', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role specified' });
      }

      const updatedUser = await User.update(userId, { role });

      res.json({
        message: 'User role updated successfully',
        user: updatedUser
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      res.status(500).json({ message: 'Failed to update user role' });
    }
  }
}

export default UserController;
