import { mc } from "../db";
import { userMock } from "../Mock/Mock";
import { UserModel } from "../models/UserModel";
import { ResolverType, ValueTypes } from "../zeus";
import { handler } from "./getUserByUsername";

const getUserByUsernameResolver = async (args: ResolverType<ValueTypes['Query']['getUserByUsername']>) =>
    handler({
        arguments: args,
        info: { fieldName: 'mock' },
    }).then((response) => {
        return response;
    });

it('Returns username based on username', async () =>{
    const m = await mc();
    await m.db.dropDatabase();

    const _createdAt = new Date('2017-01-01').toISOString();
    const user: UserModel = { 
        ...userMock(),
        createdAt: _createdAt,
    };

    await m.db.collection<UserModel>('UserCol').insertOne(user);

    const response = await getUserByUsernameResolver({
        userGet: {
            username: 'user@aexol.com',
        },
    });

    expect(response).not.toBeNull();
    expect(response?.createdAt).toEqual(_createdAt);
    expect(response?.phoneNumber).toEqual('+48123456789');
});