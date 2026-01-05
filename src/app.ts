import express, { Express, Request, Response, NextFunction } from 'express';
import pkg from '../package.json';
import { validateBootstrapPayload } from './validators';
import BootstrapStore from './store';
import type { BootstrapPayload } from './types';

interface CreateAppOptions {
  store?: BootstrapStore;
}

export default function createApp(options: CreateAppOptions = {}) {
  const store = options.store ?? new BootstrapStore();
  const app: Express = express();

  app.use(express.json());

  app.get('/api/status', (_req: Request, res: Response) => {
    res.json({
      service: pkg.name,
      version: pkg.version,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  app.get('/api/bootstraps', (_req: Request, res: Response) => {
    res.json({ items: store.list() });
  });

  app.post('/api/bootstraps', (req: Request, res: Response) => {
    const validation = validateBootstrapPayload(req.body);
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }
    const payload: BootstrapPayload = {
      name: req.body.name,
      description: req.body.description,
      primaryAction: req.body.primaryAction,
      targetPlatforms: Array.isArray(req.body.targetPlatforms)
        ? req.body.targetPlatforms.map(String)
        : [],
      successCriteria: Array.isArray(req.body.successCriteria)
        ? req.body.successCriteria.map(String)
        : [],
      steps: Array.isArray(req.body.steps)
        ? (req.body.steps as BootstrapPayload['steps'])
        : [],
    };
    const saved = store.add(payload);
    res.status(201).json(saved);
  });

  app.get('/api/bootstraps/:id', (req: Request, res: Response) => {
    const record = store.find(req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'bootstrap not found' });
    }
    res.json(record);
  });

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'not found' });
  });

  app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line no-console
    console.error('internal error', err);
    res.status(500).json({ error: 'internal server error' });
    next(err);
  });

  return { app, store };
}
