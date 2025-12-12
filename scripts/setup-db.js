const { neon } = require("@neondatabase/serverless");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

async function setupDatabase() {
  try {
    console.log("🔄 Setting up database tables...");
    
    if (!process.env.DATABASE_URL) {
      console.error("❌ DATABASE_URL is not set in .env file");
      process.exit(1);
    }

    const sql = neon(process.env.DATABASE_URL);

    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ Created users table");

    // Create tasks table
    await sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        priority VARCHAR(50) DEFAULT 'medium',
        due_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ Created tasks table");

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)`;
    console.log("✅ Created indexes");

    console.log("\n🎉 Database setup completed successfully!");
    console.log("📊 Tables ready:");
    console.log("   - users");
    console.log("   - tasks");
  } catch (error) {
    console.error("❌ Error setting up database:", error.message);
    console.error(error);
    process.exit(1);
  }
}

setupDatabase();

