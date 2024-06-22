
# Try-Catch Error Snippet Extension

 ## Overview
Writing effective try-catch error messages in large projects is sometimes very important but sometimes it becomes hard to write proper error messages in the catch field. Our VS Code extension simplifies this process significantly. It not only streamlines the creation of try-catch blocks but also automatically incorporates the current file name and parent function into the error message. This feature ensures that developers can quickly pinpoint which file and function encountered an issue, facilitating smoother debugging in complex codebases.



## Key Features
- Automatic Context Detection: 
Automatically identifies the current file name and attempts to detect the parent function where the error occurs.

- Improved Error Messages: 
Formats error messages to include "FileName.js" or "FileName.ts", and "FunctionName()" (if available), alongside detailed error information.

- Effortless Integration: 
Insert try-catch blocks quickly using the command palette (Ctrl+Shift+P) or directly with the shortcut Ctrl+Alt+T (for windows) or cmd+Alt+t (for Mac).

## Quick Start

-  #### Installation:

Install the extension from the Visual Studio Code Marketplace or search for "Try-Catch Error Snippet" in the Extensions view (Ctrl+Shift+X).

-  #### Inserting a Try-Catch Block:

Place your cursor within the function where you want to handle errors.
Use the command palette (Ctrl+Shift+P) and type "Try-Catch Error Snippet" to insert the snippet.
Alternatively, use the shortcut Ctrl+Alt+T to directly insert the try-catch block.

- #### Snippet Format:

The inserted try-catch block follows this format:

![Snippet format 📷](media\mediaFiles\ReadmeMedia\snippetFormat.png)

Replace "FileName.js" or "FileName.ts" dynamically with your actual file name.
"FunctionName()" dynamically represents the name of the function where the try-catch block is inserted, providing crucial context in the error message.
The error details are displayed in the console for quick reference.

### Known Issues and Future Updates
- The extension currently fully supports JavaScript (.js) and TypeScript (.ts) files for generating try-catch error snippets. For other languages like Java, Python, C, C++, and more, the extension provides basic support for try-catch snippets but does not yet detect parent functions. 

- It does not manage indentation automatically, which may impact snippet formatting. Future updates will include improved language support with automatic detection of parent functions. In the meantime, we recommend using a file formatter for optimal snippet performance.

- There can be some other bugs too, which will be solved in the next couple of updates. Your feedback will be really impotrant. :)