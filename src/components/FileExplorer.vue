<script setup lang="ts">
import { ref } from 'vue'
import { usePlaygroundStore } from '@/stores/playground'

const store = usePlaygroundStore()
const expandedFolders = ref<Set<string>>(new Set(['/']))

function toggleFolder(path: string) {
  if (expandedFolders.value.has(path)) {
    expandedFolders.value.delete(path)
  } else {
    expandedFolders.value.add(path)
  }
}

function selectFile(path: string) {
  store.setActiveFile(path)
}

function startRename(item: { path: string; name: string }) {
  const newName = prompt('Rename file:', item.name)
  if (newName && newName.trim()) {
    store.renameFile(item.path, '/' + newName.trim())
  }
}

function deleteFile(item: { path: string; name: string }) {
  if (confirm(`Delete ${item.name}?`)) {
    store.deleteFile(item.path)
  }
}

function createNewFile() {
  const path = '/NewFile.vue'
  store.createFile(path, '<script setup lang="ts">\n\n<\/script>\n\n<template>\n  <div></div>\n</template>\n')
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Toolbar -->
    <div class="flex items-center justify-between px-3 py-2 border-b border-gray-700">
      <span class="text-xs text-gray-400 uppercase tracking-wider">Files</span>
      <button
        @click="createNewFile"
        class="text-gray-400 hover:text-white text-lg leading-none"
        title="New File"
      >
        +
      </button>
    </div>

    <!-- File Tree -->
    <div class="flex-1 overflow-y-auto py-2">
      <div
        v-for="item in store.fileTree"
        :key="item.path"
        class="group"
      >
        <div v-if="item.type === 'folder'">
          <button
            @click="toggleFolder(item.path)"
            class="flex items-center w-full px-3 py-1 hover:bg-gray-700 text-left text-sm"
          >
            <span class="mr-1 text-gray-500">
              {{ expandedFolders.has(item.path) ? '▼' : '▶' }}
            </span>
            <span>{{ item.name }}</span>
          </button>
          <div v-if="expandedFolders.has(item.path) && item.children" class="ml-2">
            <div
              v-for="child in item.children"
              :key="child.path"
              class="group"
            >
              <div v-if="child.type === 'folder'">
                <button
                  @click="toggleFolder(child.path)"
                  class="flex items-center w-full px-3 py-1 hover:bg-gray-700 text-left text-sm"
                >
                  <span class="mr-1 text-gray-500">
                    {{ expandedFolders.has(child.path) ? '▼' : '▶' }}
                  </span>
                  <span>{{ child.name }}</span>
                </button>
                <div v-if="expandedFolders.has(child.path) && child.children" class="ml-2">
                  <div
                    v-for="file in child.children"
                    :key="file.path"
                    class="group flex items-center"
                  >
                    <button
                      @click="selectFile(file.path)"
                      class="flex items-center w-full px-3 py-1 hover:bg-gray-700 text-left text-sm text-gray-300"
                      :class="{ 'text-blue-400': store.activeFilePath === file.path }"
                    >
                      <span class="mr-2 text-gray-500 text-xs">{{ file.language }}</span>
                      <span>{{ file.name }}</span>
                    </button>
                    <div class="ml-auto pr-2 opacity-0 group-hover:opacity-100 flex gap-1">
                      <button
                        @click="startRename(file)"
                        class="text-gray-400 hover:text-white text-xs"
                      >✏️</button>
                      <button
                        @click="deleteFile(file)"
                        class="text-gray-400 hover:text-red-400 text-xs"
                      >🗑️</button>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="group flex items-center">
                <button
                  @click="selectFile(child.path)"
                  class="flex items-center w-full px-3 py-1 hover:bg-gray-700 text-left text-sm text-gray-300"
                  :class="{ 'text-blue-400': store.activeFilePath === child.path }"
                >
                  <span class="mr-2 text-gray-500 text-xs">{{ child.language }}</span>
                  <span>{{ child.name }}</span>
                </button>
                <div class="ml-auto pr-2 opacity-0 group-hover:opacity-100 flex gap-1">
                  <button
                    @click="startRename(child)"
                    class="text-gray-400 hover:text-white text-xs"
                  >✏️</button>
                  <button
                    @click="deleteFile(child)"
                    class="text-gray-400 hover:text-red-400 text-xs"
                  >🗑️</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="group flex items-center">
          <button
            @click="selectFile(item.path)"
            class="flex items-center w-full px-3 py-1 hover:bg-gray-700 text-left text-sm text-gray-300"
            :class="{ 'text-blue-400': store.activeFilePath === item.path }"
          >
            <span class="mr-2 text-gray-500 text-xs">{{ item.language }}</span>
            <span>{{ item.name }}</span>
          </button>
          <div class="ml-auto pr-2 opacity-0 group-hover:opacity-100 flex gap-1">
            <button
              @click="startRename(item)"
              class="text-gray-400 hover:text-white text-xs"
            >✏️</button>
            <button
              @click="deleteFile(item)"
              class="text-gray-400 hover:text-red-400 text-xs"
            >🗑️</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
