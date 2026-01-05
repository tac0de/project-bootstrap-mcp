import type { Express } from 'express';
import type { Server } from 'http';
import createApp from './app';

export interface StartServerOptions {
  port?: number;
  onStart?: (message: string, port: number) => void;
}

export interface StartServerResult {
  app: Express;
  server: Server;
}

export default function startServer({
  port,
  onStart,
}: StartServerOptions = {}): StartServerResult {
  const defaultPort = Number(process.env.PORT) || 4000;
  const resolvedPort = port ?? defaultPort;
  const { app } = createApp();
  const server = app.listen(resolvedPort, () => {
    const message = `Project Bootstrap MCP listening on port ${resolvedPort}`;
    if (typeof onStart === 'function') {
      onStart(message, resolvedPort);
    } else {
      // eslint-disable-next-line no-console
      console.log(message);
    }
  });

  const graceful = () => {
    server.close(() => {
      // eslint-disable-next-line no-console
      console.log('Project Bootstrap MCP shutting down');
      process.exit(0);
    });
  };

  process.on('SIGINT', graceful);
  process.on('SIGTERM', graceful);

  return { app, server };
}
