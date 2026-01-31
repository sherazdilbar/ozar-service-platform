// Run this file to generate secure secrets for deployment
// Command: node generate-secrets.js

const crypto = require('crypto');

console.log('\n=== SECRETS FOR DIGITALOCEAN DEPLOYMENT ===\n');

console.log('JWT_SECRET:');
console.log(crypto.randomBytes(64).toString('hex'));

console.log('\nSESSION_SECRET:');
console.log(crypto.randomBytes(64).toString('hex'));

console.log('\n=== Copy these values to DigitalOcean Environment Variables ===\n');
