// Import models
import User from "../models/user.model.js";

//* GET USER PROFILE

export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    //* Log error in Console
    console.log(
      "[explore.controller.js] Error in getUserProfile: ",
      error.message
    );
    //* Send error message to user
    res.status(500).json({ error: error.message });
  }
};


//* GET EXPLORE USERS

export const getExploreUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    const usersFollowedByMe = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      { $sample: { size: 25 } },
    ]);

    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 10);

    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (error) {
    //* Log error in Console
    console.log(
      "[explore.controller.js] Error in getExploreUsers: ",
      error.message
    );
    //* Send error message to user
    res.status(500).json({ error: error.message });
  }
};

