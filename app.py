import hashlib
import jwt
import datetime
import json

from bson import ObjectId
from flask import Flask, render_template, request, jsonify, url_for, redirect
from pymongo import MongoClient

app = Flask(__name__)

with open('./secret.json', 'r') as json_file:
    SECRET_DATA = json.load(json_file)
    
# ec2실행
# client = MongoClient(SECRET_DATA['CLIENT_EC2'], SECRET_DATA['PORT_NUMBER'])
# local실행
client = MongoClient('localhost', SECRET_DATA['PORT_NUMBER'])

db = client.dblags

SECRET_KEY = SECRET_DATA['SECRET_KEY']

# 매주 수요일 06시 마다
# 1. 이번 주 일정을 삭제한다.
# 2. 다음 주 일정의 고정팟(전체), 반복일정(멤버제외)들을 temp_sch_list에 넣어준다.
# 3. 다음 주 일정의 전체 일정을 이번 주 일정으로 넘겨준다.
# 4. 다음 주 일정을 삭제한다.
# 5. 다음 주 일정에 temp_sch_list의 내용을 넣어준다.
def api_sch_rotation():
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

# 매월 01일 마다
# 1. 포인트 초기화
# 2. 일정 참여횟수 초기화
# def api_point_rotation():
#     db.users.update_many({}, {'$set' : {'point': 0, 'schjoincount': 0}})


# 로그 저장 함수
def save_log(log_nickname, log_title, log_content):
    time = (datetime.datetime.utcnow() + datetime.timedelta(hours=9)).strftime('%Y년 %m월 %d일 %H시 %M분 %S초')
    logdoc = {'time': time, 'nickname': log_nickname, 'title': log_title, 'content': log_content}
    db.logdb.insert_one(logdoc)


# 쿠키에 저장된 토큰값으로 payload찾기
def find_payload():
    token_receive = request.cookies.get('mytoken')
    payload = jwt.decode(token_receive, SECRET_KEY, algorithms=['HS256'])
    return payload


# 쿠키확인해서 로그인되어있으면, 이번주 일정 페이지, 비로그인이면 메인페이지 보내주기
@app.route("/")
def print_thisweek():
    # mytoken이 있을 때, 이번주 일정 페이지 render
    try:
        payload = find_payload()
        user_info = db.users.find_one({"email": payload['email']})
        day = (datetime.datetime.utcnow() + datetime.timedelta(hours=9))
        
        # 마지막 로그인날짜가 오늘이 아니라면, 1000포인트 추가해서 저장, 마지막 로그인날짜를 오늘로 저장
        today = day.strftime('%Y%m%d')
        if user_info['lastlogin'] != today:
            my_point = user_info['point'] + 1000
            db.users.update_one({'nickname': payload['nickname']}, {'$set': {'point': my_point, 'lastlogin': today}})
            # 미니게임 일일횟수 초기화
            # db.users.update_one({'nickname': payload['nickname']}, {'$set': {'abilitystonegamecount': 0}})
        
        # 매주 수요일 06시 일정 로테이션
        # sch_rotation = db.sys.find_one({'key': 'sch_rotation'}, {'_id': False})
        # if (day.strftime('%A') == 'Tuesday' and sch_rotation['last_rotation'] != today):
        #     api_sch_rotation()
        #     db.sys.update_one({'key': 'sch_rotation'}, {'$set': {'last_rotation': today}})
            
        # 매월 01일 포인트, 참여횟수 초기화 로테이션
        # point_rotation = db.sys.find_one({'key': 'point_rotation'}, {'_id': False})
        # if (day.strftime('%d') == '01' and point_rotation['last_rotation'] != today):
        #     api_point_rotation()
        #     db.sys.update_one({'key': 'point_rotation'}, {'$set': {'last_rotation': today}})

        return render_template('thisweeksch.html',
                               user_membership= payload['membership'],
                               user_email= payload['email'],
                               user_nickname= payload['nickname'],
                               user_class1= payload['class1'],
                               user_class2= payload['class2'],
                               user_class3= payload['class3'],
                               user_class4= payload['class4'],
                               user_class5= payload['class5'],
                               user_class6= payload['class6'],
                               )
    # mytoken이 없을 때, 메인페이지 render
    except:
        return render_template('mainpage.html')


