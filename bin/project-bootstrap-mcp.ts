#!/usr/bin/env node
import startServer from '../src/server.js';

function parsePort(args: string[], envPort: string | undefined): number {
  let portValue = envPort || '4000';
  args.forEach((arg, index, list) => {
    if (arg === '--port' && list[index + 1]) {
      portValue = list[index + 1];
    }
    if (arg.startsWith('--port=')) {
      portValue = arg.split('=')[1];
    }
    if (arg === '-p' && list[index + 1]) {
      portValue = list[index + 1];
    }
  });
  const parsed = Number.parseInt(portValue, 10);
  if (Number.isNaN(parsed)) {
    console.error(`invalid port value: ${portValue}`);
    process.exit(1);
  }
  return parsed;
}

const port = parsePort(process.argv.slice(2), process.env.PORT);
startServer({ port });
