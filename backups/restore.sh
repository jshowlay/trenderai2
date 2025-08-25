#!/bin/bash

# TrenderAI Backup Restore Script
# This script restores the TrenderAI application from backup

set -e  # Exit on any error

echo "🚀 TrenderAI Backup Restore Script"
echo "=================================="

# Check if backup file exists
BACKUP_FILE="trenderai-backup-2025-08-25-152605.tar.gz"
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: Backup file '$BACKUP_FILE' not found!"
    echo "Please make sure the backup file is in the current directory."
    exit 1
fi

echo "✅ Found backup file: $BACKUP_FILE"

# Create restore directory
RESTORE_DIR="trenderai-restored-$(date +%Y%m%d-%H%M%S)"
echo "📁 Creating restore directory: $RESTORE_DIR"
mkdir -p "$RESTORE_DIR"
cd "$RESTORE_DIR"

# Extract backup
echo "📦 Extracting backup..."
tar -xzf "../$BACKUP_FILE"

# Install dependencies
echo "📥 Installing dependencies..."
npm install

echo ""
echo "✅ Restore completed successfully!"
echo ""
echo "🎉 Your TrenderAI application has been restored to: $RESTORE_DIR"
echo ""
echo "To start the application:"
echo "  cd $RESTORE_DIR"
echo "  npm run dev"
echo ""
echo "The application will be available at: http://localhost:3000"
echo ""
echo "Happy coding! 🚀"
