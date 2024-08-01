import { simpleGit } from 'simple-git';
import { ChatOllama } from "@langchain/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { LoadingSpinner } from './loadingSpinner.js';

async function getChangedFiles() {
    const git = simpleGit();
    try {
        const diff = await git.diff([
            '--', 
            ':(exclude)node_modules', 
            ':(exclude)dist',
            ':(exclude)package-lock.json',
            ':(exclude)yarn.lock',
            ':(exclude)pnpm-lock.yaml'
        ]);
        return diff;
    } catch (error) {
        console.error('Error fetching changed files:', error);
        process.exit(1);
    }
}

async function generateCommitMessage(context: string) {
    try {
        const spinner = new LoadingSpinner('Generating commit messages')
        const model = new ChatOllama({
            baseUrl: "http://localhost:11434", // Default value
            model: "llama3.1:latest",
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
            ${context}
            `);

        for await (const chunk of stream) {
            spinner.stop()
            process.stdout.write(chunk)
        }

        console.log('')
    } catch (error) {
        console.error('Error generating commit message:', error);
        process.exit(1);
    }
}

export async function runCommitMate() {
    const changedFiles = await getChangedFiles();
    generateCommitMessage(changedFiles);
}


