#!/bin/bash
# Install Python dependencies
pip3 install -r requirements.txt

# Start the Python FastAPI server in the background
python3 -m uvicorn src.modules.product.main:app --port 8000 &

# Start the Node.js Express server in the foreground
node dist/app.js
