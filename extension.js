const vscode = require("vscode");
const path = require("path");

function activate(context) {
    console.log('Your extension "try-catch-error-snippet" is now active!');

    let disposable = vscode.commands.registerCommand(
        "try-catch-error-snippet.tces",
        function () {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const document = editor.document;
                const position = editor.selection.active;

                const fileName = path.basename(document.fileName);
                const fileExtension = getFileExtension(fileName);
                const functionName = getEnclosingFunctionName(document, position, fileExtension);

                // Insert the try-catch snippet
                editor.edit((editBuilder) => {
                    editBuilder.insert(
                        position,
                        tryCatchCodeSnippet(fileExtension, functionName || null, fileName)
                    );
                }).then(() => {
                    // Move cursor to the beginning of the try block
                    moveCursorToTryBlock(editor, position);
                });
            }
        }
    );

    context.subscriptions.push(disposable);
}

function deactivate() {}

// Generate the try-catch code snippet based on the file extension and function name
function tryCatchCodeSnippet(fileExtension, functionName, fileName) {
    const snippets = {
        "js": functionName
            ? `
try {
    // Your code here
} catch (error) {
    console.error("${fileName}", " :: ${functionName}() :: Error ❌ : ", error);
}
`
            : `
try {
    // Your code here
} catch (error) {
    console.error("${fileName}", " :: Error ❌ : ", error);
}
`,
        // Other language snippets...
        // ...
    };

    return snippets[fileExtension.toLowerCase()] || '';
}

// Get the file extension from the file name
function getFileExtension(fileName) {
    const extWithDot = path.extname(fileName).toLowerCase();
    return extWithDot.slice(1); // Remove the dot from the extension
}

// Get the enclosing function name based on the cursor position and file extension
function getEnclosingFunctionName(document, position, fileExtension) {
    const text = document.getText();
    let functionRegex;

    if (!fileExtension) {
        return null; // Return null if fileExtension is not provided or falsy
    }

    fileExtension = fileExtension.toLowerCase();

    switch (fileExtension) {
        case 'js':
        case 'ts':
        case 'jsx':
        case 'tsx':
            functionRegex = /function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\([^)]*\)\s*\{[^]*?\}/g;
            break;
        case 'py':
            functionRegex = /def\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\([^)]*\)\s*:/g;
            break;
        case 'java':
            functionRegex = /(?:public|protected|private|static|\s)+[\w\<\>\[\]]+\s+(\w+)\s*\([^)]*\)\s*(\{?|[^;])/g;
            break;
        case 'c':
        case 'cpp':
            functionRegex = /(?:[\w\s*]+)\s+(\w+)\s*\([^)]*\)\s*{/g;
            break;
        case 'php':
            functionRegex = /function\s+([a-zA-Z_\x80-\xff][a-zA-Z0-9_\x80-\xff]*)\s*\([^)]*\)\s*{/g;
            break;
        case 'rb':
            functionRegex = /def\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\([^)]*\)\s*/g;
            break;
        case 'swift':
            functionRegex = /func\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\([^)]*\)\s*(->\s*\w+\s*)?\{/g;
            break;
        case 'cs':
            functionRegex = /(?:public|private|protected|internal|static)\s+(?:async\s+)?(?:\w+\s+)?(\w+)\s*\([^)]*\)\s*{/g;
            break;
        case 'go':
            functionRegex = /func\s+\(\s*[a-zA-Z_$][0-9a-zA-Z_$]*\s*\w*\s*\)\s+(\w+)\s*\([^)]*\)\s*{/g;
            break;
        case 'lua':
            functionRegex = /function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\([^)]*\)\s*{/g;
            break;
        case 'pl':
            functionRegex = /sub\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\([^)]*\)\s*{/g;
            break;
        // Add more cases as needed for other languages
        default:
            functionRegex = null;
    }

    if (!functionRegex) return null;

    const matches = getAllMatches(text, functionRegex);
    const enclosingFunction = matches.find(match => {
        const matchStartPos = document.positionAt(match.index);
        const matchEndPos = document.positionAt(match.index + match[0].length);
        return position.isAfter(matchStartPos) && position.isBefore(matchEndPos);
    });

    return enclosingFunction ? enclosingFunction[1] : null;
}

// Helper function to get all matches of a regex in a string
function getAllMatches(text, regex) {
    const matches = [];
    let match;
    while (match = regex.exec(text)) {
        matches.push(match);
    }
    return matches;
}

// Move cursor to the beginning of the try block
function moveCursorToTryBlock(editor, position) {
    const tryBlockStartRegex = /try\s*{\s*/g;
    const document = editor.document;
    const text = document.getText();

    let tryBlockMatch;
    while (tryBlockMatch = tryBlockStartRegex.exec(text)) {
        const tryBlockPosition = document.positionAt(tryBlockMatch.index);
        if (position.isBefore(tryBlockPosition)) {
            editor.selection = new vscode.Selection(tryBlockPosition, tryBlockPosition);
            editor.revealRange(new vscode.Range(tryBlockPosition, tryBlockPosition));
            return;
        }
    }

    // If no suitable try block is found, just move the cursor to the original position
    editor.selection = new vscode.Selection(position, position);
}

module.exports = {
    activate,
    deactivate
};
