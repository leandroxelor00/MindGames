const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isUuid(uuid) {
  if (!uuid) {
    return false;
  }
  const string = String(uuid);

  return UUID_REGEX.test(string);
}

module.exports = { isUuid };
