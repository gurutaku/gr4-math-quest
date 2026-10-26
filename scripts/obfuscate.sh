#!/usr/bin/env bash
set -Eeuo pipefail

npx javascript-obfuscator math.js --output math.secured.js \
  --compact true \
  --control-flow-flattening false \
  --dead-code-injection false \
  --string-array true \
  --string-array-encoding 'none'