export interface BootstrapStep {
  title: string;
  detail: string;
}

export interface BootstrapPayload {
  name: string;
  description: string;
  primaryAction: string;
  targetPlatforms?: string[];
  successCriteria?: string[];
  steps: BootstrapStep[];
}

export interface BootstrapRecord extends BootstrapPayload {
  id: string;
  createdAt: string;
}
