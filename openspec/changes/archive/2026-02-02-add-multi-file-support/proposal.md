# Change: Add Multi-File Support to Vue Playground

## Why
A real Vue development workflow involves multiple files (components, composables, utilities). Single-file playgrounds are insufficient for demonstrating Vue patterns, testing component composition, or prototyping realistic codebases. Multi-file support will enable developers to create, edit, and manage multiple files within the playground.

## What Changes
- New virtual file system for managing in-memory files
- File explorer UI showing file tree structure
- Tab-based editor interface for switching between open files
- File creation, deletion, and renaming capabilities
- Editor component integration (Monaco/CodeMirror)
- Preview component that compiles and renders the active file

## Impact
- Affected specs: `playground` (new capability)
- Affected code: New components in `src/components/`, new store in `src/stores/`
- New dependencies: Code editor library (Monaco or CodeMirror)
