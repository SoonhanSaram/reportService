import OpenAI from 'openai';

const gptKey = process.env.GPT_API_KEY;
// openai payment 등록 후 사용가능
// gpt api 사용 함수 정의
export const callGPT = async (workingTitle, contents) => {

    const message = [
        {
            role: 'user', content: `
            You are an expert in writing reports. I'll show you the daily report,
            Please give supplementary explanations by dividing the work name, work plan, suggestions, and special matters
            Please separate each part through '/'
            업무명 : ${workingTitle} 보고서 내용 : ${JSON.stringify(contents)}`
        }
    ]

    const openai = new OpenAI({
        apiKey: gptKey
    });

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            message: message,
        });

        return response.data.choices[0].message;
    } catch (error) {
        console.log('Error Calling ChatGPT API : ', error);
        return null
    }
}