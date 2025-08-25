#!/bin/bash

# TrenderAI Complete Application Restore Script
# This script restores the complete TrenderAI application with database setup

set -e  # Exit on any error

echo "🚀 TrenderAI Complete Application Restore Script"
echo "================================================"

# Check if backup file exists
BACKUP_FILE="trenderai-complete-backup-2025-08-25-155146.tar.gz"
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: Backup file '$BACKUP_FILE' not found!"
    echo "Please make sure the backup file is in the current directory."
    exit 1
fi

echo "✅ Found backup file: $BACKUP_FILE"

# Create restore directory
RESTORE_DIR="trenderai-complete-restored-$(date +%Y%m%d-%H%M%S)"
echo "📁 Creating restore directory: $RESTORE_DIR"
mkdir -p "$RESTORE_DIR"
cd "$RESTORE_DIR"

# Extract backup
echo "📦 Extracting backup..."
tar -xzf "../$BACKUP_FILE"

# Install dependencies
echo "📥 Installing dependencies..."
npm install

# Check for DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    echo ""
    echo "⚠️  DATABASE_URL environment variable not set!"
    echo ""
    echo "Please set your DATABASE_URL before running database setup:"
    echo "  export DATABASE_URL=\"postgresql://user:password@host:port/database\""
    echo ""
    echo "Then run:"
    echo "  npm run db:setup"
    echo ""
    echo "Or run the setup manually:"
    echo "  npm run db:migrate"
    echo "  npm run db:seed"
    echo ""
else
    echo "✅ DATABASE_URL is set"
    echo "🗄️  Setting up database..."
    npm run db:setup
fi

echo ""
echo "✅ Restore completed successfully!"
echo ""
echo "🎉 Your complete TrenderAI application has been restored to: $RESTORE_DIR"
echo ""
echo "📋 Next steps:"
echo "  1. Set your DATABASE_URL environment variable (if not already set)"
echo "  2. Run database setup: npm run db:setup"
echo "  3. Start the development server: npm run dev"
echo ""
echo "🌐 The application will be available at: http://localhost:3000"
echo ""
echo "📊 Database commands:"
echo "  npm run db:migrate:status  - Check migration status"
echo "  npm run db:seed:summary    - View data summary"
echo "  npm run db:seed:reset      - Reset database data"
echo ""
echo "Happy coding! 🚀"
