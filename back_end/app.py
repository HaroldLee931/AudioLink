from flask import Flask, request, render_template, url_for
from flask_cors import CORS
import json
import jieba
# import jieba.posseg as pseg

app = Flask(__name__)
CORS(app, supports_credentials=True)
marker = 0
jieba.enable_paddle()
jieba.initialize()

###################################
#          NLP function           #
###################################
def getWordList(sentence:str):
  word_list = jieba.cut_for_search(sentence)
  for i in word_list:
    print(i)

###################################
#   route to different web page   #
###################################
@app.route("/")
def hello_world():
  return ("hello world")

@app.route("/index")
def visit_user_input_page():
  return render_template('index.html')

@app.route("/visualization")
def visit_visualization_page():
  return render_template('visualization.html')

# TODO: eggs page developing
@app.route("/eggs")
def visit_eggs_page():
  return ("on developing")

###################################
#     request data transfer       #
###################################
@app.route("/data_pipeline", methods=['POST'])
def saving_data():
  # TODO: Saving audio data
  # https://blog.csdn.net/zhangvalue/article/details/93884630
  # https://blog.csdn.net/longting_/article/details/80637002
  text = json.loads(request.data.decode('utf8').replace("'", '"'))
  app.logger.warning(text['usermsg'])  # same with <input name='usermsg'>
  return str("hhh")

@app.route("/get_data", methods=['GET'])
def pop_data():
  global marker
  while(True):
    marker += 1
    app.logger.warning("GET")
    word_list = {"size": marker, "text": str(marker)}
    app.logger.warning(marker)
    return json.dumps(word_list)

if __name__ == '__main__':
  app.run(host='0.0.0.0',  # 任何ip都可以访问
          port=8988,  # 端口
          debug=True
         )
