import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

export const ApiTagsInteractions = () => ApiTags('interactions');

export const ApiTrackInteraction = () =>
  ApiOperation({
    summary: 'Track user interaction with content',
    description:
      'Records a user interaction with content for analysis and recommendations',
  });

export const ApiTrackInteractionResponse = () =>
  ApiResponse({
    status: 201,
    description: 'Interaction tracked successfully',
  });

export const ApiGetUserInteractionHistory = () =>
  ApiOperation({
    summary: 'Get user interaction history',
    description:
      'Retrieves the interaction history for a specific user with optional filtering',
  });

export const ApiGetUserInteractionHistoryResponse = () =>
  ApiResponse({
    status: 200,
    description: 'User interaction history retrieved successfully',
  });

export const ApiGetUserInteractionHistoryParam = () =>
  ApiParam({
    name: 'userId',
    description: 'User ID',
    example: 1,
  });

export const ApiGetUserInteractionHistoryQuery = () =>
  ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of results to return',
    example: 50,
  });

export const ApiAnalyzeInteractionPatterns = () =>
  ApiOperation({
    summary: 'Analyze user interaction patterns',
    description:
      'Analyzes interaction patterns to identify user preferences and behaviors',
  });

export const ApiAnalyzeInteractionPatternsResponse = () =>
  ApiResponse({
    status: 200,
    description: 'Interaction patterns analyzed successfully',
  });

export const ApiAnalyzeInteractionPatternsParam = () =>
  ApiParam({
    name: 'userId',
    description: 'User ID',
    example: 1,
  });

export const ApiExportInteractionData = () =>
  ApiOperation({
    summary: 'Export user interaction data',
    description:
      'Exports user interaction data in the specified format for analysis',
  });

export const ApiExportInteractionDataResponse = () =>
  ApiResponse({
    status: 200,
    description: 'Interaction data exported successfully',
  });

export const ApiExportInteractionDataParam = () =>
  ApiParam({
    name: 'userId',
    description: 'User ID',
    example: 1,
  });

export const ApiExportInteractionDataQuery = () =>
  ApiQuery({
    name: 'format',
    required: true,
    description: 'Export format',
    example: 'json',
  });
