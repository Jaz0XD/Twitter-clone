// SIGNUP LOGIN and LOGOUT


//* The signup endpoint

export const signup = async (req, res) => {
  res.json({
    data: "You hit the signup endpoint",
  });
};

//* The login endpoint

export const login = async (req, res) => {
  res.json({
    data: "You hit the login endpoint",
  });
};


//* The logout endpoint
export const logout = async (req, res) => {
  res.json({
    data: "You hit the logout endpoint",
  });
};
