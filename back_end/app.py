from flask import Flask, request, render_template, url_for
from flask_cors import CORS
import json
import jieba
import time
# import jieba.posseg as pseg
import pandas as pd

# TODO: get file name list form folder

from tencentcloud.common import credential
from tencentcloud.common.profile.client_profile import ClientProfile
from tencentcloud.common.profile.http_profile import HttpProfile
from tencentcloud.common.exception.tencent_cloud_sdk_exception import TencentCloudSDKException
from tencentcloud.asr.v20190614 import asr_client, models

app = Flask(__name__)
CORS(app, supports_credentials=True)
marker = 0
#jieba.enable_paddle()
jieba.initialize()

###################################
#          NLP function           #
###################################
def getWordList(sentence:str):
  word_list = jieba.cut_for_search(sentence)
  for i in word_list:
    print(i)

def saveTextToCSV(sentence:str, time_data:float):
  audioTextData = {'timingString': [],
                   'text':[]}
  aTDSHandler = pd.DataFrame(audioTextData)
  newATData = {'timingString': str(time), 'text': sentence}
  aTDSHandler = aTDSHandler.append(newATData, ignore_index=True)
  aTDSHandler.to_csv("text_data.csv",mode='a', index=None, header=False)
  end = time.time()
  app.logger.warning('Timing cost')
  app.logger.warning(end - time_data)

def audioToText(request_data):
  try:
      cred = credential.Credential("SecretId", "SecretKey")
      httpProfile = HttpProfile()
      httpProfile.endpoint = "asr.tencentcloudapi.com"

      clientProfile = ClientProfile()
      clientProfile.httpProfile = httpProfile
      client = asr_client.AsrClient(cred, "", clientProfile)

      req = models.CreateRecTaskRequest()
      params = {
          "EngineModelType": "16k_zh",
          "ChannelNum": 2,
          "ResTextFormat": 0,
          "SourceType": 1,
          "Data": request_data
      }
      req.from_json_string(json.dumps(params))

      resp = client.CreateRecTask(req)
      return resp.to_json_string()

  except TencentCloudSDKException as err:
      return app.logger.warning(err)

###################################
#   route to different web page   #
###################################
@app.route("/")
def visit_user_input_page():
  return render_template('interface.html')

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
@app.route("/text_pipeline", methods=['POST'])
def recive_text_data():

  # https://blog.csdn.net/zhangvalue/article/details/93884630
  # https://blog.csdn.net/longting_/article/details/80637002
  text = json.loads(request.data.decode('utf8').replace("'", '"')) # same with <input name='usermsg'>
  saveTextToCSV(text['usermsg'], time.time())
  return str("hhh")

@app.route("/audio_pipeline", methods=['POST'])
def recive_audio_data():
  # https://blog.csdn.net/baidu_18197725/article/details/88561400
  audio = request.files['audio_file']
  # for test only
  audio.save(audio.filename)
  # audioToText(audio)
  '''
  start = time.time()
  audio.save(str(start))
  # TODO: a_to_t_api(audio)
  '''
  return audioToText(audio)

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
          debug=True,
          threaded=False
         )
