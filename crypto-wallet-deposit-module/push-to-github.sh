#!/bin/bash
# ==============================================================================
# 🚀 Automated GitHub Push Script for Crypto Wallet & Deposit Module
# ==============================================================================

set -e

echo "--------------------------------------------------------"
echo "  Crypto Wallet & Deposit Payment Module - GitHub Uploader"
echo "--------------------------------------------------------"

# Ensure we are inside the module directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing local git repository..."
    git init
    git branch -M main
fi

# Add all files and make initial commit
echo "📝 Staging files..."
git add .
git commit -m "feat: Standalone Crypto Wallet, Multi-Chain Deposit & Payment Invoice Module" || true

# Check if origin already exists
CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null || echo "")

if [ -z "$CURRENT_REMOTE" ]; then
    if [ -n "$1" ]; then
        REPO_URL="$1"
    else
        echo ""
        read -p "Enter your GitHub Repository URL (e.g. https://github.com/username/my-wallet-repo.git): " REPO_URL
    fi

    if [ -z "$REPO_URL" ]; then
        echo "❌ Error: Repository URL cannot be empty."
        exit 1
    fi

    git remote add origin "$REPO_URL"
    echo "✅ Remote origin added: $REPO_URL"
else
    echo "ℹ️ Current remote origin: $CURRENT_REMOTE"
fi

echo "🚀 Pushing to GitHub (main branch)..."
git push -u origin main

echo ""
echo "🎉 Congratulations! The standalone Crypto Wallet & Deposit module is now live on GitHub."
