import { env } from "bun";
import app from './app';

const port = env.PORT || 3000;

Bun.serve({
  port,
  fetch: app.fetch,
});

const dim = "\x1b[2m";
const br = "\x1b[1m";
const cyan = "\x1b[36m";
const green = "\x1b[32m";
const magenta = "\x1b[35m";
const reset = "\x1b[0m";

console.log(`
  ${br}${cyan}🚀 SERVER ONLINE${reset}
  ${dim}──────────────────────────────────────────${reset}
  ${br}${green}  LINK ${reset} ${cyan}http://${env.MY_IP}:${port}${reset}
  ${br}${magenta}  DATA ${reset} ${magenta}${env.DATABASE_URL}${reset}
  ${dim}──────────────────────────────────────────${reset}
  ${dim}Ready to accept requests...${reset}
`);