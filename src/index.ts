import { simpleGit } from 'simple-git';
import ollama from 'ollama';
import { log, multiselect, select, spinner } from '@clack/prompts';

const systemPrompt = `
You are an expert developer specialist in creating commits.
Provide a super concise commit message of the user \`git diff\` output following strictly the next rules:
    - Use conventional commit.
    - Do not use any code snippets, imports, file routes or bullets points.
    - Do not mention the route of file that has been change.
`

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
        console.log({ diffs })
        const ollamaStream = await ollama.chat({
            stream: true,
            model: selectedModel as string,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Here is the \`git diff\` output: ${diffs}` },
            ],
        })
        s.stop()

        for await (const part of ollamaStream) {
            process.stdout.write(part.message.content);
        }
    } catch (error) {
        log.error(`Error: ${(error as Error).message}`);
        process.exit(1);
    }
}


