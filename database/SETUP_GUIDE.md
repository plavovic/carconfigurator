# Quick Start Guide - PostgreSQL Database Setup

## Step 1: Install PostgreSQL

### Windows
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. Default port is 5432

### macOS
```bash
brew install postgresql
brew services start postgresql
```

### Linux (Ubuntu)
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## Step 2: Create the Database

Open a terminal/PowerShell and connect to PostgreSQL:

```bash
psql -U postgres
```

Then create the database:

```sql
CREATE DATABASE carconfigurator;
\q
```

## Step 3: Run the Schema

Execute the schema file to create all tables:

```bash
psql -U postgres -d carconfigurator -f schema.sql
```

On Windows, you may need to use the full path:

```bash
psql -U postgres -d carconfigurator -f "C:\path\to\database\schema.sql"
```

## Step 4: Verify Installation

Connect to the database and verify the tables exist:

```bash
psql -U postgres -d carconfigurator
```

Then run:

```sql
\dt
```

You should see all 9 tables listed.

## Step 5: Set Up Backend Connection (Node.js)

1. Navigate to your backend project directory
2. Install required packages:
   ```bash
   npm install pg dotenv
   ```

3. Copy `.env.example` to `.env` and update the values:
   ```bash
   cp database/.env.example .env
   ```

4. Edit `.env` with your PostgreSQL credentials:
   ```
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=carconfigurator
   ```

5. Use the connection pool in your Node.js code:
   ```javascript
   const pool = require('./database/db');
   
   // Query example
   const result = await pool.query('SELECT * FROM car_models');
   console.log(result.rows);
   ```

## Step 6: Useful PostgreSQL Commands

```bash
# Connect to the database
psql -U postgres -d carconfigurator

# List all tables
\dt

# Describe a specific table
\d car_models

# Show column details
\d+ users

# Count records in a table
SELECT COUNT(*) FROM car_models;

# Exit psql
\q
```

## Step 7: Backup Your Database

```bash
# Backup
pg_dump -U postgres -d carconfigurator > backup.sql

# Restore
psql -U postgres -d carconfigurator < backup.sql
```

## Troubleshooting

### "psql: command not found"
- PostgreSQL is not installed or not in your PATH
- Reinstall PostgreSQL and ensure it's added to system PATH
- Or use the full path to psql (e.g., `C:\Program Files\PostgreSQL\15\bin\psql`)

### "password authentication failed"
- Check that the password is correct
- Default user is `postgres` (created during installation)
- Can reset password: `ALTER USER postgres PASSWORD 'newpassword';`

### "could not connect to server"
- PostgreSQL service is not running
- Windows: Start PostgreSQL from Services
- macOS: `brew services start postgresql`
- Linux: `sudo systemctl start postgresql`

### Port already in use
- Default port is 5432
- If already in use, PostgreSQL may have multiple instances
- Or another service is using the port
- Change port during installation or in postgresql.conf

## Database Schema Overview

The database includes:
- **users** - User accounts and authentication
- **car_models** - Porsche model information (Taycan, 911, Cayenne, Macan)
- **options** - Customization options (colors, wheels, interior, technology)
- **car_model_options** - Links options to specific models
- **configurations** - Saved vehicle configurations
- **configuration_items** - Selected options in a configuration
- **orders** - Purchase orders
- **reviews** - User reviews and ratings
- **services** - Additional services (warranty, maintenance, etc.)

See `DATABASE_DOCUMENTATION.md` for detailed schema information.

## Next Steps

1. Build your backend API with Node.js/Express
2. Create API endpoints that use the database connection
3. Implement user authentication
4. Connect your React frontend to the backend API
5. Test the full integration

## Additional Resources

- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Node.js pg module: https://node-postgres.com/
- Express.js: https://expressjs.com/
- REST API best practices: https://restfulapi.net/
