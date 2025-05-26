import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ContentEntity } from '../model/content.entity';
import { ContentType } from '../enum/content.enum';

export const GetContentDoc = () => {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    ApiOperation({
      summary: 'Get content by mood and type',
      description:
        'Retrieves a list of content items based on the specified mood and content type',
    })(target, propertyKey, descriptor);

    ApiQuery({
      name: 'mood',
      description: 'The mood to search content for',
      example: 'sad',
      required: true,
    })(target, propertyKey, descriptor);

    ApiQuery({
      name: 'type',
      description: 'The type of content to retrieve',
      enum: ContentType,
      example: ContentType.MOVIE,
      required: true,
    })(target, propertyKey, descriptor);

    ApiResponse({
      status: 200,
      description: 'Returns a list of content matching the mood and type',
      type: [ContentEntity],
    })(target, propertyKey, descriptor);

    ApiResponse({
      status: 400,
      description: 'Bad Request - Invalid query parameters',
    })(target, propertyKey, descriptor);

    return descriptor;
  };
};
