from flask import Flask, jsonify, request
from langchain_community.chat_models import ChatOllama
from langchain.chains import create_sql_query_chain
from langchain_community.utilities import SQLDatabase
from urllib.parse import quote_plus
from langchain_core.prompts import FewShotPromptTemplate, PromptTemplate

app = Flask(__name__)
DB_HOST = "localhost"
DB_USER = "root"
DB_PASSWORD = "vinsin@_132linux"
DB_NAME = "smartphones"
DB_PORT = 3306
password = quote_plus(DB_PASSWORD)
db_uri = f"mysql://{DB_USER}:{password}@{DB_HOST}:{DB_PORT}/{DB_NAME}?charset=utf8mb4"
db = SQLDatabase.from_uri(db_uri)
llm = ChatOllama(model="mistral")

example_prompt = PromptTemplate.from_template("User input: {input}\nSQL query: {query}")
examples = [
    {"input": "Show phones under 15k.", "query" : "SELECT phonedetails.*, soc.* FROM phonedetails JOIN soc ON phonedetails.pid = soc.sid WHERE phonedetails.price <= 15000 LIMIT 10;"},
    {"input": "Find phones with 5000mAh+ battery.", "query" : "SELECT phonedetails.*, soc.* FROM phonedetails JOIN soc ON phonedetails.pid = soc.sid WHERE phonedetails.battery >= 5000 LIMIT 10;"},
    {"input": "Recommend phones with great cameras.","query": " SELECT phonedetails.*, soc.* FROM phonedetails JOIN soc ON phonedetails.pid = soc.sid ORDER BY phonedetails.RearCamera, phonedetails.FrontCamera desc LIMIT 10;"},
    {"input": "show me smartphones with great performance and great storage in 30-50k range","query": " SELECT phonedetails.*, soc.* FROM phonedetails JOIN soc ON phonedetails.pid = soc.sid WHERE price BETWEEN 30000 AND 50000 ORDER BY perfscore DESC, ROM DESC LIMIT 10;"},
    {"input": "phones great for gaming and has good cameras ","query": "SELECT phonedetails.*, soc.* FROM phonedetails JOIN soc ON phonedetails.pid = soc.sid ORDER BY perfscore DESC, RAM DESC, ROM DESC, FrontCamera DESC, RearCamera DESC LIMIT 10;"},
    {"input": "Looking for phones with large storage.","query": "SELECT phonedetails.*, soc.* FROM phonedetails JOIN soc ON phonedetails.pid = soc.sid ORDER BY phonedetails.ROM DESC LIMIT 10;"},
]
context = db.get_context()
table_info = context["table_info"]

top_k = 10
  
prompt = FewShotPromptTemplate(
    examples=examples[:15],  
    example_prompt=example_prompt,
    prefix="""You are a MySQL expert. Given an input question, create a 
    syntactically correct MySQL query to run, Only answer with SQL query and nothing else do not explain or comment the sql query. if asked for good or great of that attribute simply sort is in descending order. Unless otherwise specified, 
    do not return more than {top_k} rows. ALways write query by selecting all attributes of phonedetails and soc table \n\nHere is the relevant table info: 
    {table_info}\n\nBelow are a number of examples of questions and their corresponding SQL queries.""",
    suffix="User input: {input}\nSQL query: ",
    input_variables=["input", top_k, table_info],
)
chain = create_sql_query_chain(llm, db,prompt)
@app.route('/api/query', methods=['POST'])
def process_query():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided in the request"}), 400
    elif 'question' not in data:
        return jsonify({"error": "Missing 'question' field in the request"}), 422
    query = data['question']
    if not query:
        return jsonify({"error": "Empty 'question' field"}), 422
    response = chain.invoke({"question": query});
    print(response);
    return jsonify(response)
if __name__ == '__main__':
    app.run(debug=True)
