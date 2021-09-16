import { ResolverType, ValueTypes } from "../zeus";
import { handler } from "./validate";

const validateResolver = async (args: ResolverType<ValueTypes['Mutation']['validate']>) =>
    handler({
        arguments: args,
        info: { 
            fieldName: 'mock'
        },
    }).then((response) => {
        return response;
    });

it('Returns validated token', async () => {
    const response = await validateResolver({
        otpInput: {
            code: '1111',
            phoneNumber: '+48123456789'
        },
    });
    console.log(response);
    expect(response).not.toBeNull();
    expect(response.length > 0).toBeTruthy();
})