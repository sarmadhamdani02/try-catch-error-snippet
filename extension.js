const path = require("path");
const vscode = require("vscode");

function activate(context) {
  console.log('Your extension "try-catch-error-snippet" is now active!');

  let disposable = vscode.commands.registerCommand(
    "try-catch-error-snippet.tces",
    function () {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        const position = editor.selection.active;

        const functionName = getEnclosingFunctionName(document, position);
        const fileName = path.basename(document.fileName);
        const fileExtension = getFileExtension(fileName);

        // Insert the try-catch snippet
        editor
          .edit((editBuilder) => {
            editBuilder.insert(
              position,
              tryCatchCodeSnippet(fileExtension, functionName || null, fileName, position)
            );
          })
          .then(() => {
            // Move cursor to the beginning of the try block
            moveCursorToTryBlock(editor, position);
          });
      }
    }
  );

  context.subscriptions.push(disposable);
}

function deactivate() {}

function tryCatchCodeSnippet(fileExtension = "js", functionName, fileName, position) {
  const indent = " ".repeat(position.character);
  const snippets = {
    "js": functionName
      ? `
${indent}try {
${indent}} catch (error) {
${indent}    console.error("${fileName}", " :: ${functionName}() :: Error ❌ : ", error);
${indent}}
`
      : `
${indent}try {
${indent}} catch (error) {
${indent}    console.error("${fileName}", " :: Error ❌ : ", error);
${indent}}
`,
    "jsx": functionName
      ? `
${indent}try {
${indent}} catch (error) {
${indent}    console.error("${fileName}", " :: ${functionName}() :: Error ❌ : ", error);
${indent}}
`
      : `
${indent}try {
${indent}} catch (error) {
${indent}    console.error("${fileName}", " :: Error ❌ : ", error);
${indent}}
`,
    "ts": functionName
      ? `
${indent}try {
${indent}} catch (error) {
${indent}    console.error("${fileName}", " :: ${functionName}() :: Error ❌ : ", error);
${indent}}
`
      : `
${indent}try {
${indent}} catch (error) {
${indent}    console.error("${fileName}", " :: Error ❌ : ", error);
${indent}}
`,
    "tsx": functionName
      ? `
${indent}try {
${indent}} catch (error) {
${indent}    console.error("${fileName}", " :: ${functionName}() :: Error ❌ : ", error);
${indent}}
`
      : `
${indent}try {
${indent}} catch (error) {
${indent}    console.error("${fileName}", " :: Error ❌ : ", error);
${indent}}
`,
    "java": functionName
      ? `
${indent}try {
${indent}} catch (Exception e) {
${indent}    System.err.println("${fileName}" + " :: ${functionName}() :: Error ❌ : " + e);
${indent}}
`
      : `
${indent}try {
${indent}} catch (Exception e) {
${indent}    System.err.println("${fileName}" + " :: Error ❌ : " + e);
${indent}}
`,
    "cpp": functionName
      ? `
${indent}try {
${indent}} catch (const std::exception& e) {
${indent}    std::cerr << "${fileName}" << " :: ${functionName}() :: Error ❌ : " << e.what() << std::endl;
${indent}}
`
      : `
${indent}try {
${indent}} catch (const std::exception& e) {
${indent}    std::cerr << "${fileName}" << " :: Error ❌ : " << e.what() << std::endl;
${indent}}
`,
    "c": functionName
      ? `
${indent}try {
${indent}} catch (const std::exception& e) {
${indent}    std::cerr << "${fileName}" << " :: ${functionName}() :: Error ❌ : " << e.what() << std::endl;
${indent}}
`
      : `
${indent}try {
${indent}} catch (const std::exception& e) {
${indent}    std::cerr << "${fileName}" << " :: Error ❌ : " << e.what() << std::endl;
${indent}}
`,
    "py": functionName
      ? `
${indent}try:
${indent}    pass
${indent}except Exception as e:
${indent}    print("${fileName}", " :: ${functionName}() :: Error ❌ : ", e)
`
      : `
${indent}try:
${indent}    pass
${indent}except Exception as e:
${indent}    print("${fileName}", " :: Error ❌ : ", e)
`,
    "cs": functionName
      ? `
${indent}try
${indent}{
${indent}}
${indent}catch (Exception ex)
${indent}{
${indent}    Console.WriteLine("${fileName}" + " :: ${functionName}() :: Error ❌ : " + ex.Message);
${indent}}
`
      : `
${indent}try
${indent}{
${indent}}
${indent}catch (Exception ex)
${indent}{
${indent}    Console.WriteLine("${fileName}" + " :: Error ❌ : " + ex.Message);
${indent}}
`,
    "rb": functionName
      ? `
${indent}begin
${indent}rescue => e
${indent}    puts "${fileName}" + " :: ${functionName}() :: Error ❌ : " + e.to_s
${indent}end
`
      : `
${indent}begin
${indent}rescue => e
${indent}    puts "${fileName}" + " :: Error ❌ : " + e.to_s
${indent}end
`,
    "php": functionName
      ? `
${indent}try {
${indent}} catch (Exception $e) {
${indent}    echo "${fileName}" . " :: ${functionName}() :: Error ❌ : " . $e->getMessage();
${indent}}
`
      : `
${indent}try {
${indent}} catch (Exception $e) {
${indent}    echo "${fileName}" . " :: Error ❌ : " . $e->getMessage();
${indent}}
`,
    "swift": functionName
      ? `
${indent}do {
${indent}} catch {
${indent}    print("${fileName}", " :: ${functionName}() :: Error ❌ : ", error)
${indent}}
`
      : `
${indent}do {
${indent}} catch {
${indent}    print("${fileName}", " :: Error ❌ : ", error)
${indent}}
`,
    "kt": functionName
      ? `
${indent}try {
${indent}} catch (e: Exception) {
${indent}    println("${fileName}" + " :: ${functionName}() :: Error ❌ : " + e.message)
${indent}}
`
      : `
${indent}try {
${indent}} catch (e: Exception) {
${indent}    println("${fileName}" + " :: Error ❌ : " + e.message)
${indent}}
`,
    "rs": functionName
      ? `
${indent}// Your code here
${indent}match result {
${indent}    Ok(val) => val,
${indent}    Err(e) => {
${indent}        eprintln!("${fileName}" + " :: ${functionName}() :: Error ❌ : {}", e);
${indent}        // Handle error
${indent}    }
${indent}}
`
      : `
${indent}// Your code here
${indent}match result {
${indent}    Ok(val) => val,
${indent}    Err(e) => {
${indent}        eprintln!("${fileName}" + " :: Error ❌ : {}", e);
${indent}        // Handle error
${indent}    }
${indent}}
`,
    "go": functionName
      ? `
${indent}// Your code here
${indent}func ${functionName}() {
${indent}    defer func() {
${indent}        if r := recover(); r != nil {
${indent}            fmt.Println("${fileName}", " :: ${functionName}() :: Error ❌ : ", r)
${indent}        }
${indent}    }()
${indent}}
`
      : `
${indent}// Your code here
${indent}func ${functionName}() {
${indent}    defer func() {
${indent}        if r := recover(); r != nil {
${indent}            fmt.Println("${fileName}", " :: Error ❌ : ", r)
${indent}        }
${indent}    }()
${indent}}
`,
    "scala": functionName
      ? `
${indent}try {
${indent}} catch {
${indent}    case e: Exception =>
${indent}        println("${fileName}" + " :: ${functionName}() :: Error ❌ : " + e.getMessage)
${indent}}
`
      : `
${indent}try {
${indent}} catch {
${indent}    case e: Exception =>
${indent}        println("${fileName}" + " :: Error ❌ : " + e.getMessage)
${indent}}
`
  };

  return snippets[fileExtension] || snippets["js"];
}

function getEnclosingFunctionName(document, position) {
  const textBeforeCursor = document.getText(new vscode.Range(new vscode.Position(0, 0), position));
  const functionRegex = /function\s+([a-zA-Z0-9_]+)\s*\(/g;
  let match;
  let lastFunctionName = null;

  while ((match = functionRegex.exec(textBeforeCursor)) !== null) {
    lastFunctionName = match[1];
  }

  return lastFunctionName;
}

function getFileExtension(fileName) {
  return fileName.split('.').pop();
}

function moveCursorToTryBlock(editor, position) {
  const newPosition = position.with(position.line, position.character + 5);
  const newSelection = new vscode.Selection(newPosition, newPosition);
  editor.selection = newSelection;
}

module.exports = {
  activate,
  deactivate,
};
