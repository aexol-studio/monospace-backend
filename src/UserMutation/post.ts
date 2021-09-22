import { FieldResolveInput } from 'stucco-js';
import { mc } from '../db';
import { PostModel } from '../models/PostModel';
import { UserModel } from '../models/UserModel';
import { resolverFor } from '../zeus';


export const handler = async (input: FieldResolveInput) =>
  resolverFor('UserMutation', 'post', async (args, source: UserModel) => {
    /**
     * Args should contain only post content or
     * post content and files url?
     * 
     * Then if only post content i want to send
     * files url via source user so i have to
     * create new field uploadedFiles which are
     * send to source when user uploades them via 
     * uploadFiles handler
     */

    /**
     * !!! Update do poprzedniego commita !!!
     * 
     * Teraz url'e do plikow dodawane sa do bazy
     * z sourca, pliki ktore uploadowal user
     * Chyba moze pojawic sie taki blad, ze wgrane pliki nie sa nullowane
     * wiec do posta beda dodawac sie te z poprzednich postwo.
     * Ogolnie po testowaniu tego do nbazy dodaje ssie tylko nowy plik/pliki
     * a nie wszystkie bo w uploadzie updatuje tego usera, wiec w sumie nie 
     * powinno byc bledow 
     */

    const { db } = await mc();
    const id = await db.collection<PostModel>('Post').insertOne({
      createdAt: new Date().toISOString(),
      username: source.username,
      content: {
        content: args.postCreate.content,
        /**
         * Files to new post should be inserted from source
         * atfter user uploads them to s3
         */
        files: source.uploadFiles
      },
    });
    return id.insertedId.toHexString();
  
})(input.arguments, input.source);
