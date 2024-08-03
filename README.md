# `ollama-commit-mate`

`ollama-commit-mate` is a CLI tool designed to generate descriptive commit messages using AI models from Ollama. It allows for flexible configuration to meet various needs when creating commits.

***Note***: Ensure that you have Ollama and models installed, as ollama-commit-mate relies on it to generate commit messages. You can find installation instructions for [Ollama](https://ollama.com/) in their official documentation.

## Installation

To install `ollama-commit-mate` globally, use the following command:

```bash
npm install -g ollama-commit-mate
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
ocm
```
##### Specify AI Model
```bash
# Use a specific AI model for generating commit messages:
ocm --model mistral
```

##### Change Base URL
```bash
# Specify base URL for your Ollama port:
ocm --baseUrl http://localhost:11434
```
##### Exclude Files
```bash
# Exclude additional files or directories from the diff:
ocm --exclude 'deploy/index.ts' 'dist'
```
##### Include Untracked Files

```bash
# Include untracked files in the output:
ocm --untracked
```
