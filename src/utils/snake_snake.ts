import { NamingStrategyInterface, DefaultNamingStrategy } from 'typeorm';
import { camelToSnakeCase } from './utils';

export class SnakeNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  columnName(propertyName: string, customName: string | undefined): string {
    return camelToSnakeCase(customName ? customName : propertyName);
  }

  tableName(targetName: string, userSpecifiedName: string | undefined): string {
    return camelToSnakeCase(userSpecifiedName ? userSpecifiedName : targetName);
  }

  joinColumnName(propertyName: string): string {
    return camelToSnakeCase(propertyName) + '_id';
  }

  joinTableName(firstTableName: string, secondTableName: string): string {
    return (
      camelToSnakeCase(firstTableName) + '_' + camelToSnakeCase(secondTableName)
    );
  }

  relationName(propertyName: string): string {
    return camelToSnakeCase(propertyName);
  }
}
