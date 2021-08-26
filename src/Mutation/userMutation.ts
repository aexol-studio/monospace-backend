import { FieldResolveInput } from 'stucco-js';
import { getUserFromHandlerInputOrThrow } from '../UserMiddleware';
import { resolverFor } from '../zeus';

export const handler = async (input: FieldResolveInput) =>
  resolverFor('Mutation', 'userMutation', async (args) => {
    return getUserFromHandlerInputOrThrow(input) as any;
  })(input.arguments);
