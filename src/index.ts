import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import BootstrapStore from './store';
import type { BootstrapPayload } from './types';

// Create MCP server
const server = new Server(
  {
    name: '@tac0de/project-bootstrap-mcp',
    version: '1.1.2',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const store = new BootstrapStore();

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_bootstraps',
        description: 'List all bootstrap project definitions',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'create_bootstrap',
        description: 'Create a new bootstrap project definition with steps and criteria',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Name of the bootstrap project',
            },
            description: {
              type: 'string',
              description: 'Description of the bootstrap project',
            },
            primaryAction: {
              type: 'string',
              description: 'The primary action to be performed',
            },
            targetPlatforms: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Target platforms for this bootstrap',
            },
            successCriteria: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Criteria for successful completion',
            },
            steps: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                    description: 'Title of the step',
                  },
                  detail: {
                    type: 'string',
                    description: 'Detailed instructions for the step',
                  },
                },
                required: ['title', 'detail'],
              },
              description: 'Steps to complete the bootstrap',
            },
          },
          required: ['name', 'description', 'primaryAction', 'steps'],
        },
      },
      {
        name: 'get_bootstrap',
        description: 'Get a specific bootstrap project by ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The ID of the bootstrap project',
            },
          },
          required: ['id'],
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'list_bootstraps': {
      const items = store.list();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ items }, null, 2),
          },
        ],
      };
    }

    case 'create_bootstrap': {
      const payload: BootstrapPayload = {
        name: String(args?.name),
        description: String(args?.description),
        primaryAction: String(args?.primaryAction),
        targetPlatforms: Array.isArray(args?.targetPlatforms)
          ? args.targetPlatforms.map(String)
          : [],
        successCriteria: Array.isArray(args?.successCriteria)
          ? args.successCriteria.map(String)
          : [],
        steps: Array.isArray(args?.steps)
          ? (args.steps as BootstrapPayload['steps'])
          : [],
      };

      const saved = store.add(payload);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(saved, null, 2),
          },
        ],
      };
    }

    case 'get_bootstrap': {
      const id = String(args?.id);
      const record = store.find(id);

      if (!record) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ error: 'Bootstrap not found' }, null, 2),
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(record, null, 2),
          },
        ],
      };
    }

    default:
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ error: 'Unknown tool' }, null, 2),
          },
        ],
        isError: true,
      };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Project Bootstrap MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

export { BootstrapStore };
