#!/bin/sh
set -e
cd backend
npm run db:deploy
npm run start:prod
