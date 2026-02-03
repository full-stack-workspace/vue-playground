## ADDED Requirements

### Requirement: TODO Item Creation

The system SHALL provide the ability to create new TODO items with a title and optional description.

#### Scenario: Create TODO item with title only

- **WHEN** user enters a title and submits the create form
- **THEN** a new TODO item is created with the given title
- **AND** the item is marked as incomplete by default
- **AND** the item is added to the top of the list

#### Scenario: Create TODO item with title and description

- **WHEN** user enters a title, description, and submits the create form
- **THEN** a new TODO item is created with both title and description
- **AND** the item is marked as incomplete by default

### Requirement: TODO Item Display

The system SHALL display TODO items in a list format showing title, description, and completion status.

#### Scenario: Display incomplete TODO items

- **WHEN** user navigates to the TODO list demo
- **THEN** all incomplete TODO items are displayed
- **AND** each item shows a checkbox for completion toggle
- **AND** incomplete items have visual indication (e.g., unstrikethrough text)

#### Scenario: Display completed TODO items

- **WHEN** user completes a TODO item
- **THEN** the item's visual appearance changes (e.g., strikethrough, dimmed)
- **AND** the completion checkbox reflects the completed state

### Requirement: TODO Item Completion Toggle

The system SHALL allow users to toggle the completion status of TODO items.

#### Scenario: Mark TODO as complete

- **WHEN** user clicks the completion checkbox on an incomplete item
- **THEN** the item is marked as complete
- **AND** the UI updates to reflect the completed state
- **AND** an API request is sent to update the backend

#### Scenario: Mark TODO as incomplete

- **WHEN** user clicks the completion checkbox on a completed item
- **THEN** the item is marked as incomplete
- **AND** the UI updates to reflect the incomplete state
- **AND** an API request is sent to update the backend

### Requirement: TODO Item Editing

The system SHALL allow users to edit existing TODO items.

#### Scenario: Edit TODO item title

- **WHEN** user clicks edit on a TODO item
- **AND** changes the title and saves
- **THEN** the item's title is updated
- **AND** an API request is sent to persist the change

#### Scenario: Edit TODO item description

- **WHEN** user clicks edit on a TODO item
- **AND** changes the description and saves
- **THEN** the item's description is updated
- **AND** an API request is sent to persist the change

### Requirement: TODO Item Deletion

The system SHALL allow users to delete TODO items.

#### Scenario: Delete single TODO item

- **WHEN** user clicks delete on a TODO item
- **AND** confirms the deletion
- **THEN** the item is removed from the list
- **AND** an API request is sent to remove from backend

### Requirement: TODO List Filtering

The system SHALL provide filtering options to view TODO items by status.

#### Scenario: Filter by all items

- **WHEN** user selects "All" filter
- **THEN** both complete and incomplete items are displayed

#### Scenario: Filter by incomplete items

- **WHEN** user selects "Active" filter
- **THEN** only incomplete items are displayed

#### Scenario: Filter by completed items

- **WHEN** user selects "Completed" filter
- **THEN** only completed items are displayed

### Requirement: TODO List Search

The system SHALL provide search functionality to filter TODO items by text.

#### Scenario: Search by title

- **WHEN** user enters search text
- **THEN** items are filtered to show only those matching the search text in title

#### Scenario: Search by description

- **WHEN** user enters search text
- **THEN** items are filtered to show only those matching the search text in description

#### Scenario: Combined search and filter

- **WHEN** user enters search text and selects a filter
- **THEN** items are filtered by both search text and completion status

### Requirement: API Integration

The system SHALL integrate with a backend API for TODO data persistence.

#### Scenario: Fetch TODO list

- **WHEN** component mounts
- **THEN** TODO items are fetched from the backend API
- **AND** the list is displayed after successful fetch

#### Scenario: Handle API error

- **WHEN** an API request fails
- **THEN** an error message is displayed to the user
- **AND** the UI remains functional for retry

#### Scenario: Optimistic update

- **WHEN** user toggles completion or deletes an item
- **THEN** the UI updates immediately
- **AND** if the API request fails, the change is reverted
