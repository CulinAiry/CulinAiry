import { Conversation, Message } from 'gpt-turbo';

export default async function getRecipes(question: string, callback: (response: string) => void): Promise<any> {
    const conversation = new Conversation({
        apiKey: process.env.REACT_APP_GPT_API_KEY || '',
        stream: true,
    });

    const response = (await conversation.prompt(question)) as Message;

    callback(response.content);

    const unsubscribe = response.onMessageUpdate((content) => {
        // console.log(content)
        callback(content);
    });

    response.onMessageStreamingStop(() => {
        unsubscribe();
    });

    return response;
}
