from flask import Flask, jsonify, request
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.route("/data_pipeline", methods=['POST'])
def saving_data():
  # https://blog.csdn.net/zhangvalue/article/details/93884630
  # https://blog.csdn.net/longting_/article/details/80637002
  text = json.loads(request.data.decode('utf8').replace("'", '"'))
  app.logger.warning(text['usermsg'])  # same with <input name='usermsg'>
  return str("hhh")

marker = 0;
@app.route("/get_data", methods=['GET'])
def pop_data():
  global marker
  while(True):
    marker += 1
    app.logger.warning("GET")
    regionListJob = {"size": marker, "text": str(marker)}
    app.logger.warning(marker)
    return json.dumps(regionListJob)

if __name__ == '__main__':
  app.run(host='0.0.0.0',  # 任何ip都可以访问
          port=8988,  # 端口
          debug=True
         )