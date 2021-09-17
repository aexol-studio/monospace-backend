import { mc } from "../db";
import { generatePhoneNumber, userMock } from "../Mock/Mock";
import { UserModel } from "../models/UserModel";
import { ResolverType, ValueTypes } from "../zeus";
import { handler } from "./login";

const loginResolver = async (args: ResolverType<ValueTypes['Mutation']['login']>) =>
    handler({
        arguments: args,
        info: {
            fieldName: 'mock',
        },
    }).then((response) => {
        return response;
    });

it('Returns status of successful login - existing user, simple phone number', async () => {
    const m = await mc();
    await m.db.dropDatabase();

    const user: UserModel = { ...userMock() };

    await m.db.collection<UserModel>('UserCol').insertOne(user);

    const response = await loginResolver({
        loginInput: {
            phoneNumber: user.phoneNumber,
            username: user.username,
        },
    });

    // case with simple phone number always should return "ok"
    expect(response).toEqual('ok')
});

it('Returns status of successful login - existing user, not simple phone number', async () => {
    const m = await mc();
    await m.db.dropDatabase();

    const PHONE_NUMBER = generatePhoneNumber();
    const user: UserModel = { ...userMock(), phoneNumber:PHONE_NUMBER};

    await m.db.collection<UserModel>('UserCol').insertOne(user);

    const response = await loginResolver({
        loginInput: {
            phoneNumber: user.phoneNumber,
            username: user.username,
        }
    });

    console.log(PHONE_NUMBER);
    // phone number cannot be spammed 
    // because twilio will send problem error
    // of too many requests sent
    // when number id real and sms has been sent
    // function returns 'ok' 
    expect(response).toEqual('ok');  
});

it('Returns status of successful login - not existing user, not simple phone number', async () => {
    const m = await mc();
    await m.db.dropDatabase();

    // user is not in db
    const PHONE_NUMBER = generatePhoneNumber();
    const user: UserModel = { ...userMock(), phoneNumber: PHONE_NUMBER};

    //await m.db.collection<UserModel>('UserCol').insertOne(user);

    const response = await loginResolver({
        loginInput: {
            phoneNumber: user.phoneNumber,
            username: user.username,
        },
    });

    expect(response).toEqual('ok');
});




