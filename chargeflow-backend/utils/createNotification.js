const Notification = require("../models/Notification");

/**
 * Creates and saves a Notification document for a user.
 * Can be called asynchronously from any controller/service.
 */
async function createNotification({ user, title, message, type, relatedEntity }) {
  try {
    const notification = await Notification.create({
      user,
      title,
      message,
      type,
      relatedEntity: relatedEntity ? { type: relatedEntity.type, id: relatedEntity.id } : undefined,
    });
    return notification;
  } catch (err) {
    console.error("Failed to create notification:", err.message);
    return null;
  }
}

module.exports = createNotification;
