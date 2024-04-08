# pip install -U langchain langchain-community langchain-openai
from langchain_community.chat_models import ChatOllama
from langchain.chains import create_sql_query_chain
from langchain_community.utilities import SQLDatabase
from urllib.parse import quote_plus
# Encode the password to ensure special characters are properly handled
password = quote_plus("vinsin@_132linux")

# Construct the URI with the encoded password
db_uri = f"mysql://root:{password}@localhost:3306/smartphones?charset=utf8mb4"

# Create the SQLDatabase instance using the URI
db = SQLDatabase.from_uri(db_uri)
llm = ChatOllama(model="starcoder2:3b")
chain = create_sql_query_chain(llm, db)
response = chain.invoke({"question": " show me 20 smartphones in 10k to 20k range with all numerical attribute sorted in desc in phonedetails table"})
print(response)