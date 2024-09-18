import { UseInterceptors } from '@nestjs/common';
import { SerializeConstructor } from 'src/@types/serialize-constructor';
import { SerializerInterceptor } from 'src/interceptors/serialize.interceptor';

export function Serialize(dto: SerializeConstructor) {
  return UseInterceptors(new SerializerInterceptor(dto));
}
