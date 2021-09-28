import { mc } from "../db";
import { userMock } from "../Mock/Mock";
import { UserModel } from "../models/UserModel";
import { ResolverType, ValueTypes } from "../zeus";
import { handler } from "./uploadFiles";

const srcUser = userMock();
const uploadFilesResolver = async (args: ResolverType<ValueTypes['UserMutation']['uploadFiles']>) =>
    handler({
        arguments: args,
        info: {
            fieldName: 'mock',
        },
        source: srcUser,
    }).then((response) => {
        return response;
    });

it('Returns getUrl and putUrl array', async () => {
    const { db } = await mc();
    await db.dropDatabase();
    await db.collection<UserModel>("UserCol").insertOne(srcUser);

    const response = await uploadFilesResolver({
        files: [
            { name: "textfile.txt", type: "text" },
            { name: "2ndtestfile.txt", type: "text" },
            { name: "testimage", type: "image" },
        ],
    });

    expect(response.length).toEqual(3);
    
    const USERNAME = 'user@aexol.com';
    const user = await db.collection<UserModel>("UserCol").findOne({username: USERNAME});
    
    expect(user?.uploadedFiles!.length === 3).toBeTruthy();
});