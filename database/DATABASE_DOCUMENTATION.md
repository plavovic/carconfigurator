# Car Configurator PostgreSQL Database Setup

## Overview

This PostgreSQL database is designed to support a full-featured Porsche car configurator application with user authentication, car customization, order management, and more.

## Database Tables

### 1. **users**
Stores user account information for authentication and profile management.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique user identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User's email address |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password |
| first_name | VARCHAR(100) | | User's first name |
| last_name | VARCHAR(100) | | User's last name |
| phone | VARCHAR(20) | | User's phone number |
| created_at | TIMESTAMP | DEFAULT NOW | Account creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW | Last update timestamp |
| is_active | BOOLEAN | DEFAULT TRUE | Account status |

### 2. **car_models**
Contains information about available Porsche models.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique model identifier |
| name | VARCHAR(100) | UNIQUE, NOT NULL | Car model name (Taycan, 911, Cayenne, Macan) |
| description | TEXT | | Model description |
| base_price | DECIMAL(10,2) | NOT NULL | Starting price |
| image_url | VARCHAR(255) | | Side view image URL |
| front_image_url | VARCHAR(255) | | Front view image URL |
| zero_to_hundred_km_h | DECIMAL(3,1) | | 0-100 km/h acceleration time |
| top_speed_km_h | INTEGER | | Maximum speed |
| power_hp | INTEGER | | Horsepower |
| power_kw | INTEGER | | Power in kilowatts |
| energy_consumption_kWh_per_100km | DECIMAL(4,1) | | Energy consumption (electric models) |
| co2_emissions_g_per_km | DECIMAL(4,1) | | CO2 emissions (or 0 for electric) |
| created_at | TIMESTAMP | DEFAULT NOW | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW | Last update timestamp |

### 3. **options**
Stores customization options (colors, wheels, interior, technology packages).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique option identifier |
| category | VARCHAR(100) | NOT NULL | Option category (Exterior Color, Wheels, Interior, Technology) |
| name | VARCHAR(100) | NOT NULL | Option name |
| description | TEXT | | Detailed description |
| price_modifier | DECIMAL(10,2) | DEFAULT 0 | Price adjustment |
| image_url | VARCHAR(255) | | Option image URL |
| created_at | TIMESTAMP | DEFAULT NOW | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW | Last update timestamp |

### 4. **car_model_options**
Links available options to specific car models (many-to-many relationship).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique relationship identifier |
| car_model_id | INTEGER | NOT NULL, FK | Reference to car_models |
| option_id | INTEGER | NOT NULL, FK | Reference to options |

### 5. **configurations**
Stores saved vehicle configurations created by users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique configuration identifier |
| user_id | INTEGER | NOT NULL, FK | Reference to users |
| car_model_id | INTEGER | NOT NULL, FK | Reference to car_models |
| configuration_name | VARCHAR(255) | | Custom name for configuration |
| total_price | DECIMAL(10,2) | | Calculated total price |
| is_saved | BOOLEAN | DEFAULT FALSE | Whether configuration is saved |
| created_at | TIMESTAMP | DEFAULT NOW | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW | Last update timestamp |

### 6. **configuration_items**
Lists individual options selected in a configuration (one-to-many with configurations).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique item identifier |
| configuration_id | INTEGER | NOT NULL, FK | Reference to configurations |
| option_id | INTEGER | NOT NULL, FK | Reference to options |
| price_at_selection | DECIMAL(10,2) | | Price of option at time of selection (for history) |
| created_at | TIMESTAMP | DEFAULT NOW | Selection timestamp |

### 7. **orders**
Tracks customer orders and purchases.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique order identifier |
| user_id | INTEGER | NOT NULL, FK | Reference to users |
| configuration_id | INTEGER | FK | Reference to configurations (if applicable) |
| order_number | VARCHAR(50) | UNIQUE, NOT NULL | Public-facing order number |
| total_amount | DECIMAL(10,2) | NOT NULL | Total order amount |
| status | VARCHAR(50) | DEFAULT 'pending' | Order status (pending, confirmed, shipped, delivered, cancelled) |
| created_at | TIMESTAMP | DEFAULT NOW | Order creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW | Last update timestamp |

### 8. **reviews**
Stores user reviews and ratings for car models.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique review identifier |
| user_id | INTEGER | NOT NULL, FK | Reference to users |
| car_model_id | INTEGER | NOT NULL, FK | Reference to car_models |
| rating | INTEGER | CHECK (1-5) | Star rating (1-5 stars) |
| comment | TEXT | | Review text |
| created_at | TIMESTAMP | DEFAULT NOW | Review creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW | Last update timestamp |

