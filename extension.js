const vscode = require("vscode");
const path = require("path");

function activate(context) {
  console.log('Your extension "findFunctionName" is now active!');

  let disposable = vscode.commands.registerCommand(
    "try-catch-error-snippet.tces",
    function () {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        const position = editor.selection.active;

        const functionName = getEnclosingFunctionName(document, position);
        editor.edit((editBuilder) => {
          //   editBuilder.insert(position, functionName || "null");
          editBuilder.insert(
            position,
            tryCatchCodeSnippet(
              "JS",
              functionName || null,
              path.basename(document.fileName)
            )
          );
        });
      }
    }
  );

  context.subscriptions.push(disposable);
}

function deactivate() {}

function tryCatchCodeSnippet(fileType = "JS", functionName, fileName) {
  if (fileType === "JS") {
    return functionName
      ? `
	try {
   
	} 	
	catch (error) {
    
    console.error(${fileName}," :: ", ${functionName} ,"() :: Error ❌ : ", error);
	
	}

		`
      : `
try {
   
} 
catch (error) {
    
	console.error(${fileName}," :: Error ❌ : ", error);

	}

		`;
  }
}

function getEnclosingFunctionName(document, position) {
  const text = document.getText();
  const functionRegex =
    /function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\([^)]*\)\s*\{[^]*?\}/g;
  let match;
  let functionName = null;

  while ((match = functionRegex.exec(text)) !== null) {
    const startPos = document.positionAt(match.index);
    const endPos = document.positionAt(match.index + match[0].length);

    if (position.isAfter(startPos) && position.isBefore(endPos)) {
      functionName = match[1];
      break;
    }
  }

  return functionName;
}

module.exports = {
  activate,
  deactivate,
};
