import { Conversation, Message } from 'gpt-turbo';

export default async function getRecipes(question: string, callback: (response: [string, boolean]) => void): Promise<any> {
    const conversation = new Conversation({
        apiKey: process.env.REACT_APP_GPT_API_KEY || '',
        stream: true,
    });

    const response = (await conversation.prompt(question)) as Message;
    let message = '';

    callback([response.content, false]);

    response.onMessageUpdate((content) => {
        message = content;
        callback([content, false]);
    });

    response.onMessageStreamingStop(() => {
        callback([message, true]);
    });

    return response;
}
