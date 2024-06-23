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
              tryCatchCodeSnippet(fileExtension, functionName || null, fileName)
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

function tryCatchCodeSnippet(fileExtension = "js", functionName, fileName) {
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
        "java": functionName
            ? `
try {
    // Your code here
} catch (Exception e) {
    System.err.println("${fileName}" + " :: ${functionName}() :: Error ❌ : " + e);
}
`
            : `
try {
    // Your code here
} catch (Exception e) {
    System.err.println("${fileName}" + " :: Error ❌ : " + e);
}
`,
        "cpp": functionName
            ? `
try {
    // Your code here
} catch (const std::exception& e) {
    std::cerr << "${fileName}" << " :: ${functionName}() :: Error ❌ : " << e.what() << std::endl;
}
`
            : `
try {
    // Your code here
} catch (const std::exception& e) {
    std::cerr << "${fileName}" << " :: Error ❌ : " << e.what() << std::endl;
}
`,
        "py": functionName
            ? `
try:
    # Your code here
except Exception as e:
    print("${fileName}", " :: ${functionName}() :: Error ❌ : ", e)
`
            : `
try:
    # Your code here
except Exception as e:
    print("${fileName}", " :: Error ❌ : ", e)
`,
        "cs": functionName
            ? `
try
{
    // Your code here
}
catch (Exception ex)
{
    Console.WriteLine("${fileName}" + " :: ${functionName}() :: Error ❌ : " + ex.Message);
}
`
            : `
try
{
    // Your code here
}
catch (Exception ex)
{
    Console.WriteLine("${fileName}" + " :: Error ❌ : " + ex.Message);
}
`,
        "rb": functionName
            ? `
begin
    # Your code here
rescue => e
    puts "${fileName}" + " :: ${functionName}() :: Error ❌ : " + e.to_s
end
`
            : `
begin
    # Your code here
rescue => e
    puts "${fileName}" + " :: Error ❌ : " + e.to_s
end
`,
        "php": functionName
            ? `
try {
    // Your code here
} catch (Exception $e) {
    echo "${fileName}" . " :: ${functionName}() :: Error ❌ : " . $e->getMessage();
}
`
            : `
try {
    // Your code here
} catch (Exception $e) {
    echo "${fileName}" . " :: Error ❌ : " . $e->getMessage();
}
`,
        "swift": functionName
            ? `
do {
    // Your code here
} catch {
    print("${fileName}", " :: ${functionName}() :: Error ❌ : ", error)
}
`
            : `
do {
    // Your code here
} catch {
    print("${fileName}", " :: Error ❌ : ", error)
}
`,
        "kt": functionName
            ? `
try {
    // Your code here
} catch (e: Exception) {
    println("${fileName}" + " :: ${functionName}() :: Error ❌ : " + e.message)
}
`
            : `
try {
    // Your code here
} catch (e: Exception) {
    println("${fileName}" + " :: Error ❌ : " + e.message)
}
`,
        "rs": functionName
            ? `
// Your code here
match result {
    Ok(val) => val,
    Err(e) => {
        eprintln!("${fileName}" + " :: ${functionName}() :: Error ❌ : {}", e);
        // Handle error
    }
}
`
            : `
// Your code here
match result {
    Ok(val) => val,
    Err(e) => {
        eprintln!("${fileName}" + " :: Error ❌ : {}", e);
        // Handle error
    }
}
`,
        "go": functionName
            ? `
// Your code here
func ${functionName}() {
    defer func() {
        if r := recover(); r != nil {
            fmt.Println("${fileName}", " :: ${functionName}() :: Error ❌ : ", r)
        }
    }()
}
`
            : `
// Your code here
func ${functionName}() {
    defer func() {
        if r := recover(); r != nil {
            fmt.Println("${fileName}", " :: Error ❌ : ", r)
        }
    }()
}
`,
        "scala": functionName
            ? `
try {
    // Your code here
} catch {
    case e: Exception =>
        println("${fileName}" + " :: ${functionName}() :: Error ❌ : " + e.getMessage)
}
`
            : `
try {
    // Your code here
} catch {
    case e: Exception =>
        println("${fileName}" + " :: Error ❌ : " + e.getMessage)
}
`,
        "pl": functionName
            ? `
eval {
    # Your code here
    1;
} or do {
    my $e = $@;
    print "${fileName}" + " :: ${functionName}() :: Error ❌ : $e\n";
};
`
            : `
eval {
    # Your code here
    1;
} or do {
    my $e = $@;
    print "${fileName}" + " :: Error ❌ : $e\n";
};
`,
        "m": functionName
            ? `
@try {
    // Your code here
} @catch (NSException *exception) {
    NSLog(@"${fileName}" + " :: ${functionName}() :: Error ❌ : %@", exception.reason);
}
`
            : `
@try {
    // Your code here
} @catch (NSException *exception) {
    NSLog(@"${fileName}" + " :: Error ❌ : %@", exception.reason);
}
`,
        "hs": functionName
            ? `
-- Your code here
${functionName} :: IO ()
${functionName} = catch
    (do
        -- Your code here
    )
    (\\(e :: SomeException) ->
        putStrLn ("${fileName}" ++ " :: ${functionName}() :: Error ❌ : " ++ show e)
    )
`
            : `
-- Your code here
${functionName} :: IO ()
${functionName} = catch
    (do
        -- Your code here
    )
    (\\(e :: SomeException) ->
        putStrLn ("${fileName}" ++ " :: Error ❌ : " ++ show e)
    )
`,
        "lua": functionName
            ? `
-- Your code here
local success, result = pcall(function()
    -- Your code here
end)
if not success then
    print("${fileName}" .. " :: ${functionName}() :: Error ❌ : " .. result)
end
`
            : `
-- Your code here
local success, result = pcall(function()
    -- Your code here
end)
if not success then
    print("${fileName}" .. " :: Error ❌ : " .. result)
end
`,
        "dart": functionName
            ? `
try {
    // Your code here
} catch (e) {
    print("${fileName}" + " :: ${functionName}() :: Error ❌ : " + e.toString());
}
`
            : `
try {
    // Your code here
} catch (e) {
    print("${fileName}" + " :: Error ❌ : " + e.toString());
}
`,
        "erl": functionName
            ? `
% Your code here
${functionName}() ->
    try
        % Your code here
    catch
        error:Error ->
            io:format("${fileName}" + " :: ${functionName}() :: Error ❌ : ~p~n", [Error])
    end.
`
            : `
% Your code here
${functionName}() ->
    try
        % Your code here
    catch
        error:Error ->
            io:format("${fileName}" + " :: Error ❌ : ~p~n", [Error])
    end.
`,
        "groovy": functionName
            ? `
try {
    // Your code here
} catch (Exception e) {
    println("${fileName}" + " :: ${functionName}() :: Error ❌ : " + e.getMessage());
}
`
            : `
try {
    // Your code here
} catch (Exception e) {
    println("${fileName}" + " :: Error ❌ : " + e.getMessage());
}
`,
        "vb": functionName
            ? `
Try
    ' Your code here
Catch ex As Exception
    Console.WriteLine("${fileName}" + " :: ${functionName}() :: Error ❌ : " & ex.Message)
End Try
`
            : `
Try
    ' Your code here
Catch ex As Exception
    Console.WriteLine("${fileName}" + " :: Error ❌ : " & ex.Message)
End Try
`
    };

    return snippets[fileExtension.toLowerCase()] || '';
}

function getFileExtension(fileName) {
	const extWithDot = path.extname(fileName).toLowerCase();
    return extWithDot.slice(1); 
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