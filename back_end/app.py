from flask import Flask, jsonify, request
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app ,supports_credentials=True)

@app.route("/data_pipeline", methods=['POST'])
def saving_data():
  for i in request.form:
    app.logger.info(i)
  '''
  text = request.form['opt_job']
  text2 = request.form['opt_language']
  app.logger.warning(text)
  app.logger.error(text2)
  app.logger.info('Harold')'''
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