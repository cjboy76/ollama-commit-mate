import { simpleGit } from 'simple-git';
import { ChatOllama } from "@langchain/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { LoadingSpinner } from './loadingSpinner.js';
import { promises as fs } from 'fs';
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const argv = await yargs(hideBin(process.argv))
    .option('model', {
        alias: 'm',
        type: 'string',
        description: 'The AI model to use (supports chat models in Ollama only). Default model is llama3.1.',
        default: 'llama3.1'
    })
    .option('baseUrl', {
        alias: 'url',
        type: 'string',
        description: 'The base URL of the AI model API',
        default: 'http://localhost:11434'
    })
    .option('exclude', {
        alias: 'e',
        type: 'array',
        description: 'Files or directories to exclude from diff',
        default: ['node_modules', 'dist', 'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml']
    })
    .option('untracked', {
        alias: 'un',
        type: 'boolean',
        description: 'When true, this feature allows the inclusion of untracked files in the output, providing a more comprehensive view of system changes.',
        default: false
    })
    .help()
    .argv;

async function getChangedFiles(props: { customExcludeList: string[] }) {
    const git = simpleGit();
    const defaultExcludeList = props.customExcludeList.length ? props.customExcludeList : ['node_modules', 'dist', 'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml']
    try {
        const diff = await git.diff([
            '--',
            ...defaultExcludeList.map(ex => `:(exclude)${ex}`)
        ]);
        return diff;
    } catch (error) {
        console.error('Error fetching changed files:', error);
        process.exit(1);
    }
}

async function readFileHandler(path: string) {
    const filename = `+++ ${path}: \n`
    const data = await fs.readFile(path, 'utf8')
    return filename + data
}

async function getUntrackedFiles() {
    const git = simpleGit();
    try {
        const untracked = await git.status()
        const filePromiseList = untracked.not_added.map(path => {
            return readFileHandler(path)
        })
        const resolvedList = await Promise.all(filePromiseList)
        return resolvedList.join('\n')
    } catch (error) {
        console.error('Error fetching changed files:', error);
        process.exit(1);
    }
}

async function generateCommitMessage(props: { context: string, model: string }) {
    try {
        const spinner = new LoadingSpinner('Generating commit messages')
        const model = new ChatOllama({
            baseUrl: "http://localhost:11434", // Default value
            model: props.model,
        });
        spinner.start()
        const stream = await model
            .pipe(new StringOutputParser())
            .stream(`
            Please generate a single commit message for the following code changes. The commit message should follow these guidelines:

            - Start with a type (e.g., 'feat', 'fix', etc.) that describes the overall nature of the changes.
            - Provide a brief, clear description that summarizes all the changes collectively.

            The format of the commit message should resemble: 'fix: loading error'.
            
            **Code Changes**
            ${props.context}
            `);

        for await (const chunk of stream) {
            spinner.stop()
            process.stdout.write(chunk)
        }
    } catch (error) {
        console.error('Error generating commit message:', error);
        process.exit(1);
    }
}

export async function runCommitMate() {
    const changedFiles = await getChangedFiles({ customExcludeList: argv.exclude.map(String) });
    const untrackedFiles = argv.untracked ? await getUntrackedFiles() : ''
    generateCommitMessage({
        context: changedFiles + untrackedFiles,
        model: argv.model
    });
}


