import ChatGptApi from 'ts-chatgpt-api/src/chat-gpt-api';

export default async function getRecipes(req: string): Promise<any> {
  const chatGptApi = new ChatGptApi(process.env.REACT_APP_API_KEY || '');
  chatGptApi.enableDebugging();
  const response = await chatGptApi.getAnswer(req);
  console.log('resp', JSON.stringify(response, null, 4));
  return response;
}
