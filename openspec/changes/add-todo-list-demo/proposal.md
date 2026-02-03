# Change: Add TODO List Demo Component

## Why

The vue-playground project needs a practical demo component that showcases Vue 3 patterns, TypeScript integration, and backend API integration. A TODO list is an ideal use case because it demonstrates CRUD operations, state management, filtering, and real-world application patterns that developers can learn from and extend.

## What Changes

- Add a new `TodoListDemo` component demonstrating Vue 3 Composition API patterns
- Implement TypeScript interfaces for TODO items with proper typing
- Create a backend API integration layer using fetch/axios
- Add TODO list UI with create, read, update, delete, and completion toggle functionality
- Implement filtering and search capabilities
- Style with Tailwind CSS following project conventions
- Add unit tests for core functionality

## Impact

- Affected specs: todo-list (new capability)
- Affected code: `src/components/TodoListDemo.vue`, `src/composables/useTodo.ts`, `src/types/todo.ts`, `src/api/todoApi.ts`
- Dependencies: No new external dependencies required
- Breaking changes: None