### 9. **services**
Additional service offerings (warranty, maintenance, concierge).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique service identifier |
| name | VARCHAR(100) | NOT NULL | Service name |
| description | TEXT | | Service description |
| price | DECIMAL(10,2) | | Service price |
| image_url | VARCHAR(255) | | Service image URL |
| created_at | TIMESTAMP | DEFAULT NOW | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW | Last update timestamp |

## Key Relationships

```
users (1) ──────── (N) configurations ──────── (N) configuration_items
                                      └──────────────── (N) options
                   └──────────────────────────────────────────┘

users (1) ──────── (N) orders
        └──────── (N) reviews

car_models (1) ──── (N) car_model_options ──── (N) options

car_models (1) ──── (N) configurations
        └──────── (N) reviews
```

## Indexes

The schema includes the following indexes for optimized query performance:

- `idx_users_email` - Fast email lookups for login
- `idx_car_models_name` - Quick model lookups
- `idx_options_category` - Filter options by category
- `idx_car_model_options_car_model_id` - Find options for a model
- `idx_configurations_user_id` - User's configurations
- `idx_configurations_car_model_id` - Configurations by model
- `idx_configurations_created_at` - Recent configurations
- `idx_configuration_items_configuration_id` - Items in a configuration
- `idx_orders_user_id` - User's orders
- `idx_orders_status` - Filter orders by status
- `idx_orders_created_at` - Recent orders
- `idx_reviews_car_model_id` - Reviews for a model
- `idx_reviews_user_id` - User's reviews

## Triggers

Automatic timestamp updates are implemented for:
- users
- car_models
- options
- configurations
- orders
- reviews
- services

## Installation Instructions

### Prerequisites
- PostgreSQL 12 or higher
- A database management tool (psql, pgAdmin, or similar)

### Steps

1. **Create the database:**
   ```sql
   CREATE DATABASE carconfigurator;
   ```

2. **Connect to the database:**
   ```bash
   psql -U postgres -d carconfigurator
   ```

3. **Run the schema script:**
   ```bash
   psql -U postgres -d carconfigurator -f schema.sql
   ```

   Or if using pgAdmin, copy the contents of `schema.sql` and execute it in the query editor.

4. **Verify installation:**
   ```sql
   \dt  -- List all tables
   \d users  -- Describe users table
   SELECT COUNT(*) FROM car_models;  -- Should return 4
   ```

## Sample Data

The schema includes sample data for:
- 4 Porsche car models (Taycan, 911, Cayenne, Macan)
- 5 exterior colors
- 4 wheel options
- 4 interior options
- 4 technology packages
- 4 services

## Usage Examples

### Get a User's Configurations
```sql
SELECT c.id, c.configuration_name, c.total_price, c.created_at
FROM configurations c
WHERE c.user_id = 1
ORDER BY c.created_at DESC;
```

### Get Options for a Car Model
```sql
SELECT o.id, o.category, o.name, o.price_modifier
FROM options o
INNER JOIN car_model_options cmo ON o.id = cmo.option_id
WHERE cmo.car_model_id = (SELECT id FROM car_models WHERE name = 'Taycan');
```

### Calculate Configuration Price
```sql
SELECT 
  cm.base_price + COALESCE(SUM(o.price_modifier), 0) as total_price
FROM configurations c
INNER JOIN car_models cm ON c.car_model_id = cm.id
LEFT JOIN configuration_items ci ON c.id = ci.configuration_id
LEFT JOIN options o ON ci.option_id = o.id
WHERE c.id = 1
GROUP BY c.id, cm.base_price;
```

### Get Average Rating for a Car Model
```sql
SELECT 
  cm.name,
  AVG(r.rating) as average_rating,
  COUNT(r.id) as review_count
FROM car_models cm
LEFT JOIN reviews r ON cm.id = r.car_model_id
GROUP BY cm.id, cm.name;
```

## Backup and Restore

### Backup the database:
```bash
pg_dump -U postgres -d carconfigurator > carconfigurator_backup.sql
```

### Restore the database:
```bash
psql -U postgres -d carconfigurator < carconfigurator_backup.sql
```

## Notes

- All prices are stored as DECIMAL(10,2) for precise financial calculations
- User passwords should always be hashed using bcrypt or similar before storing
- The `updated_at` timestamps are automatically maintained by triggers
- Cascade delete is implemented for data integrity (deleting a user removes their configurations)
- The schema supports future expansion with additional tables or fields
