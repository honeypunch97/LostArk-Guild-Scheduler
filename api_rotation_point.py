from pymongo import MongoClient
import json


# ec2실행
with open('/home/ubuntu/lags/secret.json', 'r') as json_file:
    SECRET_DATA = json.load(json_file)
client = MongoClient(SECRET_DATA['CLIENT_EC2'], SECRET_DATA['PORT_NUMBER'])

# local 실행
# with open('./secret.json', 'r') as json_file:
#     SECRET_DATA = json.load(json_file)
# client = MongoClient('localhost', SECRET_DATA['PORT_NUMBER'])

db = client.dblags

# 로그 저장 함수
def save_log(log_nickname, log_title, log_content):
    time = (datetime.datetime.utcnow() + datetime.timedelta(hours=9)).strftime('%Y년 %m월 %d일 %H시 %M분 %S초')
    logdoc = {'time': time, 'nickname': log_nickname, 'title': log_title, 'content': log_content}
    print(logdoc)
    db.logdb.insert_one(logdoc)


# 매월 01일마다 실행 with crontab 0 0 1 * *
def api_rotation_point():
    db.users.update_many({}, {'$set' : {'point': 0}})
    save_log('SYSTEM', '포인트 초기화', '포인트 초기화 작동')
    return 0

api_rotation_point()