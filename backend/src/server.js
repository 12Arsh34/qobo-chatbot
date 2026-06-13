// STEP 1: Load environment variables FIRST using dotenv/config side-effect import.
// In ESM, `import 'dotenv/config'` is the canonical way to ensure .env is loaded
// before any other module in this file's dependency tree is evaluated.
import 'dotenv/config';

// STEP 2: Run startup diagnostics BEFORE importing app (which triggers the full module graph)
// NOTE: These console.logs run AFTER all static imports are hoisted & resolved.
// The real guarantee is that 'dotenv/config' is the FIRST import listed.

// STEP 3: Import the rest of the app
import app from './app.js';
import { connectDB } from './config/db.js';

// === STARTUP DIAGNOSTICS (safe — never exposes the key value) ===
const openRouterKey = process.env.OPENROUTER_API_KEY;
console.log('--- STARTUP DIAGNOSTICS ---');
console.log(`Working Directory  : ${process.cwd()}`);
console.log(`OpenRouter Key Present : ${openRouterKey ? 'YES' : 'NO ← CHECK YOUR .env FILE!'}`);
if (openRouterKey) {
  console.log(`OpenRouter Key Length  : ${openRouterKey.length}`);
}
console.log(`MongoDB URI Set    : ${process.env.MONGODB_URI ? 'YES' : 'NO'}`);
console.log(`JWT Secret Set     : ${process.env.JWT_SECRET ? 'YES' : 'NO'}`);
console.log(`PORT               : ${process.env.PORT || 5000} (default)`);
console.log('---------------------------');

const PORT = process.env.PORT || 5000;

// Initialize Database Connection
connectDB();

// Start HTTP Listener
const server = app.listen(PORT, () => {
  console.log(`[Server] running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err) => {
  console.error(`[Fatal Error] Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
