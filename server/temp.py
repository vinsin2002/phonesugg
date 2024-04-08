from huggingface_hub import login
from transformers import AutoTokenizer, AutoModelForCausalLM

login("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")

tokenizer = AutoTokenizer.from_pretrained("google/gemma-2b-it")
model = AutoModelForCausalLM.from_pretrained("google/gemma-2b-it")

input_text = "Write me a poem about Machine Learning."
input_ids = tokenizer(input_text, return_tensors="tf")

outputs = model.generate(input_ids)
print(tokenizer.decode(outputs[0]))
