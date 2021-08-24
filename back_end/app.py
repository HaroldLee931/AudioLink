from flask import Flask, request, render_template, url_for, redirect, jsonify
from flask_apscheduler import APScheduler
from flask_cors import CORS
import json
import time
import os
# import jieba.posseg as pseg
#import pandas as pd
#from pandas.io.parsers import read_csv

app = Flask(__name__)

###################################
#        Tencent ASR API          #
###################################
#import Tencent Api
from tencentcloud.common import credential
from tencentcloud.common.profile.client_profile import ClientProfile
from tencentcloud.common.profile.http_profile import HttpProfile
from tencentcloud.common.exception.tencent_cloud_sdk_exception import TencentCloudSDKException
from tencentcloud.asr.v20190614 import asr_client, models
# transfer Audio to Text powered by tencent asr

def audioToText(audioFilePath:str):
  audio_data_url = 'http://110.40.187.74:8988' + url_for('static', filename=audioFilePath)
  try:
    req = models.CreateRecTaskRequest()
    params = {
        "EngineModelType": "16k_zh",
        "ChannelNum": 1,
        "ResTextFormat": 0,
        "SourceType": 0,
        "Url": audio_data_url
    }
    req.from_json_string(json.dumps(params))

    resp = client.CreateRecTask(req)
    return json.loads(resp.to_json_string())["Data"]["TaskId"]

  except TencentCloudSDKException as err:
    app.logger.warning(err)
    with open('fail_log.txt', mode='a') as filename:
      filename.write('FAIL\n')
      filename.write(audioFilePath)
      filename.write(err)
      filename.write('\n')
    return 1

# Get tencent data base on tencent asr task id
def requestAToTResult(taskId:int) -> dict:
  try:
    req = models.DescribeTaskStatusRequest()
    params = {
        "TaskId": taskId
    }
    req.from_json_string(json.dumps(params))

    resp = client.DescribeTaskStatus(req)
    return json.loads(resp.to_json_string())
  except TencentCloudSDKException as err:
    return (err)

###################################
#    Data processing function     #
###################################
# data frame declaration
# waiting_list:   ASR witing task list, will be updated after Audio created
# nlp_wait_queue: need sentence data waiting list, will be updated after ASR TASK SUCC
# word_count:     sorted set, use for saving word count data
# uid hset structure {'userID':"", 'timeStamp':"",'AOrT':"", 'taskID':"", 'sentenceData':""}
import redis
import re
# TODO: need passwd
# TODO: Save Ip? Save count of visitor

#          NLP function           #
import jieba
import jieba.posseg as pseg

# TODO: Better model
def jiebaCut(sentence:str):
  words = pseg.cut(sentence,use_paddle=True) #paddle模式
  for word, flag in words:
    r.zincrby("word_count", 1, str(word))




wordFeqStruct = {'word':[], 'feq':[], 'userID':[]}
# storage the whole message
# Define regex function
chineseChrOnlyRegex = re.compile(r"[\u4e00-\u9fa5]+")

# unique user ID generator
def userIDGenerator()->int:
  return r.dbsize() + 1

# save the data to redis
def saveToRedis(userID:int, timeData:float, AOrT:int, taskID:int, sentence:str):
  newATData = {'timeStamp': str(timeData)}
  if AOrT == 0:  # if recive text only
    newATData['sentenceData'] = sentence
    r.rpush("nlp_wait_queue", userID)
  else:
    newATData['taskID'] = taskID
    r.rpush("waiting_list", userID)
  app.logger.warning(newATData)
  r.hmset(userID, newATData)

  return 0

# processing result base on the status code
# this function will be called by server every 30 sec
def updateTaskStat():
  # get the data from asr server
  if r.llen("waiting_list") == 0:
    app.logger.info("NO UID is in waiting_list")
    return 0
  for i in r.lrange("waiting_list", 0, -1):
    task_id = r.hget(i, "taskID")
    result_form_asr = requestAToTResult(int(task_id))['Data']
    if result_form_asr['Status'] == 2:
      app.logger.warning('The ASR task: %d is SUCC\n add releated UID to nlp_wait_queue', task_id)
      r.hset(i, 'Status', 2)
      r.hset(i, 'sentenceData', ''. join(chineseChrOnlyRegex.findall(result_form_asr['Result'])))
      # add to NLP queue
      r.rpush("nlp_wait_queue", i)
      r.lrem("waiting_list", 1, i)
    elif result_form_asr['Status'] == 3:
      r.hset(i, 'Status', 3)
      app.logger.warning('The ASR task: %d is FAIL', task_id)
      r.lrem("waiting_list", 1, i)
    else:
      app.logger.info('The ASR task: %d is still processing', task_id)
  return 1

