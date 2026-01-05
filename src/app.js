const express = require('express');
const path = require('path');
const { validateBootstrapPayload } = require('./validators');
const BootstrapStore = require('./store');

const pkg = require(path.join(__dirname, '..', 'package.json'));

function createApp(options = {}) {
  const store = options.store || new BootstrapStore();
  const app = express();

  app.use(express.json());

  app.get('/api/status', (req, res) => {
    res.json({
      service: pkg.name,
      version: pkg.version,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/api/bootstraps', (req, res) => {
    res.json({ items: store.list() });
  });

  app.post('/api/bootstraps', (req, res) => {
    const validation = validateBootstrapPayload(req.body);
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }
    const payload = {
      name: req.body.name,
      description: req.body.description,
      primaryAction: req.body.primaryAction,
      targetPlatforms: Array.isArray(req.body.targetPlatforms)
        ? req.body.targetPlatforms
        : [],
      successCriteria: Array.isArray(req.body.successCriteria)
        ? req.body.successCriteria
        : [],
      steps: req.body.steps,
    };
    const saved = store.add(payload);
    res.status(201).json(saved);
  });

  app.get('/api/bootstraps/:id', (req, res) => {
    const record = store.find(req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'bootstrap not found' });
    }
    res.json(record);
  });

  app.use((req, res) => {
    res.status(404).json({ error: 'not found' });
  });

  app.use((err, req, res, next) => {
    /* eslint-disable no-console */
    console.error('internal error', err);
    /* eslint-enable no-console */
    res.status(500).json({ error: 'internal server error' });
    next(err);
  });

  return { app, store };
}

module.exports = createApp;
