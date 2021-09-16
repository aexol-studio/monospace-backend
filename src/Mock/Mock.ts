import { UserModel } from "../models/UserModel";
// TODO: finish writing tests
const USERNAME = 'user@aexol.com';
const PHONE_NUMBER = '+48123456789';

export const postMock = () => ({
    createdAt: new Date().toISOString(),
    username: USERNAME,
    content: 'empty-content',
});

export const userMock = () => ({
    createdAt: new Date().toISOString(),
    phoneNumber: PHONE_NUMBER,
    username: USERNAME,
    wall: [
        {
            createdAt: new Date().toDateString(),
            content: 'username-wall-content-array',
        },
    ],
});