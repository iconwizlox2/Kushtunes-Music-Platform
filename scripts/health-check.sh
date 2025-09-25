#!/bin/bash

# Simple health check script for local testing
# Run this after starting the dev server with: npm run dev

SITE="http://localhost:3000"

echo "🔍 Testing Kushtunes Health Checks..."
echo ""

# Test analytics page
echo "📊 Testing /analytics page..."
code=$(curl -s -o /dev/null -w "%{http_code}" "$SITE/analytics")
if [ "$code" -ge 200 ] && [ "$code" -lt 400 ]; then
    echo "✅ /analytics returns $code"
else
    echo "❌ /analytics returned $code"
    exit 1
fi

echo ""

# Test protected routes
echo "🔒 Testing protected routes..."
for path in /dashboard /releases /marketing /community; do
    http_code=$(curl -s -o /dev/null -w "%{http_code}" -L -I "$SITE$path")
    echo "$path => $http_code"
    if [ "$http_code" -ge 400 ]; then
        echo "❌ $path returned $http_code"
        exit 1
    fi
done

echo ""
echo "✅ All health checks passed!"
