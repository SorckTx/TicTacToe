#!/bin/bash
# Check if the node_modules folder exists and is not empty
cd /upv1-frontend
if [ ! -d "node_modules" ] || [ -z "$(ls -A node_modules)" ]; then
  # If node_modules is empty, run pnpm install
  /bin/bash -c "pnpm install"
fi

/bin/bash -c "pnpm build"
/bin/bash -c "pnpm start"