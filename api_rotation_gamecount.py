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


# 매일 00시마다 실행 with crontab 0 0 * * *

def api_rotation_gamecount():
    db.users.update_many({}, {'$set' : {'abilitystonegamecount': 0, 
                                        'findninavegamecount':0}})
    return 0

api_rotation_gamecount()