const crypto = require('crypto');

// Check for arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node generateSecret.js [bytes]');
    console.log('  bytes: Optional. The size of the secret key in bytes (default: 32).');
    process.exit(0);
}

// Get byte size from arguments or default to 32
const bytes = parseInt(args[0], 10) || 32;

if (isNaN(bytes) || bytes <= 0) {
    console.error('Error: Please provide a positive integer for the byte size.');
    process.exit(1);
}

// Generate the secret key
const secretKey = crypto.randomBytes(bytes).toString('hex');
console.log(`Generated JWT Secret Key (${bytes} bytes):`, secretKey);