<script setup lang="ts">
import { ref } from 'vue'
import { usePlaygroundStore } from '@/stores/playground'
import FileExplorer from './FileExplorer.vue'
import EditorTabs from './EditorTabs.vue'
import CodeEditor from './CodeEditor.vue'
import Preview from './Preview.vue'

const store = usePlaygroundStore()
const showPreview = ref(true)
</script>

<template>
  <div class="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
    <!-- Header -->
    <header class="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
      <h1 class="text-lg font-semibold">Vue Playground</h1>
      <button
        @click="showPreview = !showPreview"
        class="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded transition"
      >
        {{ showPreview ? 'Hide Preview' : 'Show Preview' }}
      </button>
    </header>

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- File Explorer Sidebar -->
      <aside class="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <FileExplorer />
      </aside>

      <!-- Editor Area -->
      <main class="flex-1 flex flex-col overflow-hidden">
        <!-- Tabs -->
        <EditorTabs />

        <!-- Code Editor -->
        <div class="flex-1 overflow-hidden">
          <CodeEditor />
        </div>
      </main>

      <!-- Preview Panel -->
      <aside
        v-if="showPreview"
        class="w-1/2 border-l border-gray-700 flex flex-col bg-white"
      >
        <Preview />
      </aside>
    </div>
  </div>
</template>
