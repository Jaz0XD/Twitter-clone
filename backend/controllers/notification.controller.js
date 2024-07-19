//* GET NOTIFICATIONS

import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "username profileImg",
    });

    await Notification.updateMany({ to: userId }, { read: true });

    res.status(200).json(notifications);
  } catch (error) {
    //* Log error in Console
    console.log(
      "[notification.controller.js] Error in getNotifications controller: ",
      error
    );

    //* Send error message to user
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//* DELETE NOTIFICATIONS

export const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.deleteMany({ to: userId });

    res.status(200).json({ message: "Notifications deleted successfully" });
  } catch (error) {
    //* Log error in Console
    console.log(
      "[notification.controller.js] Error in deleteNotifications controller: ",
      error
    );

    //* Send error message to user
    res.status(500).json({ error: "Internal Server Error" });
  }
};
