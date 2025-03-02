import { simpleGit } from 'simple-git';
import { systemPrompt } from './prompt';
import ollama from 'ollama';
import { log, multiselect, select, spinner } from '@clack/prompts';

async function selectModelStep() {
    const availableModels = await fetchOllamaModels()
    if (!availableModels.length) {
        throw new Error('No available ollama models.');
    }
    return select({
        message: 'Pick a ollama model',
        options: availableModels,
    });
}

async function fetchOllamaModels() {
    try {
        const response = await ollama.list()
        return response.models.map(model => ({ label: model.name, value: model.name }))
    } catch {
        return []
    }
}

async function readChangedFilesName() {
    const git = simpleGit();
    try {
        const diff = await git.diff({
            '--name-only': null,
        });
        const files = diff.split('\n').filter(Boolean)
        return files.map(file => ({ value: file, label: file }));
    } catch (error) {
        return []
    }
}

function readFilesDiff(filePaths: string[]) {
    const git = simpleGit()
    return git.diff(['HEAD', '--', ...filePaths])
}

async function getDiffsStep() {
    const changedFiles = await readChangedFilesName();
    const selected = await multiselect({
        message: 'Select files you want to generate commit message.',
        options: changedFiles
    })
    return readFilesDiff(selected as string[])
}

export async function execute() {
    const s = spinner()
    try {
        const selectedModel = await selectModelStep()
        const diffs = await getDiffsStep()

        s.start('Generating commit message...')
        const ollamaStream = await ollama.generate({
            stream: true,
            model: selectedModel as string,
            system: systemPrompt,
            prompt: diffs,
        })
        s.stop()

        for await (const part of ollamaStream) {
            process.stdout.write(part.response);
        }
    } catch (error) {
        log.error(`Error: ${(error as Error).message}`);
        process.exit(1);
    }
}


