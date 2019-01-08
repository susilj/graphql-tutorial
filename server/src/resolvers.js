import { setTimeout } from "timers";
import { PubSub, withFilter } from 'graphql-subscriptions';
import faker from 'faker';
// const channels = [{
//     id: '1',
//     name: 'soccer',
//     messages: [{
//         id: '1',
//         text: 'soccer is football',
//     }, {
//         id: '2',
//         text: 'hello soccer world cup',
//     }]
// }, {
//     id: '2',
//     name: 'baseball',
//     messages: [{
//         id: '3',
//         text: 'baseball is life',
//     }, {
//         id: '4',
//         text: 'hello baseball world series',
//     }]
// }];

const channels = [];
let lastChannelId = 0;
let lastMessageId = 0;
let messageCreatedAt = 123456789;

function addChannel(name) {
    lastChannelId++;
    const newChannel = {
        id: String(lastChannelId),
        name: name,
        messages: [],
    };
    channels.push(newChannel);
    return lastChannelId;
}

function getChannel(id) {
    return channels.find(channel => channel.id === id);
}

function addFakeMessage(channel, messageText) {
    lastMessageId++;
    messageCreatedAt++;
    const newMessage = {
        id: lastMessageId,
        createdAt: messageCreatedAt,
        text: messageText,
    };
    channel.messages.push(newMessage);
}

// use faker to generate random messages in faker channel
addChannel('faker');
const fakerChannel = channels.find(channel => channel.name === 'faker');

// Add seed for consistent random data
faker.seed(9);
for (let i = 0; i < 50; i++) {
    addFakeMessage(fakerChannel, faker.random.words());
}

// generate second channel for initial channel list view
addChannel('channel2');

// let nextId = 3;
// let nextMessageId = 5;

const pubsub = new PubSub();

export const resolvers = {
    Query: {
        channels: () => {
            return channels;
        },
        channel: (root, { id }) => {
            //return channels.find(channel => channel.id === id);
            return getChannel(id);
        },
    },
    // The new resolvers are under the Channel type
    Channel: {
        messageFeed: (channel, { cursor }) => {
            // The cursor passed in by the client will be an
            // integer timestamp. If no cursor is passed in,
            // set the cursor equal to the time at which the
            // last message in the channel was created.
            if (!cursor) {
                cursor = channel.messages[channel.messages.length - 1].createdAt;
            }

            cursor = parseInt(cursor);
            // limit is the number of messages we will return.
            // We could pass it in as an argument but in this
            // case let's use a static value.
            const limit = 10;

            const newestMessageIndex = channel.messages.findIndex(
                message => message.createdAt === cursor
            ); // find index of message created at time held in cursor
            // We need to return a new cursor to the client so that it
            // can find the next page. Let's set newCursor to the
            // createdAt time of the last message in this messageFeed:
            const newCursor = channel.messages[newestMessageIndex - limit].createdAt;

            const messageFeed = {
                messages: channel.messages.slice(
                    newestMessageIndex - limit,
                    newestMessageIndex
                ),
                cursor: newCursor,
            };

            return messageFeed;
        },
    },
    Mutation: {
        addChannel: (root, args) => {
            // setTimeout(function() {
            for (let i = 0; i < 10000; i++) {
                for (let j = 0; j < 20000; j++) {
                    let s = i + j;
                }
            }

            // const newChannel = { id: nextId++, messages: [], name: args.name };
            // const newChannel = { id: String(nextId++), messages: [], name: args.name };
            // channels.push(newChannel);
            // return newChannel;

            const name = args.name;
            const id = addChannel(name);
            return getChannel(id);
            // }, 500);
        },
        addMessage: (root, { message }) => {
            const channel = channels.find(channel => channel.id === message.channelId);
            if (!channel)
                throw new Error("Channel does not exist");

            const newMessage = {
                // id: String(nextMessageId++),
                id: String(lastMessageId++),
                text: message.text,
                createdAt: +new Date()
            };
            channel.messages.push(newMessage);

            pubsub.publish('messageAdded', { messageAdded: newMessage, channelId: message.channelId });

            return newMessage;
        },
    },
    Subscription: {
        messageAdded: {
            subscribe: withFilter(
                () => pubsub.asyncIterator('messageAdded'),
                (payload, variables) => {
                    return payload.channelId === variables.channelId;
                }
            )
        }
    }
};