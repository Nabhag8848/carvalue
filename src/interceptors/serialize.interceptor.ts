import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map } from 'rxjs';

export class SerializerInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(_context: ExecutionContext, handler: CallHandler) {
    //run something before a request is been handled by request handler

    return handler.handle().pipe(
      map((data: any) => {
        // run something before the response is sent out
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
