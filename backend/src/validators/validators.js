const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const USERNAME_REGEX = /^[A-Za-z0-9_]{3,16}$/;

function isUuid(uuid) {
  if (!uuid) {
    return false;
  }
  const string = String(uuid);

  return UUID_REGEX.test(string);
}

function isValidUsername(username) {
  if (typeof username !== "string") {
    return false;
  }

  return USERNAME_REGEX.test(username);
}

module.exports = { isUuid, isValidUsername };
