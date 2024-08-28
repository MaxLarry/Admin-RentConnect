import { Client, Account, Databases } from 'appwrite';

const client = new Client();

client
    .setEndpoint('http://cloud.appwrite.io/v1') // Your Appwrite endpoint
    .setProject('66bedfb0002c881e3b44');     // Your project ID

export const account = new Account(client);
export const database = new Databases(client);
export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.it.rentconnect',
    projectId: '66bedfb0002c881e3b44',
    databaseId: '66bee1c9002f2d920e38',
    userCollectionId: '66bee21b00355f8422e7',
    propertyCollectionId: '66c9c502002c1fce4f91',
    storageId: '66c01db800351409076a'
}   