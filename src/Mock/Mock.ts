import { PostModel } from "../models/PostModel";
import { UserModel } from "../models/UserModel";

const USERNAME = 'user@aexol.com';
const PHONE_NUMBER = '+48123456789';

export const postMock = () => ({
    createdAt: new Date().toISOString(),
    username: USERNAME,
    content: {
        content: 'empty-content',
        files: [],
    },
});

export const userMock = () => ({
    createdAt: new Date().toISOString(),
    phoneNumber: PHONE_NUMBER,
    username: USERNAME,
    wall: [
        {
            createdAt: new Date().toISOString(),
            content: {
                content: 'username-wall-content-array',
                files: [],
            },
        },
    ],
});

export function generatePhoneNumber(): string {
    const randomNumber = (max: number, min: number) => {
        const number = Math.floor(Math.random() * (max - min + 1)) + min;
        return number.toString();
    };

    var phoneNumber: string[] = new Array(9);
    for(var i = 0; i < phoneNumber.length; i++) {
        phoneNumber[i] = randomNumber(9, 0);  
    };

    if (phoneNumber[0] === '0') {
        phoneNumber[0] = randomNumber(9, 1);
    }

    var phoneNumberStr = phoneNumber.toString();
    for (var i = 0; i < phoneNumber.length; i++) {
        phoneNumberStr = phoneNumberStr.replace(',', '');
    }
    return '+48' + phoneNumberStr;
}