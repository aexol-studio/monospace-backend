import { mc } from "../db";
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
    // mc - mongo connection?
    const mongo = await mc();
    await mongo.db.dropDatabase();

    const posts: Array<PostModel> = [
        {
            createdAt: new Date().toDateString(),
            username: USERNAME,
            content: 'post-content-only-for-test',
        },
        {
            createdAt: new Date().toDateString(),
            username: 'different.user@email.com',
            content: 'should-not-be-returned',
        }
    ];

    await mongo.db.collection<PostModel>('Post').insertMany(posts);

    const response = await wallResolver();

    expect(Array.of(response).length).toEqual(1);
    expect(response[0]?.username).toEqual(USERNAME);
    expect(response[0]?.content).toEqual('post-content-only-for-test');
});