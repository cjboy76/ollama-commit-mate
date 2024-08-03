# `ollama-commit-mate`

## Installation

To use `ollama-commit-mate`, use the following command:

```bash
npx ollama-commit-mate
```

Or try to install globally, you can use the `ocm` shorthand command to run it.
```bash
npm i -g ollama-commit-mate
```

### Options

| Option       | Alias   | Type     | Description                                                                                       | Default                                      |
|--------------|---------|----------|---------------------------------------------------------------------------------------------------|----------------------------------------------|
| `--model`    | `-m`    | `string` | The AI model to use (chat models in Ollama).         | `llama3.1`                                  |
| `--baseUrl`  | `--url` | `string` | The base URL of Ollama port.                                                                 | `http://localhost:11434`                    |
| `--exclude`  | `--ex`  | `array`  | Files or directories to exclude from the diff.                                                    | `['node_modules', 'dist', 'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml']` |
| `--untracked`| `--un`  | `boolean`| When true, this feature allows the inclusion of untracked files in the output, providing a more comprehensive view of system changes. | `false`                                     |                                  |


## Examples
##### Basic Usage
```bash
# Generate a commit message using the default settings:

npx ollama-commit-mate

ocm
```
##### Specify AI Model
```bash
# Use a specific AI model for generating commit messages:

npx ollama-commit-mate --model mistral

ocm -m mistral
```

##### Change Base URL
```bash
# Specify base URL for your Ollama port:

npx ollama-commit-mate --baseUrl http://localhost:11434

ocm -url http://localhost:11434
```
##### Exclude Files
```bash
# Exclude additional files or directories from the diff:

npx ollama-commit-mate --exclude 'deploy/index.ts' 'dist'

ocm --ex 'deploy/index.ts' 'dist'
```
##### Include Untracked Files

```bash
# Include untracked files in the output:

npx ollama-commit-mate --untracked

ocm --un
```
