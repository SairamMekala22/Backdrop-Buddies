import openai 
import config
openai.api_key = config. OPENAI_API_KEY
def chatbot(input):
    if input:
        messages = [{"role": "system", "content": "You are an AI specialized in Critical Thinking. Do not answer anything Do not answer anything other than Critical Thinking related queries."},
                     {"role": "user", "content": input}
        ]
        chat = openai.ChatCompletion.create(
            mode1= "gpt-3.5-turbo", messages=messages
        )
        reply = chat.choices[0].message.content
        return reply