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


# 수요일 06시마다 실행 with crontab 0 6 * * 3

def api_rotation_sch():
    # DB_thisweeksch의 내용 초기화
    db.thisweeksch.delete_many({})


    # ('fixedparty' == 'true'이면, 그대로 temp_sch_list에 넣어두고),
    # ('repeatsch'=='true'이면, 'member'값을 []로 초기화해서 넣어두기)
    next_sch_list = list(db.nextweeksch.find({}, {'_id': False}))
    temp_sch_list = []
    for next_sch in next_sch_list:
        if next_sch['fixedparty'] == 'true':
            doc = {
                'difficulty': next_sch['difficulty'],
                'content': next_sch['content'],
                'gate': next_sch['gate'],
                'day': next_sch['day'],
                'time': next_sch['time'],
                'memo': next_sch['memo'],
                'fixedparty': next_sch['fixedparty'],
                'repeatsch': next_sch['repeatsch'],
                'member': next_sch['member'],
                'new': 'false'
            }
            temp_sch_list.append(doc)
        elif next_sch['repeatsch'] == 'true':
            doc = {
                'difficulty': next_sch['difficulty'],
                'content': next_sch['content'],
                'gate': next_sch['gate'],
                'day': next_sch['day'],
                'time': next_sch['time'],
                'memo': next_sch['memo'],
                'fixedparty': next_sch['fixedparty'],
                'repeatsch': next_sch['repeatsch'],
                'member': [],
                'new': 'false'
            }
            temp_sch_list.append(doc)
    # DB_nextweeksch의 내용을 가져와, DB_thisweeksch에 넣어주기
    for next_sch in next_sch_list:
        doc = {
            'difficulty': next_sch['difficulty'],
            'content': next_sch['content'],
            'gate': next_sch['gate'],
            'day': next_sch['day'],
            'time': next_sch['time'],
            'memo': next_sch['memo'],
            'fixedparty': next_sch['fixedparty'],
            'repeatsch': next_sch['repeatsch'],
            'member': next_sch['member'],
            'new': 'false'
        }
        db.thisweeksch.insert_one(doc)

        # DB_nextweeksch의 내용을 전체삭제해주기
        db.nextweeksch.delete_many({})
        # DB_nextweeksch에 temp_sch_list의  값을 넣어주기
        for temp_sch in temp_sch_list:
            db.nextweeksch.insert_one(temp_sch)
    return 0

api_rotation_sch()