import { ModelTypes } from '../zeus';

export type UserModel = ModelTypes['User'] & { phoneNumber: string };
