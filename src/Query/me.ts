import { FieldResolveInput } from 'stucco-js';
import { getUserFromHandlerInputOrThrow } from '../UserMiddleware';
import { resolverFor } from '../zeus';

export const handler = async (input: FieldResolveInput) =>
  resolverFor('Query', 'me', async (args) => {
    return getUserFromHandlerInputOrThrow(input);
  })(input.arguments);
