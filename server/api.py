from flask import Flask, jsonify, request
from langchain_community.chat_models import ChatOllama
from langchain.chains import create_sql_query_chain
from langchain_community.utilities import SQLDatabase
from urllib.parse import quote_plus
from langchain_core.prompts import PromptTemplate
app = Flask(__name__)
DB_HOST = "localhost"
DB_USER = "root"
DB_PASSWORD = "vinsin@_132linux"
DB_NAME = "smartphones"
DB_PORT = 3306
password = quote_plus(DB_PASSWORD)
db_uri = f"mysql://{DB_USER}:{password}@{DB_HOST}:{DB_PORT}/{DB_NAME}?charset=utf8mb4"
db = SQLDatabase.from_uri(db_uri)
llm = ChatOllama(model="starcoder2:3b")
template = '''
only answer with sql syntax and nothing more give sql query in string format and nothing else.
-- Whenever asked a question, always respond with SQL syntax and nothing else.
-- Always select * or select all attributes from phonedetails table whenever any question is asked to you.
-- Then understand the question and write the WHERE clause and ORDER BY clause for necessary query.

-- Storage is associated with ROM. Higher the ROM value, higher the storage of the smartphones.
-- If not specified with the number of smartphones or phones, limit your SQL query to 10.
Always select * from phonedetails and write the conditions as requested in question
SELECT * -- Select all attributes
FROM phonedetails -- From the phonedetails table
WHERE -- Where clause (to be filled based on the question)
ORDER BY -- Order by clause (to be filled based on the question)
LIMIT 10; -- Limiting the query to 10 rows if not specified otherwise

always limit your sql syntax to 10 if number of smartphones or rows are not specified in question

'''
prompt = PromptTemplate.from_template(template)
chain = create_sql_query_chain(llm, db)
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
