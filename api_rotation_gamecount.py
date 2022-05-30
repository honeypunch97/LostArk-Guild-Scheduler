from pymongo import MongoClient
import json
import datetime


# ec2실행
with open('/home/ubuntu/lags/secret.json', 'r') as json_file:
    SECRET_DATA = json.load(json_file)
client = MongoClient(SECRET_DATA['CLIENT_EC2'], SECRET_DATA['PORT_NUMBER'])

# local 실행
# with open('./secret.json', 'r') as json_file:
#     SECRET_DATA = json.load(json_file)
# client = MongoClient('localhost', SECRET_DATA['PORT_NUMBER'])

db = client.dblags

# 시스템로그 저장 함수
def save_log(log_content):
    time = (datetime.datetime.utcnow() + datetime.timedelta(hours=9)).strftime('%Y년 %m월 %d일 %H시 %M분')
    logdoc = {'category':'syslog','content':log_content,'time':time,'nickname':'SYSTEM'}
    db.sys.insert_one(logdoc)


# 매일 00시마다 실행 with crontab 0 0 * * *

def api_rotation_gamecount():
    db.users.update_many({}, {'$set' : {'abilitystonegamecount': 0, 
                                        'findninavegamecount':0,
                                        'papunikafishinggamecount':0,
                                        'pointroulettegamecount':0,
                                        }})
    save_log('게임 횟수 초기화 작동')
    return 0

api_rotation_gamecount()