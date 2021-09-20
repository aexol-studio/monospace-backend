import { ObjectId } from "bson";
import { mc } from "../db";
import { postMock } from "../Mock/Mock";
import { PostModel } from "../models/PostModel";
import { ResolverType, ValueTypes } from "../zeus";
import { handler } from "./post";

const USERNAME = 'user@aexol.com';
const postResolver = async (args: ResolverType<ValueTypes['UserMutation']['post']>) =>
    handler({
        arguments: args,
        source: {
            username: USERNAME,
        },
        info: {
            fieldName: 'mock',
        },
    }).then((response) => {
        return response;
    });

it('Returns ID of a specified post', async () => {
    const m = await mc();
    await m.db.dropDatabase();

    // return if of the new post
    const response = await postResolver({
        postCreate: {
            content: {
                content: 'post-content-only-for-test'
            },
        },
    });

    const post = await m.db.collection<PostModel>('Post').findOne({_id: new ObjectId(response)});
    // check if that post really exists
    expect(post).not.toBeNull();
    expect(post?.username).toEqual(USERNAME);
});