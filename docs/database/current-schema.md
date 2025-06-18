# Current Database Schema

## Overview

This document shows the current state of the database schema as implemented in the latest migrations.

## Tables

### contents

```sql
CREATE TABLE contents (
    id SERIAL PRIMARY KEY,
    external_id VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    image_url TEXT,
    type VARCHAR(50) NOT NULL,
    moodtag VARCHAR(50),
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    updated_at TIMESTAMP DEFAULT now() NOT NULL
);
```

**Indexes:**

- `IDX_CONTENTS_EXTERNAL_ID` (UNIQUE)
- `IDX_CONTENTS_TYPE`
- `IDX_CONTENTS_MOODTAG`
- `IDX_CONTENTS_CREATED_AT`

### saved_contents

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

**Indexes:**

- `IDX_SAVED_CONTENTS_CONTENT_ID`
- `IDX_SAVED_CONTENTS_MOOD`
- `IDX_SAVED_CONTENTS_CREATED_AT`
- `IDX_SAVED_CONTENTS_UNIQUE` (UNIQUE on content_id, mood)

## Relationships

- `saved_contents.content_id` → `contents.id` (Many-to-One)
- `contents.moodtag` → `moods.name` (planned for future)

## Data Types Summary

| Column Type    | Database Type | Description                |
| -------------- | ------------- | -------------------------- |
| ID fields      | SERIAL        | Auto-incrementing integers |
| Timestamps     | TIMESTAMP     | Date/time with timezone    |
| Short text     | VARCHAR(50)   | Limited length strings     |
| Medium text    | VARCHAR(255)  | Standard length strings    |
| Long text      | VARCHAR(500)  | Extended length strings    |
| Unlimited text | TEXT          | Variable length text       |
| URLs           | TEXT          | Image and external URLs    |

## Constraints Summary

| Table          | Constraint Type | Details                                              |
| -------------- | --------------- | ---------------------------------------------------- |
| contents       | PRIMARY KEY     | id (SERIAL)                                          |
| contents       | UNIQUE          | external_id                                          |
| contents       | NOT NULL        | id, external_id, title, type, created_at, updated_at |
| saved_contents | PRIMARY KEY     | id (SERIAL)                                          |
| saved_contents | FOREIGN KEY     | content_id → contents(id) CASCADE                    |
| saved_contents | UNIQUE          | (content_id, mood)                                   |
| saved_contents | NOT NULL        | id, content_id, mood, created_at                     |

## Migration History

1. `1746287996349-createContentsTable.ts` - Initial contents table
2. `1748282692044-AddUniqueExternalIdConstraint.ts` - Added unique constraint
3. `1748282692045-CreateSavedContentsTable.ts` - Added saved_contents table

## Current Status

- ✅ **contents table**: Fully implemented with all indexes and constraints
- ✅ **saved_contents table**: Fully implemented with foreign key and unique constraints
- 🔄 **moods table**: Planned for future implementation
- 🔄 **users table**: Planned for v0.4 (authentication)

## Next Steps

1. **v0.3**: Complete content management features
2. **v0.4**: Add authentication and user management
3. **v0.5**: Implement moods table and mood-based content filtering
