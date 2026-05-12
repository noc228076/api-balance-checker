#!/bin/bash

set -e

echo "Building release packages..."

# Create output directory
mkdir -p releases

# 1. Build the project
echo "[1/4] Building project..."
npm run build

# 2. Create web deployment package
echo "[2/4] Creating web deployment package..."
cd dist
zip -r ../releases/api-balance-checker-web.zip .
cd ..

# 3. Create source code package
echo "[3/4] Creating source code package..."
zip -r releases/api-balance-checker-source.zip . -x "node_modules/*" "dist/*" ".git/*" "releases/*" "build-release.*"

# 4. Create deployment configs
echo "[4/4] Creating deployment configurations..."

# Create nginx.conf
cat > releases/nginx.conf << 'EOF'
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Handle Vue Router history mode
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets cache
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Create vercel.json
cat > releases/vercel.json << 'EOF'
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
EOF

# Create netlify.toml
cat > releases/netlify.toml << 'EOF'
[build]
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
EOF

echo ""
echo "SUCCESS! Release packages created in 'releases' directory:"
echo "  - api-balance-checker-web.zip"
echo "  - api-balance-checker-source.zip"
echo "  - nginx.conf"
echo "  - vercel.json"
echo "  - netlify.toml"
echo ""
echo "Upload these files to GitHub Release."