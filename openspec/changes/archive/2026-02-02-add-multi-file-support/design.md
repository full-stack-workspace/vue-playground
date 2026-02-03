## Context
The Vue playground needs multi-file editing capabilities to support realistic Vue development scenarios. This is a greenfield implementation - no playground components exist yet.

**Constraints:**
- Must work entirely client-side (no backend file storage)
- Files must persist during session (in-memory)
- Should support Vue SFC (.vue) files primarily
- Editor should provide syntax highlighting and basic editing features

**Stakeholders:** Frontend developers using the playground for prototyping and code sharing

## Goals / Non-Goals

### Goals:
- Provide a virtual file system for managing multiple files
- Enable file creation, editing, deletion, and renaming
- Show file tree navigation (file explorer)
- Support tab-based editing with switchable active files
- Integrate a code editor with syntax highlighting

### Non-Goals:
- Full IDE features (intellisense, refactoring, debugging)
- Git integration or version control
- File imports/exports (may come in future change)
- Multi-user collaboration (out of scope)

## Decisions

### 1. Editor Library: Monaco Editor
**Decision:** Use Monaco Editor (VS Code's editor) for the code editing experience.

**Rationale:**
- Industry standard for code playgrounds
- Excellent TypeScript/Vue support out of the box
- Familiar to developers coming from VS Code
- Active maintenance and community support

**Alternatives considered:**
- CodeMirror 6: Lighter weight, good Vue support, but less familiar to general developers
- Prism/Highlight.js: Read-only highlighting only, no editing

### 2. State Management: Pinia Store
**Decision:** Use Pinia for managing file state and playground state.

**Rationale:**
- Vue 3's recommended state management
- Simple API with TypeScript support
- Minimal boilerplate compared to Vuex

### 3. Virtual File System Structure
**Decision:** Store files as a map with path keys:
```typescript
interface File {
  name: string
  path: string
  content: string
  language: 'vue' | 'ts' | 'js' | 'css' | 'html'
}
```

**Rationale:**
- Simple structure for in-memory files
- Easy to serialize for URL sharing later
- Direct path lookup O(1) complexity

### 4. Component Architecture
```
src/
├── components/
│   ├── Playground.vue        # Main container
│   ├── FileExplorer.vue      # File tree navigation
│   ├── EditorTabs.vue        # Open files tabs
│   ├── CodeEditor.vue        # Monaco wrapper
│   └── Preview.vue           # Live preview frame
├── stores/
│   └── playground.ts         # File and UI state
└── types/
    └── file.ts               # File type definitions
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Monaco bundle size (~2MB) | Lazy load editor, only initialize when needed |
| Memory usage with many files | Limit file count, implement file closing |
| Vue SFC compilation complexity | Use @vue/compiler-sfc for browser-side parsing |

## Migration Plan
N/A - Greenfield implementation. No existing users or data to migrate.

## Open Questions
1. Should files be shareable via URL (compressed state)?
2. Do we need template presets (Vue Router, Pinia setup)?
3. How to handle file dependencies/imports between files?
