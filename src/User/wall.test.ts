import { mc } from "../db";
import { postMock } from "../Mock/Mock";
import { PostModel } from "../models/PostModel";
import { ResolverType, ValueTypes } from "../zeus";
import { handler } from "./wall";

const USERNAME = 'user@aexol.com'
const wallResolver = async (/*args: ResolverType<ValueTypes['User']['wall']>*/) =>
    handler({
        arguments: {},
        source: {
            username: USERNAME,
        },
        info: {
            fieldName: 'mock',
        },
    }).then((response) => {
        return response;
    });

it('Returns list of posts written by user with specified username', async () =>{
    const mongo = await mc();
    await mongo.db.dropDatabase();

    const posts: Array<PostModel> = [
        {
            ...postMock(),
            content: {
                content:'post-content-only-for-test'
            },
        },
        {
            ...postMock(),
            content: {
                content: 'should-not-be-returned'
            },
            username: 'different.user@email.com',
        }
    ];

    await mongo.db.collection<PostModel>('Post').insertMany(posts);

    const response = await wallResolver();

    expect(Array.of(response).length).toEqual(1);
    expect(response[0]?.username).toEqual(USERNAME);
    expect(response[0]?.content.content).toEqual('post-content-only-for-test');
});