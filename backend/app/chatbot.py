from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# Load the model and tokenizer once
tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-medium")
model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-medium")

# Save chat history per user
user_history = {}

def get_bot_response(user_id, user_input):
    if user_id not in user_history:
        user_history[user_id] = None

    # Tokenize user input and add chat history
    new_input_ids = tokenizer.encode(user_input + tokenizer.eos_token, return_tensors='pt')
    bot_input_ids = torch.cat([user_history[user_id], new_input_ids], dim=-1) if user_history[user_id] is not None else new_input_ids

    # Generate a response
    chat_history_ids = model.generate(
        bot_input_ids,
        max_length=1000,
        pad_token_id=tokenizer.eos_token_id
    )

    user_history[user_id] = chat_history_ids  # Save new history

    # Decode and return response
    response = tokenizer.decode(chat_history_ids[:, bot_input_ids.shape[-1]:][0], skip_special_tokens=True)
    return response
