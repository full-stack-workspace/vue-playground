<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, shallowRef } from 'vue'
import { usePlaygroundStore } from '@/stores/playground'
import * as monaco from 'monaco-editor'

const store = usePlaygroundStore()
const containerRef = ref<HTMLDivElement | null>(null)
const editor = shallowRef<monaco.editor.IStandaloneCodeEditor | null>(null)

const languageMap: Record<string, string> = {
  vue: 'html',
  typescript: 'typescript',
  javascript: 'javascript',
  css: 'css',
  html: 'html',
  json: 'json'
}

function getMonacoLanguage(lang: string): string {
  return languageMap[lang] || 'typescript'
}

// Configure Monaco workers
self.MonacoEnvironment = {
  getWorker: function (_: any, label: string) {
    const getWorkerModule = (moduleUrl: string, label: string) => {
      return new Worker(self.MonacoEnvironment.getWorkerUrl(moduleUrl), {
        name: label,
        type: 'module'
      })
    }

    // Use CDN for workers in browser environment
    const src = `
      self.onmessage = function() {
        // Worker loaded
      };
    `
    const blob = new Blob([src], { type: 'application/javascript' })
    return new Worker(URL.createObjectURL(blob))
  }
}

onMounted(() => {
  if (!containerRef.value) return

  // Configure Monaco theme
  monaco.editor.defineTheme('playground-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#1f2937',
      'editor.foreground': '#f3f4f6',
      'editor.lineHighlightBackground': '#374151',
      'editorLineNumber.foreground': '#6b7280',
      'editorLineNumber.activeForeground': '#9ca3af'
    }
  })

  editor.value = monaco.editor.create(containerRef.value, {
    value: store.activeFile?.content || '',
    language: getMonacoLanguage(store.activeFile?.language || 'vue'),
    theme: 'playground-dark',
    minimap: { enabled: false },
    fontSize: 14,
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    lineNumbers: 'on',
    roundedSelection: true,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    wordWrap: 'on',
    padding: { top: 16 }
  })

  // Listen for content changes
  editor.value.onDidChangeModelContent(() => {
    if (store.activeFilePath) {
      store.updateFile(store.activeFilePath, editor.value!.getValue())
    }
  })
})

// Watch for active file changes
watch(
  () => store.activeFilePath,
  (newPath) => {
    if (!editor.value || !newPath) return

    const file = store.files[newPath]
    if (file) {
      const currentValue = editor.value.getValue()
      if (currentValue !== file.content) {
        editor.value.setValue(file.content)
      }
      editor.value.updateOptions({
        language: getMonacoLanguage(file.language)
      })
    }
  }
)

// Handle window resize
const handleResize = () => {
  editor.value?.layout()
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  editor.value?.dispose()
  monaco.editor.getModels().forEach(model => model.dispose())
})
</script>

<template>
  <div ref="containerRef" class="w-full h-full"></div>
</template>
