# README

stripe listen --forward-to http://localhost:3001/api/v1/webhooks/stripe

VISUAL="code --wait" bin/rails credentials:edit

# Procfile.dev

web: cd client && PORT=3000 npm run dev -- --host
api: PORT=3001 bin/rails s
jobs: bin/jobs start
stripe: stripe listen --forward-to http://localhost:3001/api/v1/webhooks/stripe