import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TokenDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.token)
      throw new Error(
        'Token not found in request. Ensure AuthGuard is applied.',
      );
    return request.token;
  },
);
