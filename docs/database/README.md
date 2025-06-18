# Database Documentation

## Overview

This document provides an overview of the MoodNiko database schema, including all tables, relationships, and key design decisions.

## Database Schema

### Tables

1. **[contents](contents-schema.md)** - Core content items (books, articles, etc.)
2. **[saved_contents](saved-contents-schema.md)** - User-saved content with mood context
3. **[moods](moods-schema.md)** - Mood definitions and categories

### Relationships

```
contents (1) ←→ (N) saved_contents
moods (1) ←→ (N) contents (via moodtag)
```

## Design Principles

### Naming Conventions

- **Tables**: snake_case (e.g., `saved_contents`)
- **Columns**: snake_case (e.g., `content_id`, `created_at`)
- **Indexes**: Descriptive names with table prefix (e.g., `IDX_SAVED_CONTENTS_UNIQUE`)
- **Foreign Keys**: Descriptive constraint names (e.g., `FK_saved_contents_content`)

### Data Types

- **IDs**: `SERIAL` (auto-incrementing integers)
- **Timestamps**: `TIMESTAMP DEFAULT now()`
- **Text**: `VARCHAR(n)` with appropriate length limits
- **Booleans**: `BOOLEAN` for true/false values

### Constraints

- **Primary Keys**: All tables have auto-incrementing primary keys
- **Foreign Keys**: Proper referential integrity with CASCADE options
- **Unique Constraints**: Where business logic requires uniqueness
- **NOT NULL**: Required fields are marked as NOT NULL
- **Length Limits**: Text fields have appropriate character limits

### Indexes

- **Primary Key Indexes**: Automatically created
- **Foreign Key Indexes**: For performance on joins
- **Unique Indexes**: For constraint enforcement
- **Query Optimization Indexes**: For common filtering and sorting

## Migration Strategy

### File Naming

Migrations follow the pattern: `{timestamp}-{Description}.ts`

### Migration Best Practices

1. **Up/Down Support**: All migrations support both up and down operations
2. **Data Safety**: Down migrations should restore the previous state
3. **Constraint Handling**: Proper order of operations (drop constraints before dropping tables)
4. **Index Management**: Create indexes after table creation for performance

### Migration Files

- `1746287996349-createContentsTable.ts` - Creates the contents table
- `1748282692044-AddUniqueExternalIdConstraint.ts` - Adds unique constraint to external_id
- `1748282692045-CreateSavedContentsTable.ts` - Creates the saved_contents table

## Performance Considerations

### Index Strategy

- **Foreign Key Indexes**: Improve join performance
- **Composite Indexes**: Support complex queries efficiently
- **Unique Indexes**: Fast duplicate checking
- **Sorting Indexes**: Optimize ORDER BY operations

### Query Optimization

- **Eager Loading**: Use relations to load related data efficiently
- **Pagination**: Implement LIMIT/OFFSET for large result sets
- **Selective Loading**: Only load required columns when possible

## Data Integrity

### Referential Integrity

- Foreign key constraints ensure data consistency
- CASCADE options handle related data appropriately
- Unique constraints prevent duplicate data

### Validation

- Application-level validation for business rules
- Database-level constraints for data integrity
- Length limits and data type constraints

## Backup and Recovery

### Backup Strategy

- Regular database backups
- Migration-based schema versioning
- Data export capabilities

### Recovery Procedures

- Migration rollback capabilities
- Data restoration procedures
- Schema recovery processes

## Monitoring and Maintenance

### Performance Monitoring

- Query performance analysis
- Index usage monitoring
- Database size monitoring

### Maintenance Tasks

- Regular index maintenance
- Statistics updates
- Cleanup of orphaned data

## Security Considerations

### Data Protection

- Sensitive data encryption (if applicable)
- Access control and permissions
- Audit logging for data changes

### SQL Injection Prevention

- Parameterized queries
- Input validation and sanitization
- ORM usage for query building

## Development Guidelines

### Adding New Tables

1. Create migration file with timestamp
2. Define table schema with proper constraints
3. Add appropriate indexes
4. Update documentation
5. Test migration up and down

### Modifying Existing Tables

1. Create migration for schema changes
2. Consider data migration needs
3. Update related code and tests
4. Update documentation
5. Test thoroughly

### Best Practices

- Always use migrations for schema changes
- Test migrations on development data
- Document all schema changes
- Consider performance implications
- Maintain backward compatibility when possible
