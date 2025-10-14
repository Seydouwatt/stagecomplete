#!/usr/bin/env node

/**
 * Script to automatically fix failed migrations in production
 * This is a workaround for Render free tier which doesn't provide shell access
 */

const { Client } = require('pg');

async function fixFailedMigration() {
  // Check if DATABASE_URL is defined
  if (!process.env.DATABASE_URL) {
    console.log('⚠️  DATABASE_URL not set, skipping migration fix check');
    console.log('ℹ️  This is normal if you haven\'t configured the database yet\n');
    return; // Exit gracefully without error
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔧 Checking for failed migrations...');
    await client.connect();

    // Check if there are any failed migrations
    const checkResult = await client.query(`
      SELECT migration_name, started_at, finished_at
      FROM "_prisma_migrations"
      WHERE finished_at IS NULL
        AND started_at IS NOT NULL
      ORDER BY started_at DESC
      LIMIT 5
    `);

    if (checkResult.rows.length === 0) {
      console.log('✅ No failed migrations found.');
      await client.end();
      return;
    }

    console.log(`⚠️  Found ${checkResult.rows.length} failed migration(s):`);
    checkResult.rows.forEach((row) => {
      console.log(
        `   - ${row.migration_name} (started: ${row.started_at})`,
      );
    });

    // Mark failed migrations as rolled back
    const updateResult = await client.query(`
      UPDATE "_prisma_migrations"
      SET rolled_back_at = NOW(),
          finished_at = NULL
      WHERE finished_at IS NULL
        AND started_at IS NOT NULL
      RETURNING migration_name
    `);

    if (updateResult.rows.length > 0) {
      console.log('✅ Marked migrations as rolled back:');
      updateResult.rows.forEach((row) => {
        console.log(`   ✓ ${row.migration_name}`);
      });
    }

    await client.end();
    console.log('🎉 Migration fix completed successfully!\n');
  } catch (error) {
    console.error('❌ Error fixing migrations:', error.message);
    await client.end();
    // Don't fail the deployment, just warn
    console.log('⚠️  Continuing deployment despite migration fix error...\n');
  }
}

fixFailedMigration();
