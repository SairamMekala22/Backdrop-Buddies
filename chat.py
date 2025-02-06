from openai import OpenAI
import config
client = OpenAI(
  api_key=config.OPENAI_API_KEY
)
def chatbot(input):
    if input:
        messages = [{"role": "system", "content": "You are an AI specialized in Critical Thinking. Do not answer anything anything other than Critical Thinking related queries."},
                     {"role": "user", "content": input}
        ]
        chat = client.chat.completions.create(
            model= "gpt-4o-mini",
            store = True,
            messages=messages
        )
        reply = chat.choices[0].message.content
        return reply
     