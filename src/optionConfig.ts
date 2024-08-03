export const optionConfig = {
    model: {
        alias: 'm',
        type: 'string',
        description: 'The AI model to use (supports chat models in Ollama only). Default model is llama3.1.',
        default: 'llama3.1'
    },
    baseUrl: {
        alias: 'url',
        type: 'string',
        description: 'The base URL of the AI model API',
        default: 'http://localhost:11434'
    },
    exclude: {
        alias: 'ex',
        type: 'array',
        description: 'Files or directories to exclude from diff',
        default: ['node_modules', 'dist', 'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml']
    },
    untracked: {
        alias: 'un',
        type: 'boolean',
        description: 'When true, this feature allows the inclusion of untracked files in the output, providing a more comprehensive view of system changes.',
        default: false
    }
} as const