import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export class SerializerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    //run something before a request is been handled by request handler

    console.log(context);

    return handler.handle().pipe(
      map((data: any) => {
        // run something before the response is sent out
        console.log(data);
      }),
    );
  }
}
