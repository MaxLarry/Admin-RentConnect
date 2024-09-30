const ActivityLog = require('../models/ActivityLogs.model');


const logActivity = async (adminId, adminName, role, action, ipAddress, changes) => {
    try {
      const log = new ActivityLog({
        admin_id: adminId,
        role,
        action,
        ip_address: ipAddress,
        changes,
        timestamps: new Date() // Optional: You can set this explicitly, but it's handled by the schema
      });
      await log.save();
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  };
  