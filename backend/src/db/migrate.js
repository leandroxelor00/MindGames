const migrations = [
  require("./migrations/001_create_scores"),
  require("./migrations/002_create_users"),
  require("./migrations/003_add_username_to_users"),
  require("./migrations/004_add_scores_user_index"),
];

// Roda em ordem a cada start; todas são idempotentes.
async function runMigrations() {
  for (const migration of migrations) {
    await migration.up();
  }
}

module.exports = { runMigrations };
