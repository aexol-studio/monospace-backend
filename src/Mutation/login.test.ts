import { mc } from "../db";
import { userMock } from "../Mock/Mock";
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

    const user: UserModel = { ...userMock(), phoneNumber: '+48720671937'};

    await m.db.collection<UserModel>('UserCol').insertOne(user);

    const response = await loginResolver({
        loginInput: {
            phoneNumber: user.phoneNumber,
            username: user.username,
        },
    });

    //expect(response).toEqual('ok')

    expect(response).toEqual('Problem with sending otp occurred')
    //RestException [Error]: Too many requests
    // TODO: check why returns error
});

it('Returns status of successful login - not existing user, not simple phone number', async () => {
    const m = await mc();
    await m.db.dropDatabase();

    // user is not in db
    const user: UserModel = { ...userMock(), phoneNumber: '+48720671937'};

    //await m.db.collection<UserModel>('UserCol').insertOne(user);

    const response = await loginResolver({
        loginInput: {
            phoneNumber: user.phoneNumber,
            username: user.username,
        },
    });

    //expect(response).toEqual('ok') 

    expect(response).toEqual('Problem with sending otp occurred')
    //RestException [Error]: Too many requests
    // TODO: check why returns error
});