# 로그인 기능
@app.route("/api_login/", methods=['POST'])
def api_login():
    email_receive = request.form['email_give']
    pw_receive = request.form['pw_give']
    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()
    result = db.users.find_one({'email': email_receive, 'pw': pw_hash})

    if result is not None:
        payload = {
            'membership': result['membership'],
            'email': email_receive,
            'nickname': result['nickname'],
            'class1': result['class1'],
            'class2': result['class2'],
            'class3': result['class3'],
            'class4': result['class4'],
            'class5': result['class5'],
            'class6': result['class6'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=9)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

        return jsonify({
            'result': 'SUCCESS',
            'title': '로그인 성공',
            'msg': '로그인을 환영합니다!',
            'token': token,
            'membership': result['membership']})
    else:
        return jsonify({'result': 'FAIL',
                        'title': '로그인 실패',
                        'msg': '아이디/비밀번호가 일치하지 않습니다.'})


# 회원가입 기능
@app.route("/api_signup/", methods=['POST'])
def api_signup():
    # 닉네임, 닉네임 중복체크
    # email, nickname 받아서
    email_receive = request.form['email_give']
    nickname_receive = request.form['nickname_give']

    # 받은 email, nickname값으로 db에서 검색
    check_email = db.users.find_one({'email': email_receive})
    check_nickname = db.users.find_one({'nickname': nickname_receive})

    # 만약 존재한다면 error와 msg 리턴
    if (check_email is not None):
        return jsonify({'result': 'SUCCESS', 'title': '회원가입 실패', 'msg': '이미 가입된 이메일입니다.'})
    elif (check_nickname is not None):
        return jsonify({'result': 'SUCCESS', 'title': '회원가입 실패', 'msg': '이미 가입된 닉네임입니다.'})

    # pw는 받아서 해싱, 16진수로 변환
    pw_receive = request.form['pw_give']
    pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()
    class_receive1 = request.form['class_give1']
    class_receive2 = request.form['class_give2']
    class_receive3 = request.form['class_give3']
    class_receive4 = request.form['class_give4']
    class_receive5 = request.form['class_give5']
    class_receive6 = request.form['class_give6']

    today = (datetime.datetime.utcnow() + datetime.timedelta(hours=9)).strftime('%Y%m%d')
    # 'membership': '관리자', '승인회원', '비승인회원(가입했을때 기본값)'
    doc = {
        'membership': '비승인회원',
        'email': email_receive,
        'pw': pw_hash,
        'nickname': nickname_receive,
        'class1': class_receive1,
        'class2': class_receive2,
        'class3': class_receive3,
        'class4': class_receive4,
        'class5': class_receive5,
        'class6': class_receive6,
        'point': 10000,
        'lastlogin': today,
        'schjoincount': 0,
        'abilitystonegamecount': 0
    }
    db.users.insert_one(doc)

    save_log(nickname_receive, '회원가입', '회원가입 성공')

    return jsonify({'result': 'SUCCESS', 'title': '회원가입 성공', 'msg': '가입을 환영합니다!'})


# '비승인회원'유저는 needallow 보내주기
@app.route("/needallow/")
def print_needallow():
    try:
        payload = find_payload()
        if (payload['membership'] == '비승인회원'):
            return render_template('needallow.html')
        else:
            return redirect("/")
    except:
        return redirect("/mainpage/")


# 이번 주 일정 페이지, 다음 주 일정 페이지 메인 공지 가져오기
@app.route("/api_find_main_announcement/", methods=['GET'])
def api_find_main_announcement():
    announcement = db.announcement.find_one({'id': '메인공지'})['announcement']
    return jsonify({'result': 'SUCCESS', 'announcement': announcement})


# 이번 주 일정 페이지, 모든 일정 가져오기 (페이지 로드시)
@app.route("/thisweeksch/api_printsch/", methods=['GET'])
def api_thisweek_printsch():
    all_sch = list(db.thisweeksch.find({}).sort("time", 1))
    sch_id_list = []
    for sch in all_sch:
        sch['_id'] = str(sch['_id'])
        sch_id_list.append(sch['_id'])

    all_sch = list(db.thisweeksch.find({}, {'_id': False}).sort("time", 1))

    return jsonify({
        'sch_id_list': sch_id_list,
        'all_sch': all_sch
    })


# 이번 주 일정 페이지, 일정 추가하기 기능 (일정 추가 창)
@app.route("/thisweeksch/api_addsch/", methods=['POST'])
def api_thisweek_addsch():
    payload = find_payload()
    difficulty_receive = request.form['difficulty_give']
    content_receive = request.form['content_give']
    gate_receive = request.form['gate_give']
    day_receive = request.form['day_give']
    time_receive = request.form['time_give']
    memo_receive = request.form['memo_give']
    fixedparty_receive = request.form['fixedparty_give']
    repeatsch_receive = request.form['repeatsch_give']
    member_receive = []
    new = 'true'
    doc = {
        'difficulty': difficulty_receive,
        'content': content_receive,
        'gate': gate_receive,
        'day': day_receive,
        'time': time_receive,
        'memo': memo_receive,
        'fixedparty': fixedparty_receive,
        'repeatsch': repeatsch_receive,
        'member': member_receive,
        'new': new
    }
    db.thisweeksch.insert_one(doc)

    save_log(payload['nickname'],
             '이번 주 일정 추가',
             '난이도: '+difficulty_receive+', 컨텐츠: '+content_receive+', 관문: '+gate_receive+
             ', 요일: '+day_receive+', 시간: '+time_receive+', 메모: '+memo_receive
             )

    return jsonify({
        'result': 'SUCCESS',
        'title': '일정 추가 성공',
        'msg': '일정 추가를 성공했습니다.'
    })


# 이번 주 일정 페이지, 일정 멤버 불러오기 (세부 일정 보기 창)
@app.route("/thisweeksch/api_printdetailedschmember/", methods=['POST'])
def api_thisweek_printdetailedschmember():
    try:
        payload = find_payload()
        sch_id_receive = request.form['sch_id_give']
        sch = db.thisweeksch.find_one({'_id': ObjectId(sch_id_receive)}, {'_id': False})

        return jsonify({'result': 'SUCCESS',
                        'title': '세부 일정 불러오기 성공',
                        'content': '세부 일정 불러오기를 성공했습니다.',
                        'sch': sch,
                        'myinfo': payload
                        })
    except:
        return jsonify({'result': 'FAIL',
                        'title': '세부 일정 불러오기 실패',
                        'content': '세부 일정 불러오기를 실패했습니다.',
                        })


# 이번 주 일정 페이지, 일정 삭제하기 기능 (세부 일정 보기 창)
@app.route("/thisweeksch/api_deletesch/", methods=['POST'])
def api_thisweek_deletesch():
    try:
        sch_id_receive = request.form['sch_id_give']
        sch = db.thisweeksch.find_one({'_id': ObjectId(sch_id_receive)})

        db.thisweeksch.delete_one({"_id": ObjectId(sch_id_receive)})

        payload = find_payload()

        save_log(payload['nickname'],
                 '이번 주 일정 삭제',
                 '난이도: '+sch["difficulty"]+', 컨텐츠: '+sch["content"]+', 관문: '+sch["gate"]+
                 ', 요일: '+sch["day"]+', 시간: '+sch["time"]+', 메모: '+sch["memo"]
                 )
        return jsonify({'result': 'SUCCESS', 'title': '일정 삭제 성공', 'msg': '일정 삭제를 성공했습니다.'})
    except:
        return jsonify({'result': 'FAIL', 'title': '일정 삭제 실패', 'msg': '일정 삭제를 실패했습니다.'})


# 이번 주 일정 페이지, 일정 참여하기 기능 (세부 일정 보기 창)
@app.route("/thisweeksch/api_joinsch/", methods=['POST'])
def api_thisweek_joinsch():
    try:
        payload = find_payload()

        sch_id_receive = request.form['sch_id_give']
        selectedclass_receive = request.form['selectedclass_give']
        sch = db.thisweeksch.find_one({"_id": ObjectId(sch_id_receive)})

        sch_member = sch['member']
        if sch['content'] == '카양겔' or sch['content'] == '쿠크세이튼':
            if len(sch['member']) >= 4:
                return jsonify({'result': 'FAIL', 'title': '일정 참여 실패', 'msg': '참여 인원이 가득 찼습니다.'})
        else:
            if len(sch['member']) >= 8:
                return jsonify({'result': 'FAIL', 'title': '일정 참여 실패', 'msg': '참여 인원이 가득 찼습니다.'})

        sch_member.append({'nickname': payload['nickname'], 'class': selectedclass_receive})
        db.thisweeksch.update_one({'_id': ObjectId(sch_id_receive)}, {'$set': {'member': sch_member}})

        save_log(payload['nickname'],
                 '이번 주 일정 참여',
                 '난이도: ' + sch["difficulty"] + ', 컨텐츠: ' + sch["content"] + ', 관문: ' + sch["gate"] +
                 ', 요일: ' + sch["day"] + ', 시간: ' + sch["time"] + ', 메모: ' + sch["memo"]
                 )

        return jsonify({'result': 'SUCCESS', 'title': '일정 참여 성공', 'msg': '일정 참여를 성공했습니다.'})
    except:
        return jsonify({'result': 'FAIL', 'title': '일정 참여 실패', 'msg': '일정 참여를 실패했습니다.'})


# 이번 주 일정 페이지, 일정 탈퇴하기 기능 (세부 일정 보기 창)
@app.route("/thisweeksch/api_leavesch/", methods=['POST'])
def api_thisweek_leavesch():
    try:
        sch_id_receive = request.form['sch_id_give']
        nickname_receive = request.form['nickname_give']
        selectedclass_receive = request.form['selectedclass_give']

        sch = db.thisweeksch.find_one({"_id": ObjectId(sch_id_receive)})
        sch_member = sch['member']
        sch_member.remove({'nickname': nickname_receive, 'class': selectedclass_receive})
        db.thisweeksch.update_one({'_id': ObjectId(sch_id_receive)}, {'$set': {'member': sch_member}})

        payload = find_payload()
        save_log(payload['nickname'],
                 '이번 주 일정 탈퇴',
                 '닉네임: ' + nickname_receive + ', 난이도: ' + sch["difficulty"] + ', 컨텐츠: ' + sch["content"] + ', 관문: ' +
                 sch["gate"] +
                 ', 요일: ' + sch["day"] + ', 시간: ' + sch["time"] + ', 메모: ' + sch["memo"]
                 )

        return jsonify({'result': 'SUCCESS', 'title': '일정 탈퇴 성공', 'msg': '일정 탈퇴를 성공했습니다.'})
    except:
        return jsonify({'result': 'SUCCESS', 'title': '일정 탈퇴 실패', 'msg': '일정 탈퇴를 실패했습니다.'})


# 이번 주 일정 페이지, 일정 완료하기 기능 (세부 일정 보기 창)
@app.route("/thisweeksch/api_donesch/", methods=['POST'])
def api_thisweek_donesch():
    try:
        payload = find_payload()
        sch_id_receive = request.form['sch_id_give']
        sch = db.thisweeksch.find_one({"_id": ObjectId(sch_id_receive)})
        member_list = []
        if sch['content'] == '토벌전':
            add_point = 5000
        else:
            add_point = 10000

        for i in sch['member']:
            user = db.users.find_one({'nickname': i['nickname']})
            point = user['point'] + add_point
            schjoincount = user['schjoincount'] + 1
            db.users.update_one({'nickname': i['nickname']}, {'$set': {'point': point}})
            db.users.update_one({'nickname': i['nickname']}, {'$set': {'schjoincount': schjoincount}})
            member_list.append(i['nickname'])

        db.thisweeksch.delete_one({"_id": ObjectId(sch_id_receive)})

        save_log(payload['nickname'],
                 '이번 주 일정 완료',
                 '난이도: ' + sch["difficulty"] + ', 컨텐츠: ' + sch["content"] + ', 관문: ' + sch["gate"] +
                 ', 요일: ' + sch["day"] + ', 시간: ' + sch["time"] + ', 메모: ' + sch["memo"] + ', 멤버: ' + str(member_list)
                 )
        return jsonify({'result': 'SUCCESS', 'title': '일정 완료 성공', 'msg': '일정 완료를 성공했습니다.'})
    except:
        return jsonify({'result': 'SUCCESS', 'title': '일정 완료 실패', 'msg': '일정 완료를 실패했습니다.'})


# 다음 주 일정 페이지, 기본GET요청
@app.route("/nextweeksch/")
def print_nextweek():
    try:
        payload = find_payload()

        user_info = db.users.find_one({"email": payload['email']})
        return render_template('nextweeksch.html',
                               user_membership=user_info['membership'],
                               user_email=user_info['email'],
                               user_nickname=user_info['nickname'],
                               user_class1=user_info['class1'],
                               user_class2=user_info['class2'],
                               user_class3=user_info['class3'],
                               user_class4=user_info['class4'],
                               user_class5=user_info['class5'],
                               user_class6=user_info['class6'],
                               )
    # mytoken이 없을 때, 비로그인시
    except:
        return redirect("/")


# 다음 주 일정 페이지, 모든 일정 가져오기 (페이지 로드시)
@app.route("/nextweeksch/api_printsch/", methods=['GET'])
def api_nextweek_printsch():
    all_sch = list(db.nextweeksch.find({}).sort("time", 1))

    sch_id_list = []
    for sch in all_sch:
        sch['_id'] = str(sch['_id'])
        sch_id_list.append(sch['_id'])

    all_sch = list(db.nextweeksch.find({}, {'_id': False}).sort("time", 1))

    return jsonify({
        'sch_id_list': sch_id_list,
        'all_sch': all_sch
    })


# 다음 주 일정 페이지, 일정 추가하기 기능 (일정 추가 창)
@app.route("/nextweeksch/api_addsch/", methods=['POST'])
def api_nextweek_addsch():
    difficulty_receive = request.form['difficulty_give']
    content_receive = request.form['content_give']
    gate_receive = request.form['gate_give']
    day_receive = request.form['day_give']
    time_receive = request.form['time_give']
    memo_receive = request.form['memo_give']
    fixedparty_receive = request.form['fixedparty_give']
    repeatsch_receive = request.form['repeatsch_give']
    member_receive = []
    new = 'false'
    doc = {
        'difficulty': difficulty_receive,
        'content': content_receive,
        'gate': gate_receive,
        'day': day_receive,
        'time': time_receive,
        'memo': memo_receive,
        'fixedparty': fixedparty_receive,
        'repeatsch': repeatsch_receive,
        'member': member_receive,
        'new': new
    }
    db.nextweeksch.insert_one(doc)

    payload = find_payload()
    save_log(payload['nickname'],
             '다음 주 일정 추가',
             '난이도: ' + difficulty_receive + ', 컨텐츠: ' + content_receive + ', 관문: ' + gate_receive +
             ', 요일: ' + day_receive + ', 시간: ' + time_receive + ', 메모: ' + memo_receive
             )

    return jsonify({
        'result': 'SUCCESS',
        'title': '일정 추가 성공',
        'msg': '일정 추가를 성공했습니다.'
    })


# 다음 주 일정 페이지, 일정 멤버 불러오기 (세부 일정 보기 창)
@app.route("/nextweeksch/api_printdetailedschmember/", methods=['POST'])
def api_nextweek_printdetailedschmember():
    try:
        payload = find_payload()
        sch_id_receive = request.form['sch_id_give']
        sch = db.nextweeksch.find_one({'_id': ObjectId(sch_id_receive)}, {'_id': False})

        return jsonify({'result': 'SUCCESS',
                        'title': '세부 일정 불러오기 성공',
                        'content': '세부 일정 불러오기를 성공했습니다.',
                        'sch': sch,
                        'myinfo': payload
                        })
    except:
        return jsonify({'result': 'FAIL',
                        'title': '세부 일정 불러오기 실패',
                        'content': '세부 일정 불러오기를 실패했습니다.',
                        })


# 다음 주 일정 페이지, 일정 삭제하기 기능 (세부 일정 보기 창)
@app.route("/nextweeksch/api_deletesch/", methods=['POST'])
def api_nextweek_deletesch():
    try:
        sch_id_receive = request.form['sch_id_give']
        sch = db.nextweeksch.find_one({"_id": ObjectId(sch_id_receive)})
        db.nextweeksch.delete_one({"_id": ObjectId(sch_id_receive)})

        payload = find_payload()
        save_log(payload['nickname'],
                 '다음 주 일정 삭제',
                 '난이도: ' + sch["difficulty"] + ', 컨텐츠: ' + sch["content"] + ', 관문: ' + sch["gate"] +
                 ', 요일: ' + sch["day"] + ', 시간: ' + sch["time"] + ', 메모: ' + sch["memo"]
                 )

        return jsonify({'result': 'SUCCESS', 'title': '일정 삭제 성공', 'msg': '일정 삭제를 성공했습니다.'})
    except:
        return jsonify({'result': 'FAIL', 'title': '일정 삭제 실패', 'msg': '일정 삭제를 실패했습니다.'})


# 다음 주 일정 페이지, 일정 참여하기 기능 (세부 일정 보기 창)
@app.route("/nextweeksch/api_joinsch/", methods=['POST'])
def api_nextweek_joinsch():
    try:
        payload = find_payload()
        sch_id_receive = request.form['sch_id_give']
        selectedclass_receive = request.form['selectedclass_give']

        sch = db.nextweeksch.find_one({"_id": ObjectId(sch_id_receive)})
        sch_member = sch['member']
        sch_member.append({'nickname': payload['nickname'], 'class': selectedclass_receive})
        db.nextweeksch.update_one({'_id': ObjectId(sch_id_receive)}, {'$set': {'member': sch_member}})

        save_log(payload['nickname'],
                 '다음 주 일정 참여',
                 '난이도: ' + sch["difficulty"] + ', 컨텐츠: ' + sch["content"] + ', 관문: ' + sch["gate"] +
                 ', 요일: ' + sch["day"] + ', 시간: ' + sch["time"] + ', 메모: ' + sch["memo"]
                 )

        return jsonify({'result': 'SUCCESS', 'title': '일정 참여 성공', 'msg': '일정 참여를 성공했습니다.'})
    except:
        return jsonify({'result': 'FAIL', 'title': '일정 참여 실패', 'msg': '일정 참여를 실패했습니다. (일정변동)'})


# 다음 주 일정 페이지, 일정 탈퇴하기 기능 (세부 일정 보기 창)
@app.route("/nextweeksch/api_leavesch/", methods=['POST'])
def api_nextweek_leavesch():
    try:
        sch_id_receive = request.form['sch_id_give']
        nickname_receive = request.form['nickname_give']
        selectedclass_receive = request.form['selectedclass_give']

        sch = db.nextweeksch.find_one({"_id": ObjectId(sch_id_receive)})
        sch_member = sch['member']
        sch_member.remove({'nickname': nickname_receive, 'class': selectedclass_receive})
        db.nextweeksch.update_one({'_id': ObjectId(sch_id_receive)}, {'$set': {'member': sch_member}})

        payload = find_payload()
        save_log(payload['nickname'],
                 '다음 주 일정 탈퇴',
                 '닉네임: ' + nickname_receive + ', 난이도: ' + sch["difficulty"] + ', 컨텐츠: ' + sch["content"] + ', 관문: ' +
                 sch["gate"] +
                 ', 요일: ' + sch["day"] + ', 시간: ' + sch["time"] + ', 메모: ' + sch["memo"]
                 )

        return jsonify({'result': 'SUCCESS', 'title': '일정 탈퇴 성공', 'msg': '일정 탈퇴를 성공했습니다.'})
    except:
        return jsonify({'result': 'SUCCESS', 'title': '일정 탈퇴 실패', 'msg': '일정 탈퇴를 실패했습니다. (일정 변동)'})


# 인력사무소 페이지, 기본 GET요청
@app.route("/resourceoffice/")
def print_resourceoffice():
    try:
        payload = find_payload()
        return render_template('resourceoffice.html',
                               user_membership=payload['membership'],
                               user_email=payload['email'],
                               user_nickname=payload['nickname'],
                               user_class1=payload['class1'],
                               user_class2=payload['class2'],
                               user_class3=payload['class3'],
                               user_class4=payload['class4'],
                               user_class5=payload['class5'],
                               user_class6=payload['class6'],
                               )
    except:
        return redirect("/")


# 인력사무소 페이지, 항목 불러오기 기능
@app.route("/resourceoffice/api_printcategory/", methods=['GET'])
def api_printcategory():
    try:
        payload = find_payload()

        all_category = list(db.resourceoffice.find({}))
        for category in all_category:
            category['_id'] = str(category['_id'])
        return jsonify({'result': 'SUCCESS',
                        'all_category': all_category,
                        'nickname': payload['nickname'],
                        'membership': payload['membership']
                        })
    except:
        return redirect("/")


# 인력사무소 페이지, 항목 추가 기능
@app.route("/resourceoffice/api_addcategory/", methods=['POST'])
def api_addcategory():
    try:
        category_receive = request.form['category_give']
        doc = {
            'category': category_receive,
            'member': []
        }
        db.resourceoffice.insert_one(doc)

        payload = find_payload()
        save_log(payload['nickname'], '인력사무소 항목 추가', category_receive)

        return jsonify({'result': 'SUCCESS',
                        'title': '항목 추가 성공',
                        'msg': '항목 추가를 성공했습니다.'
                        })
    except:
        return jsonify({'result': 'FAIL',
                        'title': '항목 추가 실패',
                        'msg': '항목 추가를 실패했습니다.'
                        })


# 인력사무소 페이지, 항목 삭제 기능
@app.route("/resourceoffice/api_deletecategory/", methods=['POST'])
def api_deletecategory():
    try:
        payload = find_payload()
        if payload['membership'] == '관리자':
            categoryid_receive = request.form['categoryid_give']
            category = db.resourceoffice.find_one({"_id": ObjectId(categoryid_receive)})
            db.resourceoffice.delete_one({"_id": ObjectId(categoryid_receive)})

            payload = find_payload()
            save_log(payload['nickname'], '인력사무소 항목 삭제', category['category'])

            return jsonify({'result': 'SUCCESS', 'title': '항목 삭제 성공', 'msg': '항목 삭제를 성공했습니다.'})
        else:
            return jsonify({'result': 'FAIL', 'title': '항목 삭제 실패', 'msg': '권한이 없습니다.'})
    except jwt.exceptions.DecodeError:
        return jsonify({'result': 'FAIL', 'title': '항목 삭제 실패', 'msg': '항목 삭제를 실패했습니다.'})


# 인력사무소 페이지, 참가하기 기능
@app.route("/resourceoffice/api_joincategory/", methods=['POST'])
def api_joincategory():
    try:
        payload = find_payload()
        categoryid_receive = request.form['categoryid_give']
        class_receive = request.form['class_give']
        level_receive = request.form['level_give']
        memo_receive = request.form['memo_give']

        doc = {
            'nickname': payload['nickname'],
            'class': class_receive,
            'level': level_receive,
            'memo': memo_receive
        }
        category = db.resourceoffice.find_one({"_id": ObjectId(categoryid_receive)})
        category_member = category['member']
        category_member.append(doc)
        db.resourceoffice.update_one({'_id': ObjectId(categoryid_receive)}, {'$set': {'member': category_member}})

        save_log(payload['nickname'], '인력사무소 항목 참가',
                 '항목: ' + category['category'] + ', 닉네임: ' + payload['nickname'] +
                 ', 직업: ' + class_receive + ', 레벨: ' + level_receive + ', 메모: ' + memo_receive)

        return jsonify({'result': 'SUCCESS',
                        'title': '항목 참가 성공',
                        'msg': '항목 참가를 성공했습니다.'
                        })
    except jwt.exceptions.DecodeError:
        return jsonify({'result': 'FAIL',
                        'title': '항목 참가 실패',
                        'msg': '항목 참가를 실패했습니다.'
                        })


# 인력사무소 페이지, 탈퇴하기 기능
@app.route("/resourceoffice/api_leavecategory/", methods=['POST'])
def api_leavecategory():
    try:
        categoryid_receive = request.form['categoryid_give']
        nickname_receive = request.form['nickname_give']
        class_receive = request.form['class_give']
        level_receive = request.form['level_give']
        memo_receive = request.form['memo_give']

        category = db.resourceoffice.find_one({"_id": ObjectId(categoryid_receive)})
        category_member = category['member']
        category_member.remove({'nickname': nickname_receive,
                                'class': class_receive,
                                'level': level_receive,
                                'memo': memo_receive
                                })
        db.resourceoffice.update_one({'_id': ObjectId(categoryid_receive)}, {'$set': {'member': category_member}})

        payload = find_payload()
        save_log(payload['nickname'], '인력사무소 항목 탈퇴',
                 '항목: ' + category['category'] + ', 닉네임: ' + payload['nickname'] +
                 ', 직업: ' + class_receive + ', 레벨: ' + level_receive + ', 메모: ' + memo_receive)

        return jsonify({'result': 'SUCCESS', 'title': '항목 탈퇴 성공', 'msg': '해당 항목에서 탈퇴했습니다.'})
    except:
        return jsonify({'result': 'SUCCESS', 'title': '항목 탈퇴 실패', 'msg': '해당 항목에서의 탈퇴를 실패했습니다. (항목 정보 변경)'})


# 인력사무소 페이지, 인력사무소 공지 출력 기능
@app.route("/resourceoffice/api_print_resourceoffice_announcement/", methods=['GET'])
def api_print_resourceoffice_announcement():
    announcement = db.announcement.find_one({'id': '인력사무소공지'})['announcement']
    return jsonify({'result': 'SUCCESS', 'announcement': announcement})


# 구인구직 페이지, 기본 GET요청
@app.route("/jobsearch/")
def print_jobsearch():
    try:
        payload = find_payload()
        return render_template('jobsearch.html', user_nickname=payload['nickname'])
    except:
        return redirect("/")


# 구인구직 페이지, 전체 포스트 가져오기
@app.route("/jobsearch/api_print_jobsearch_posts/", methods=['GET'])
def api_print_jobsearch_posts():
    try:
        payload = find_payload()
        all_post = list(db.jobsearch.find({}, {}).sort("time", -1))

        for post in all_post:
            post['_id'] = str(post['_id'])

        return jsonify({'result': 'SUCCESS', 'all_post': all_post,
                        'membership': payload['membership'], 'nickname':payload['nickname']})
    except:
        return jsonify({'result': 'FAIL',
                        'title': '게시글 불러오기 실패',
                        'msg': '게시글 불러오기를 실패했습니다.'
                        })


# 구인구직 페이지, 게시글 작성 기능
@app.route("/jobsearch/api_write_jobsearch_post/", methods=['POST'])
def api_write_jobsearch_post():
    try:
        payload = find_payload()
        content_receive = request.form['content_give']
        time = (datetime.datetime.utcnow() + datetime.timedelta(hours=9)).strftime('%Y-%m-%d %H:%M')
        doc = {
            'nickname': payload['nickname'],
            'content': content_receive,
            'time': time
        }
        db.jobsearch.insert_one(doc)

        save_log(payload['nickname'], '구인구직 게시글 작성', content_receive)

        return jsonify({'result': 'SUCCESS',
                        'title': '게시글 작성 성공',
                        'msg': '게시글 작성을 성공했습니다.'
                        })
    except:
        return jsonify({'result': 'FAIL',
                        'title': '게시글 작성 실패',
                        'msg': '게시글 작성을 실패했습니다.'
                        })


# 구인구직 페이지, 게시글 삭제 기능
@app.route("/jobsearch/api_delete_jobsearch_post/", methods=['POST'])
def api_delete_jobsearch_post():
    try:
        payload = find_payload()
        id_receive = request.form['id_give']
        post = db.jobsearch.find_one({'_id':ObjectId(id_receive)})
        db.jobsearch.delete_one({'_id':ObjectId(id_receive)})

        save_log(payload['nickname'],'구인구직 게시글 삭제','닉네임: '+post['nickname']+', 내용: '+post['content'])
        return jsonify({'result': 'SUCCESS',
                        'title': '게시글 삭제 성공',
                        'msg': '게시글 삭제를 성공했습니다.'
                        })
    except:
        return jsonify({'result': 'FAIL',
                        'title': '게시글 삭제 실패',
                        'msg': '로그인이 필요합니다.'
                        })


# 대나무숲 페이지, 기본 GET요청
@app.route("/anonymousboard/")
def print_anonymousboard():
    try:
        payload = find_payload()
        return render_template('anonymousboard.html',
                               user_membership=payload['membership'],
                               user_email=payload['email'],
                               user_nickname=payload['nickname'],
                               )
    except:
        return redirect("/")


# 대나무숲 페이지, 전체 포스트 가져오기
@app.route("/anonymousboard/api_print_posts/", methods=['GET'])
def api_print_posts():
    all_post = list(db.posts.find({}, {'_id': False}).sort("time", -1))
    return jsonify({'result': 'SUCCESS', 'all_post': all_post})


# 대나무숲 페이지, 전체 삭제 기능(관리자)
@app.route("/anonymousboard/api_delete_allpost/", methods=['GET'])
def api_delete_allpost():
    payload = find_payload()

    if payload['membership'] == '관리자':
        db.posts.delete_many({})
        save_log(payload['nickname'], '대나무숲 게시글 전체 삭제', '대나무숲 게시글 전체 삭제')
        return jsonify({'result': 'SUCCESS',
                        'title': '전체 게시글 삭제 성공',
                        'msg': '전체 게시글을 삭제했습니다.'
                        })
    else:
        return jsonify({'result': 'FAIL',
                        'title': '전체 게시글 삭제 실패',
                        'msg': '권한이 없습니다.'
                        })


# 대나무숲 페이지, 게시글 작성 기능
@app.route("/anonymousboard/api_write_post/", methods=['POST'])
def api_write_post():
    title_receive = request.form['title_give']
    content_receive = request.form['content_give']

    time = (datetime.datetime.utcnow() + datetime.timedelta(hours=9)).strftime('%Y-%m-%d %H:%M')
    doc = {
        'title': title_receive,
        'content': content_receive,
        'time': time
    }
    db.posts.insert_one(doc)

    save_log('익명', '대나무숲 게시글 작성', title_receive + ', ' + content_receive)

    return jsonify({'result': 'SUCCESS',
                    'title': '게시글 작성 성공',
                    'msg': '게시글 작성을 성공했습니다.'
                    })


# 미니게임 페이지, 기본 GET요청
@app.route("/minigames/")
def print_minigames():
    try:
        payload = find_payload()
        return render_template('minigames.html',
                               user_membership=payload['membership'],
                               user_nickname=payload['nickname']
                               )
    except jwt.ExpiredSignatureError:
        return redirect("/")


# 미니게임 페이지, 내 포인트, 포인트 랭킹 불러오기
@app.route("/minigames/api_printpointranking/", methods=['GET'])
def api_print_pointranking():
    payload = find_payload()
    myinfo = db.users.find_one({'nickname': payload['nickname']})
    mypoint = myinfo['point']
    all_user = list(db.users.find({}, {'_id': False}).sort("point", -1))
    top_ranking_list = []
    if len(all_user) >= 5:
        for i in range(5):
            top_ranking_list.append({'nickname': all_user[i]['nickname'], 'point': all_user[i]['point']})
    else:
        for i in range(len(all_user)):
            top_ranking_list.append({'nickname': all_user[i]['nickname'], 'point': all_user[i]['point']})
    return jsonify({'result': 'SUCCESS', 'top_ranking_list': top_ranking_list, 'mypoint': mypoint})
    
# 미니게임 페이지, 포인트 감소시키키 (if click 'game start btn')
@app.route("/minigames/api_gamestart/", methods=['POST'])
def api_gamestart():
    try:
        payload = find_payload()
        user_info = db.users.find_one({'nickname': payload['nickname']})
        decrease_point_receive = int(request.form['decrease_point_give'])
        if user_info['abilitystonegamecount'] >= 4:
            return jsonify({'result': 'FAIL', 'title': '게임 시작 실패', 'msg': '일일 가능 횟수를 모두 소진했습니다.'})
        else:
            abilitystonegamecount = user_info['abilitystonegamecount'] + 1
            db.users.update_one({'nickname': payload['nickname']}, {'$set': {'abilitystonegamecount': abilitystonegamecount}})
        point = user_info['point'] - decrease_point_receive - 2500
        db.users.update_one({'nickname': payload['nickname']}, {'$set': {'point': point}})
        return jsonify({'result': 'SUCCESS', 'title': '게임 시작 성공', 'msg': '게임 시작을 성공했습니다.'})
    except:
        return jsonify({'result': 'FAIL', 'title': '게임 시작 실패', 'msg': '로그인이 유효하지 않습니다.'})

# 미니게임 페이지, 포인트 정산하기
@app.route("/minigames/api_gamedone/", methods=['POST'])
def api_gamedone():
    # try:
    payload = find_payload()
    user_info = db.users.find_one({'nickname': payload['nickname']})
    result_point_receive = int(request.form['result_point_give'])
    point = user_info['point'] + result_point_receive + 2500
    db.users.update_one({'nickname': payload['nickname']}, {'$set': {'point': point}})
    return jsonify({'result': 'SUCCESS', 'title': '포인트 정산 성공', 'msg': '내 포인트는 '+str(point)+'포인트 입니다.'})
    # except:
    #     return jsonify({'result': 'FAIL', 'title': '포인트 정산 성공', 'msg': '로그인이 유효하지 않습니다.'})



# 마이페이지 기본GET요청
@app.route("/mypage/")
def print_mypage():
    try:
        payload = find_payload()

        return render_template('mypage.html',
                               user_membership=payload['membership'],
                               user_email=payload['email'],
                               user_nickname=payload['nickname'],
                               user_class1=payload['class1'],
                               user_class2=payload['class2'],
                               user_class3=payload['class3'],
                               user_class4=payload['class4'],
                               user_class5=payload['class5'],
                               user_class6=payload['class6'],
                               )
    except:
        return redirect('/')


# 마이페이지, 권한별로 유저정보 가져오기 (권한 변경 컨테이너)
@app.route("/mypage/api_find_announcement&userbymembership/")
def find_announcement_and_userbymembership():
    try:
        payload = find_payload()
        if payload['membership'] == '관리자':
            announcement = db.announcement.find_one({'id': '메인공지'})['announcement']

            users_admin = list(db.users.find({'membership': '관리자'}, {'_id': False}))
            users_approvedmember = list(db.users.find({'membership': '승인회원'}, {'_id': False}))
            users_nonmember = list(db.users.find({'membership': '비승인회원'}, {'_id': False}))
            return jsonify({
                'result': 'SUCCESS',
                'announcement': announcement,
                'users_admin': users_admin,
                'users_approvedmember': users_approvedmember,
                'users_nonmember': users_nonmember
            })
        else:
            return jsonify({'result': 'FAIL', 'title': '데이터(관리자 권한) 불러오기 실패', 'msg': '권한이 없습니다.'})
    except:
        return jsonify({'result': 'FAIL', 'title': '데이터(관리자 권한) 불러오기 실패', 'msg': '로그인이 유효하지 않습니다.'})


# 마이페이지, 나의 정보 수정 기능
@app.route("/mypage/api_chage_myinfo/", methods=['POST'])
def api_change_myinfo():
    try:
        payload = find_payload()

        pw_receive = request.form['pw_give']
        class_receive1 = request.form['class_give1']
        class_receive2 = request.form['class_give2']
        class_receive3 = request.form['class_give3']
        class_receive4 = request.form['class_give4']
        class_receive5 = request.form['class_give5']
        class_receive6 = request.form['class_give6']

        # 패스워드 해싱 with sga256, 16진수로 변경
        pw_hash = hashlib.sha256(pw_receive.encode('utf-8')).hexdigest()

        # 받은 값들로 db에서 nickname으로 찾아서 각 값을 수정
        # 추후 수정 예상(이유: 하나씩 바꾸는게 틀린것 같은데 관련자료를 찾지 못함)
        db.users.update_one({'nickname': payload['nickname']}, {'$set': {'pw': pw_hash}})
        db.users.update_one({'nickname': payload['nickname']}, {'$set': {'class1': class_receive1}})
        db.users.update_one({'nickname': payload['nickname']}, {'$set': {'class2': class_receive2}})
        db.users.update_one({'nickname': payload['nickname']}, {'$set': {'class3': class_receive3}})
        db.users.update_one({'nickname': payload['nickname']}, {'$set': {'class4': class_receive4}})
        db.users.update_one({'nickname': payload['nickname']}, {'$set': {'class5': class_receive5}})
        db.users.update_one({'nickname': payload['nickname']}, {'$set': {'class6': class_receive6}})

        user_info = db.users.find_one({'nickname': payload['nickname']})

        payload = {
            'membership': payload['membership'],
            'email': user_info['email'],
            'nickname': payload['nickname'],
            'class1': class_receive1,
            'class2': class_receive2,
            'class3': class_receive3,
            'class4': class_receive4,
            'class5': class_receive5,
            'class6': class_receive6,
            'point': user_info['point'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=9)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

        save_log(payload['nickname'], '내 정보 수정', '내 정보를 수정했습니다.')

        return jsonify({'result': 'SUCCESS',
                        'title': '내 정보 수정 성공',
                        'msg': '내 정보 수정을 성공했습니다.',
                        'token': token
                        })
    except:
        return jsonify({'result': 'FAIL',
                        'title': '내 정보 수정 실패',
                        'msg': '내 정보 수정을 실패했습니다.'
                        })


#마이페이지, 메인 공지, 인력사무소 공지, 불러오기 (권한 == 관리자)
@app.route("/mypage/api_print_announcement/", methods=['GET'])
def api_print_announcement():
    try:
        payload = find_payload()
        if payload['membership'] == '관리자':
            main_announcement = db.announcement.find_one({'id': '메인공지'})['announcement']
            resourceoffice_announcement = db.announcement.find_one({'id': '인력사무소공지'})['announcement']
            return jsonify({'result': 'SUCCESS',
                            'main_announcement': main_announcement,
                            'resourceoffice_announcement': resourceoffice_announcement
                            })
        else:
            return jsonify({'result': 'FAIL', 'title': '공지 불러오기 실패', 'msg': '권한이 없습니다.'})
    except:
        return jsonify({'result': 'FAIL', 'title': '공지 불러오기 실패', 'msg': '로그인이 필요합니다.'})


# 마이페이지, 메인 공지 수정 기능 (공지 수정 컨테이너)
@app.route("/mypage/api_change_main_announcement/", methods=['POST'])
def api_change_main_announcement():
    try:
        payload = find_payload()
        if (payload['membership'] == '관리자'):
            announcement_receive = request.form['announcement_give']
            db.announcement.update_one({'id': '메인공지'}, {'$set': {'announcement': announcement_receive}})

            save_log(payload['nickname'], '메인 공지 수정', announcement_receive)

            return jsonify({'result': 'SUCCESS',
                            'title': '공지 수정 성공',
                            'msg': '공지 수정을 성공했습니다.',
                            'announcement': announcement_receive
                            })
        else:
            return jsonify({'result': 'FAIL',
                            'title': '공지 수정 실패',
                            'msg': '권한이 없습니다.'
                            })
    except jwt.exceptions.DecodeError:
        return jsonify({'result': 'FAIL',
                        'title': '메인 공지 수정 실패',
                        'msg': '로그인이 필요합니다.'
                        })


# 마이페이지, 인력사무소 공지 수정 기능 (공지 수정 컨테이너)
@app.route("/mypage/api_change_resourceoffice_announcement/", methods=['POST'])
def api_change_resourceoffice_announcement():
    try:
        payload = find_payload()
        if (payload['membership'] == '관리자'):
            announcement_receive = request.form['announcement_give']
            db.announcement.update_one({'id': '인력사무소공지'}, {'$set': {'announcement': announcement_receive}})

            save_log(payload['nickname'], '공지 수정', announcement_receive)

            return jsonify({'result': 'SUCCESS',
                            'title': '공지 수정 성공',
                            'msg': '인력사무소 공지 수정을 성공했습니다.'
                            })
        else:
            return jsonify({'result': 'FAIL',
                            'title': '공지 수정 실패',
                            'msg': '권한이 없습니다.'
                            })
    except:
        return jsonify({'result': 'FAIL',
                        'title': '공지 수정 실패',
                        'msg': '로그인이 필요합니다.'
                        })


# 마이페이지, 권한 업그레이드 기능 (권한 변경 컨테이너)
@app.route("/mypage/api_upgrade/", methods=['POST'])
def api_upgrade():
    try:
        payload = find_payload()
        if payload['membership'] == '관리자':
            nickname_receive = request.form['nickname_give']
            membership = db.users.find_one({'nickname': nickname_receive})['membership']
            if membership == '승인회원':
                after_membership = '관리자'
                db.users.update_one({'nickname': nickname_receive}, {'$set': {'membership': '관리자'}})
            elif membership == '비승인회원':
                after_membership = '승인회원'
                db.users.update_one({'nickname': nickname_receive}, {'$set': {'membership': '승인회원'}})

            save_log(payload['nickname'], '권한 변경',
                     nickname_receive + '(' + membership + ')=>(' + after_membership + ')')

            return jsonify({'result': 'SUCCESS',
                            'title': '권한 변경 성공',
                            'msg': '권한을 업그레이드 했습니다.'})
        else:
            return jsonify({'result': 'FAIL',
                            'title': '권한 변경 실패',
                            'msg': '권한이 없습니다.'})
    except:
        return jsonify({'result': 'FAIL',
                        'title': '권한 변경 실패',
                        'msg': '로그인이 필요합니다.'})


# 마이페이지, 권한 다운그레이드 기능 (권한 변경 컨테이너)
@app.route("/mypage/api_downgrade/", methods=['POST'])
def api_downgrade():
    try:
        payload = find_payload()
        if payload['membership'] == '관리자':
            nickname_receive = request.form['nickname_give']
            membership = db.users.find_one({'nickname': nickname_receive})['membership']
            if membership == '관리자':
                after_membership = '승인회원'
                db.users.update_one({'nickname': nickname_receive}, {'$set': {'membership': '승인회원'}})
            elif membership == '승인회원':
                after_membership = '비승인회원'
                db.users.update_one({'nickname': nickname_receive}, {'$set': {'membership': '비승인회원'}})
            elif membership == '비승인회원':
                after_membership = '탈퇴'
                db.users.delete_one({'nickname': nickname_receive})

            save_log(payload['nickname'], '권한 변경',
                     nickname_receive + '(' + membership + ')=>(' + after_membership + ')')

            return jsonify({'result': 'SUCCESS',
                            'title': '권한 변경 성공',
                            'msg': '권한을 다운그레이드 했습니다.'
                            })
        else:
            return jsonify({'result': 'FAIL',
                            'title': '권한 변경 실패',
                            'msg': '권한이 없습니다.'
                            })
    except:
        return jsonify({'result': 'FAIL',
                        'title': '권한 변경 실패',
                        'msg': '로그인이 필요합니다.'
                        })

# 마이페이지, 포인트 관리 기능
@app.route("/mypage/api_point_management/", methods=['POST'])
def api_point_management():
    try:
        payload = find_payload()
        if payload['membership'] == '관리자':
            command_receive = request.form['command_give']
            usernickname_receive = request.form['usernickname_give']
            value_receive = int(request.form['value_give'])
            
            if (command_receive == 'find_all'):
                all_user = list(db.users.find({}, {'_id': False}))
                return_value = all_user
            elif(command_receive == 'find'):
                user = db.users.find_one({'nickname': usernickname_receive}, {'_id': False})
                if user is None:
                    return jsonify({'result': 'FAIL',
                        'title': '명령 실행 실패',
                        'msg': '해당 유저를 찾을 수 없습니다.'})
                return_value = user
            elif(command_receive == 'set'):
                user = db.users.find_one({'nickname': usernickname_receive}, {'_id': False})
                before_point = str(user['point'])
                db.users.update_one({'nickname': usernickname_receive}, {'$set': {'point': value_receive}})
                if user is None:
                    return jsonify({'result': 'FAIL',
                        'title': '명령 실행 실패',
                        'msg': '해당 유저를 찾을 수 없습니다.'})
                after_point = str(value_receive)
                save_log(payload['nickname'], '포인트 변경',user['nickname'] + '(' + before_point + ')=>(' + after_point + ')')
                return_value = 'complete command set'
                
            elif(command_receive == 'set_plus'):
                user = db.users.find_one({'nickname': usernickname_receive}, {'_id': False})
                before_point = str(user['point'])
                userpoint = user['point'] + value_receive
                db.users.update_one({'nickname': usernickname_receive}, {'$set': {'point': userpoint}})
                if user is None:
                    return jsonify({'result': 'FAIL',
                        'title': '명령 실행 실패',
                        'msg': '해당 유저를 찾을 수 없습니다.'})
                after_point = str(userpoint)
                save_log(payload['nickname'], '포인트 변경',user['nickname'] + '(' + before_point + ')=>(' + after_point + ')')
                return_value = 'complete command set_plus'
                
            elif(command_receive == 'set_minus'):
                user = db.users.find_one({'nickname': usernickname_receive}, {'_id': False})
                before_point = str(user['point'])
                userpoint = user['point'] - abs(value_receive)
                db.users.update_one({'nickname': usernickname_receive}, {'$set': {'point': userpoint}})
                if user is None:
                    return jsonify({'result': 'FAIL',
                        'title': '명령 실행 실패',
                        'msg': '해당 유저를 찾을 수 없습니다.'})
                after_point = str(userpoint)
                save_log(payload['nickname'], '포인트 변경',user['nickname'] + '(' + before_point + ')=>(' + after_point + ')')
                return_value = 'complete command set_minus'
                
            else:
                return jsonify({'result': 'FAIL',
                        'title': '명령 실행 실패',
                        'msg': '명령어를 확인해주세요.'})
            return jsonify({'result': 'SUCCESS',
                        'title': '명령 실행 성공',
                        'msg': '명령 실행을 성공했습니다.',
                        'return_value': return_value})
        else:
            return jsonify({'result': 'FAIL',
                        'title': '명령 실행 실패',
                        'msg': '권한이 없습니다.'})
    except jwt.exceptions.DecodeError:
        return jsonify({'result': 'FAIL',
                        'title': '명령 실행 실패',
                        'msg': '로그인이 필요합니다.'})


# 마이페이지, 로그 가져오기 기능 (로그 기록 컨테이너)
@app.route("/mypage/api_printlog/", methods=['GET'])
def api_printlog():
    try:
        payload = find_payload()
        if payload['membership'] == '관리자':
            all_log = list(db.logdb.find({}, {'_id': False}).sort("time", -1))

            return jsonify({'result': 'SUCCESS',
                            'title': '로그 출력 성공',
                            'msg': '전체 로그를 출력했습니다.',
                            'all_log': all_log})
        else:
            return jsonify({'result': 'FAIL',
                            'title': '로그 출력 실패',
                            'msg': '권한이 없습니다.'})
    except jwt.exceptions.DecodeError:
        return jsonify({'result': 'FAIL',
                        'title': '로그 출력 실패',
                        'msg': '로그인이 필요합니다.'})


# 마이페이지, 전체 로그 삭제 기능 (로그 기록 컨테이너)
@app.route("/mypage/api_deletelog/", methods=['GET'])
def api_deletelog():
    try:
        payload = find_payload()
        if payload['membership'] == '관리자':
            db.logdb.delete_many({})

            save_log(payload['nickname'], '로그 삭제', '로그 전체 삭제')
            return jsonify({'result': 'SUCCESS',
                            'title': '로그 삭제 성공',
                            'msg': '전체 로그를 삭제했습니다.'
                            })
        else:
            return jsonify({'result': 'SUCCESS',
                            'title': '로그 삭제 실패',
                            'msg': '권한이 없습니다.'
                            })
    except:
        return jsonify({'result': 'FAIL',
                        'title': '로그 삭제 실패',
                        'msg': '로그인이 필요합니다.'})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True, threaded=True)