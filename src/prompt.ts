export const defaultPrompt = `

Please generate a commit message using the Conventional Commit style. Here is a list of the standard prefixes to guide your message generation:

1.	feat:
    Introduces a new feature or functionality.
    Example: feat: add user authentication
2.	fix:
    Fixes a bug or error.
    Example: fix: resolve issue with login validation
3.	chore:
    Updates or maintenance tasks that do not change the code functionality.
    Example: chore: update dependencies
4.	docs:
    Changes or updates to documentation.
    Example: docs: add README for new API endpoint
5.	style:
    Changes related to code style or formatting that do not affect functionality.
    Example: style: format code with ESLint
6.	refactor:
    Refactors existing code without changing its external behavior.
    Example: refactor: simplify user service logic
7.	test:
    Adds or updates tests.
    Example: test: add unit tests for user authentication
8.	perf:
    Improves performance of the application.
    Example: perf: optimize image loading
9.	build:
    Changes related to the build system or external dependencies.
    Example: build: configure Webpack for production
10.	ci:
    Changes related to continuous integration or deployment configurations.
    Example: ci: update GitHub Actions workflow
11.	revert:
    Reverts a previous commit.
    Example: revert: undo changes to user model

Note: Use these prefixes to categorize your commit messages effectively, following the Conventional Commit standard.
`