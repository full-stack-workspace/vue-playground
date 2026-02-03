import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PlaygroundFile, FileTreeItem, FileLanguage } from '@/types/file'

const DEFAULT_FILES: Record<string, PlaygroundFile> = {
  '/App.vue': {
    path: '/App.vue',
    name: 'App.vue',
    content: `<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4">
    <h1 class="text-3xl font-bold mb-4">Vue Playground</h1>
    <p class="mb-4">Edit this file to see changes!</p>
    <button
      @click="count++"
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
    >
      Count is: {{ count }}
    </button>
  </div>
</template>
`,
    language: 'vue'
  },
  '/main.ts': {
    path: '/main.ts',
    name: 'main.ts',
    content: `import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
`,
    language: 'typescript'
  },
  '/index.html': {
    path: '/index.html',
    name: 'index.html',
    content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vue Playground</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/main.ts"></script>
  </body>
</html>
`,
    language: 'html'
  }
}

function detectLanguage(path: string): FileLanguage {
  const ext = path.split('.').pop()?.toLowerCase()
  const map: Record<string, FileLanguage> = {
    vue: 'vue',
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    css: 'css',
    html: 'html',
    json: 'json'
  }
  return map[ext || ''] || 'typescript'
}

function buildFileTree(files: Record<string, PlaygroundFile>): FileTreeItem[] {
  const root: FileTreeItem[] = []

  // Sort file paths
  const sortedPaths = Object.keys(files).sort()

  for (const path of sortedPaths) {
    const parts = path.split('/').filter(Boolean)
    let currentLevel = root

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      const currentPath = '/' + parts.slice(0, i + 1).join('/')
      const isFile = i === parts.length - 1

      if (isFile) {
        currentLevel.push({
          name: part,
          path: currentPath,
          type: 'file',
          language: files[path]?.language || detectLanguage(path)
        })
      } else {
        let existing = currentLevel.find(item => item.name === part && item.type === 'folder')
        if (!existing) {
          existing = {
            name: part,
            path: currentPath,
            type: 'folder',
            children: []
          }
          currentLevel.push(existing)
        }
        currentLevel = existing.children!
      }
    }
  }

  return root
}

export const usePlaygroundStore = defineStore('playground', () => {
  // State
  const files = ref<Record<string, PlaygroundFile>>(structuredClone(DEFAULT_FILES))
  const openFiles = ref<string[]>(['/App.vue'])
  const activeFilePath = ref<string | null>('/App.vue')

  // Computed
  const activeFile = computed(() =>
    activeFilePath.value ? files.value[activeFilePath.value] : null
  )

  const fileTree = computed(() => buildFileTree(files.value))

  // Actions
  function createFile(path: string, content = '') {
    if (files.value[path]) return

    const name = path.split('/').pop() || path
    files.value[path] = {
      path,
      name,
      content,
      language: detectLanguage(path)
    }
    openFile(path)
  }

  function updateFile(path: string, content: string) {
    if (files.value[path]) {
      files.value[path].content = content
      files.value[path].isModified = true
    }
  }

  function deleteFile(path: string) {
    delete files.value[path]

    // Remove from open files
    const openIndex = openFiles.value.indexOf(path)
    if (openIndex !== -1) {
      openFiles.value.splice(openIndex, 1)
    }

    // Update active file if needed
    if (activeFilePath.value === path) {
      activeFilePath.value = openFiles.value[openFiles.value.length - 1] || null
    }
  }

  function renameFile(oldPath: string, newPath: string) {
    const file = files.value[oldPath]
    if (!file) return

    const newName = newPath.split('/').pop() || newPath
    delete files.value[oldPath]
    files.value[newPath] = {
      ...file,
      path: newPath,
      name: newName
    }

    // Update open files
    const openIndex = openFiles.value.indexOf(oldPath)
    if (openIndex !== -1) {
      openFiles.value[openIndex] = newPath
    }

    // Update active file
    if (activeFilePath.value === oldPath) {
      activeFilePath.value = newPath
    }
  }

  function openFile(path: string) {
    if (!openFiles.value.includes(path)) {
      openFiles.value.push(path)
    }
    activeFilePath.value = path
  }

  function closeFile(path: string) {
    const openIndex = openFiles.value.indexOf(path)
    if (openIndex === -1) return

    openFiles.value.splice(openIndex, 1)

    if (activeFilePath.value === path) {
      activeFilePath.value = openFiles.value[Math.max(0, openIndex - 1)] || null
    }
  }

  function setActiveFile(path: string) {
    if (files.value[path]) {
      activeFilePath.value = path
      if (!openFiles.value.includes(path)) {
        openFiles.value.push(path)
      }
    }
  }

  function markSaved(path: string) {
    if (files.value[path]) {
      files.value[path].isModified = false
    }
  }

  function getFileContent(path: string): string {
    return files.value[path]?.content || ''
  }

  return {
    // State
    files,
    openFiles,
    activeFilePath,
    // Computed
    activeFile,
    fileTree,
    // Actions
    createFile,
    updateFile,
    deleteFile,
    renameFile,
    openFile,
    closeFile,
    setActiveFile,
    markSaved,
    getFileContent
  }
})
