const isAdmin = (user) => {
  if (user.roles.includes("Admin")) {
    return true;
  }

  return false;
};

const isAuthorized = (user, Object) => {
  if (isAdmin(user)) {
    console.log("Authorized");
    return true;
  }
  if (user._id.toString() === Object.owner.toString()) {
    console.log("Authorized");
    return true;
  }

  return false;
};

module.exports = { isAdmin, isAuthorized };