def updateNLPStat():
  if r.llen("nlp_wait_queue") == 0:
    app.logger.info("NO UID is in nlp_wait_queue")
    return 0
  for i in r.lrange("nlp_wait_queue", 0, -1):
    sentence = r.hget(i, "sentenceData")
    # TODO: enable after Better model
    # jiebaCut(sentence)
    # r.lrem("nlp_wait_queue", 1, i)


###################################
#        Scheduled task           #
###################################
class Config(object):
    JOBS = [
      {
        'id': 'backup df data to disk',
        'func': '__main__:updateASRJobsresult',
        'trigger': 'interval',
        'seconds': 30
      }
    ]

# interval by APScheduler
def updateASRJobsresult():
  updateTaskStat()
  # updateNLPStat()

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
@app.route("/text_pipeline", methods=['GET','POST'])
def recive_text_data():

  # https://blog.csdn.net/zhangvalue/article/details/93884630
  # https://blog.csdn.net/longting_/article/details/80637002
  text = json.loads(request.data.decode('utf8').replace("'", '"')) # same with <input name='usermsg'>
  userID = userIDGenerator()
  saveToRedis(userID, time.time(), 0, 0, text['usermsg'])
  return str("hhh")

@app.route("/audio_pipeline", methods=['GET','POST'])
def recive_audio_data():
  # https://blog.csdn.net/baidu_18197725/article/details/88561400
  audio = request.files['audio_file']
  start = time.time()
  audioFilePath = "betaTest/" + str(start)
  audio.save("/home/ubuntu/AudioLink/back_end/static/" + audioFilePath)
  # 可否先返回一个链接 然后继续处理 多线程 or 异步处理
  # TODO: 大文件可能会导致服务器无响应 https://juejin.cn/post/6992116138398187533
  taskID = audioToText(audioFilePath)
  if(taskID != 1):
    userID = userIDGenerator()
    saveToRedis(userID, start, 1, taskID, str())
    # TODO: need to return a html with variable with userID
    return jsonify(content=str("http://110.40.187.74:8988/visualization"))
  else:
    return json.dump({'content':str("出问题惹\n" + audioFilePath + "\n请把这个截图发给Harold")})
  '''
  if(True):
    # return redirect(url_for('visit_visualization_page'), code=302)
    return jsonify(content=str("http://110.40.187.74:8988/visualization"))
    # json.dumps({'content':str("http://110.40.187.74:8988/visualization")})
  else:
    return json.dumps({'content':str("出问题惹\n请把这个截图发给Harold")})
  '''

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
  marker = 0
  CORS(app, supports_credentials=True)
  app.config.from_object(Config())
  # it is also possible to enable the API directly
  # scheduler.api_enabled = True
  scheduler = APScheduler()
  scheduler.init_app(app)
  scheduler.start()
  jieba.enable_paddle()
  jieba.initialize()

  cred = credential.Credential(
    os.environ.get("TENCENTCLOUD_SECRET_ID"),
    os.environ.get("TENCENTCLOUD_SECRET_KEY"))
  httpProfile = HttpProfile()
  httpProfile.endpoint = "asr.tencentcloudapi.com"
  clientProfile = ClientProfile()
  clientProfile.httpProfile = httpProfile
  client = asr_client.AsrClient(cred, "", clientProfile)

  redis_pool = redis.ConnectionPool(host='localhost', port=6379, decode_responses=True, db=0)
  r = redis.Redis(connection_pool= redis_pool)

  app.run(host='0.0.0.0',  # 任何ip都可以访问
          port=8988,  # 端口
          debug=True,
          threaded=False
         )
