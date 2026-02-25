import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from '../schema/schema';
// 1️⃣ Create Postgres connection pool
export  const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ,
});

// 2️⃣ Create Drizzle client
export const db = drizzle(pool, { schema, logger: false });

// Optional: export schema for queries
export { schema };
