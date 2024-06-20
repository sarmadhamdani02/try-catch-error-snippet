const vscode = require("vscode");
const path = require("path");

function activate(context) {
    console.log('Your extension "try-catch-error-snippet" is now active!');

    let disposable = vscode.commands.registerCommand("try-catch-error-snippet.tces", function () {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const position = editor.selection.active;

            const functionName = getEnclosingFunctionName(document, position);
            const fileName = path.basename(document.fileName);

            // Insert the try-catch snippet
            editor.edit((editBuilder) => {
                editBuilder.insert(
                    position,
                    tryCatchCodeSnippet("JS", functionName || null, fileName)
                );
            }).then(() => {
                // Move cursor to the beginning of the try block
                moveCursorToTryBlock(editor, position);
            });
        }
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

function tryCatchCodeSnippet(fileType = "JS", functionName, fileName) {
    if (fileType === "JS") {
        return functionName
            ? `
try {
    
} catch (error) {
    console.error(${fileName}, " :: ${functionName}() :: Error ❌ : ", error);
}
`
            : `
try {
    
} catch (error) {
    console.error(${fileName}, " :: Error ❌ : ", error);
}
`;
    }
}

function getEnclosingFunctionName(document, position) {
    const text = document.getText();
    const functionRegex = /function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\([^)]*\)\s*\{[^]*?\}/g;
    let match;
    let functionName = null;

    while ((match = functionRegex.exec(text)) !== null) {
        const startPos = document.positionAt(match.index);
        const endPos = document.positionAt(match.index + match[0].length);

        if (position.isAfterOrEqual(startPos) && position.isBeforeOrEqual(endPos)) {
            functionName = match[1];
            break;
        }
    }

    return functionName;
}

function moveCursorToTryBlock(editor, position) {
    // Define the line where the try block starts (adjust as needed)
    const tryBlockStartLine = position.line + 2;

    // Move cursor to the beginning of the try block
    const newPosition = new vscode.Position(tryBlockStartLine, 4); // Assuming indentation of 4 spaces
    editor.selection = new vscode.Selection(newPosition, newPosition);
}

module.exports = {
    activate,
    deactivate,
};
