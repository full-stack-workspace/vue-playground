export type FileLanguage = 'vue' | 'typescript' | 'javascript' | 'css' | 'html' | 'json'

export interface PlaygroundFile {
  /** Unique file path (e.g., '/src/App.vue') */
  path: string
  /** File name with extension */
  name: string
  /** File content */
  content: string
  /** Detected or specified language */
  language: FileLanguage
  /** Whether content has unsaved changes */
  isModified?: boolean
}

export interface FileTreeItem {
  name: string
  path: string
  type: 'file' | 'folder'
  children?: FileTreeItem[]
  language?: FileLanguage
}

export interface PlaygroundState {
  /** All files in the virtual file system */
  files: Record<string, PlaygroundFile>
  /** Array of open file paths (order matters for tabs) */
  openFiles: string[]
  /** Currently active file path */
  activeFilePath: string | null
  /** File tree structure */
  fileTree: FileTreeItem[]
}
