const createApp = require('./app');

function startServer({ port = process.env.PORT || 4000, onStart } = {}) {
  const { app } = createApp();
  const server = app.listen(port, () => {
    const message = `Project Bootstrap MCP listening on port ${port}`;
    if (typeof onStart === 'function') {
      onStart(message, port);
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

module.exports = startServer;
