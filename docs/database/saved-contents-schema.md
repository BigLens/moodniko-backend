# Saved Contents Database Schema

## Overview

This document describes the database schema for the `saved_contents` table, which supports the content saving functionality in MVP v0.3.

## Table: saved_contents

### Purpose

Stores user-saved content items with their associated mood context for future reference. Users can save the same content multiple times with different moods, but cannot save the same content with the same mood twice.

### Schema Definition

```sql
CREATE TABLE saved_contents (
    id SERIAL PRIMARY KEY,
    content_id INTEGER NOT NULL,
    mood VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    CONSTRAINT FK_saved_contents_content FOREIGN KEY (content_id)
        REFERENCES contents(id) ON DELETE CASCADE ON UPDATE CASCADE
);
```

### Columns

- **id**: Primary key, auto-incrementing integer (SERIAL)
- **content_id**: Foreign key reference to the contents table (snake_case)
- **mood**: The mood context when the content was saved (max 50 characters)
- **created_at**: Timestamp when the content was saved (snake_case)

### Relationships

- **Many-to-One** with `contents` table via `content_id` foreign key
- **Cascade delete**: When a content is deleted, all saved references are automatically removed
- **Cascade update**: When a content ID is updated, saved references are updated accordingly

### Indexes

1. **IDX_SAVED_CONTENTS_CONTENT_ID**: Index on `content_id` for efficient foreign key lookups
2. **IDX_SAVED_CONTENTS_MOOD**: Index on `mood` for filtering by mood
3. **IDX_SAVED_CONTENTS_CREATED_AT**: Index on `created_at` for sorting by date
4. **IDX_SAVED_CONTENTS_UNIQUE**: Unique composite index on `(content_id, mood)` to prevent duplicate saves

### Constraints

- **Primary Key**: `id` (auto-incrementing)
- **Foreign Key**: `content_id` references `contents(id)` with CASCADE
- **Unique Constraint**: `(content_id, mood)` combination must be unique
- **NOT NULL**: All columns are required
- **Length Constraint**: `mood` field limited to 50 characters

### Performance Considerations

- Indexes are optimized for common query patterns:
  - Finding saved content by content ID
  - Filtering saved content by mood
  - Sorting saved content by creation date (newest first)
  - Checking for duplicate saves (content_id + mood combination)
- Unique index ensures fast duplicate checking
- Foreign key index improves join performance

### Data Integrity

- Foreign key constraint ensures referential integrity
- NOT NULL constraints on required fields
- CASCADE delete maintains data consistency
- Unique constraint prevents duplicate saves
- Length validation on mood field

## Migration Details

- **Migration file**: `1748282692045-CreateSavedContentsTable.ts`
- **Location**: `src/database/migrations/`
- Supports both up and down migrations
- Handles existing data gracefully (no data migration needed for new table)
- Creates all necessary indexes and constraints

## Usage Examples

### SQL Queries

```sql
-- Get all saved content ordered by newest first
SELECT * FROM saved_contents ORDER BY created_at DESC;

-- Get saved content for a specific mood
SELECT * FROM saved_contents WHERE mood = 'happy';

-- Get saved content for a specific content item
SELECT * FROM saved_contents WHERE content_id = 123;

-- Check if content is already saved with specific mood
SELECT COUNT(*) FROM saved_contents WHERE content_id = 123 AND mood = 'happy';

-- Get saved content with content details (JOIN)
SELECT sc.*, c.title, c.description
FROM saved_contents sc
JOIN contents c ON sc.content_id = c.id
ORDER BY sc.created_at DESC;
```

### API Usage

```javascript
// Save content with mood
POST /contents/saved-contents
{
  "contentId": 1,
  "mood": "happy"
}

// Get all saved contents
GET /contents/saved-contents

// Delete saved content
DELETE /contents/saved-contents/1
```

## Business Rules

1. **Unique Saves**: Same content cannot be saved with the same mood twice
2. **Multiple Moods**: Same content can be saved with different moods
3. **Mood Length**: Mood must be 50 characters or less
4. **Content Existence**: Content must exist before it can be saved
5. **Cascade Deletion**: When content is deleted, all saved references are removed

## Error Handling

- **400 Bad Request**: Mood exceeds 50 characters
- **400 Bad Request**: Content already saved with this mood
- **404 Not Found**: Content does not exist
- **404 Not Found**: Saved content not found (for deletion)
