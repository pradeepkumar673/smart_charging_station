// src/data/mockNotifications.js

// TODO: Replace with real API, e.g. GET /notifications?userId=

const notifications = [
  {
    id: "ntf_1",
    type: "success",
    title: "Booking confirmed",
    message: "Your slot at Indiranagar EV Hub is confirmed for 6:30 PM.",
    time: "10 min ago",
    read: false,
  },
  {
    id: "ntf_2",
    type: "info",
    title: "New recommendation available",
    message: "Switch to Koramangala Green Charge and save ₹40.",
    time: "1 hr ago",
    read: false,
  },
  {
    id: "ntf_3",
    type: "warning",
    title: "Slot expiring soon",
    message: "Claim your waitlisted slot within 5 minutes.",
    time: "2 hr ago",
    read: true,
  },
];

export const getNotifications = () => Promise.resolve(notifications);
export const markAsRead = (id) => Promise.resolve({ id, read: true });
export const markAllAsRead = () => Promise.resolve(true);
