function openLoginContainer(){
    $('.btn_container').css('display','none');
    $('.login_container').css('display','flex');
}
function openSignupContainer(){
    $('.btn_container').css('display','none');
    $('.signup_container').css('display','flex');
}

//로그인 버튼 클릭시, 로그인 기능
function onLogin(){
    //email과 pw를 받아서
    let email = $('#login_email').val()
    let pw = $('#login_pw').val()

    //data에 넣어서 보내주기
    $.ajax({
            type: 'POST',
            url: '/api_login/',
            dataType: 'json',
            data: {
                'email_give': email,
                'pw_give': pw,
            },
        success: function (response) {
            //로그인 성공일때, 받아온 토큰값을 mytoken값으로 지정, 메인화면으로 이동
            if (response['result'] == 'SUCCESS') {
                $.cookie('mytoken', response['token'], {expires: 30, path: '/'});

                Swal.fire({
                    title: response['title'],
                    text: response['msg'],
                    icon: 'success',
                    confirmButtonColor: '#5b7d97',
                }).then((result) => {
                    if (response['membership'] == '비승인회원'){
                        document.location = '/needallow/';
                    }
                    else {
                        document.location = '/';
                    }

                })
            }
                //로그인 실패일때, 문자 출력
            else {
                Swal.fire({
                    title: response['title'],
                    text: response['msg'],
                    icon: 'error',
                    confirmButtonColor: '#5b7d97',
                })
            }
        }
    })
}

//로그인 컨테이너 닫기, 버튼 컨테이너 열기
function closeLoginContainer(){
    $('.login_container').css('display','none');
    $('.btn_container').css('display','flex');
}

//회원가입 버튼 클릭시, 회원가입 기능
function save_signup(){
    // email 정규식: 이메일 체크
    const emailRegex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

    // pw 정규식: 8~16글자 영문, 숫자, 특수문자 사용
    const pwRegex = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;

    // nickname 정규식: 2~5글자 한글, 영문, 숫자 사용
    const nicknameRegex = /^([a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]).{1,5}$/;

    let email = $('#signup_email').val()
    let pw = $('#signup_pw').val()
    let nickname = $('#signup_nickname').val()
    let class1 = $('#class1').val()
    let class2 = $('#class2').val()
    let class3 = $('#class3').val()
    let class4 = $('#class4').val()
    let class5 = $('#class5').val()
    let class6 = $('#class6').val()

    //규정된 정규식의 유형과 같다면 data로 묶어서 보내주기
    if (emailRegex.test(email) && pwRegex.test(pw) && nicknameRegex.test(nickname)) {
        $.ajax({
            type: 'POST',
            url: '/api_signup/',
            dataType: 'json',
            data: {
                'email_give': email,
                'pw_give': pw,
                'nickname_give': nickname,
                'class_give1': class1,
                'class_give2': class2,
                'class_give3': class3,
                'class_give4': class4,
                'class_give5': class5,
                'class_give6': class6,
            },
            success: function (response) {
                if(response['result'] == 'SUCCESS'){
                    Swal.fire({
                        title: response['title'],
                        text: response['msg'],
                        icon: 'success',
                        confirmButtonColor: '#5b7d97',
                    }).then((result) => {
                        document.location = '/';
                    })
                }
                //서버 리턴값이 ERROR면 함수종료
                else {
                    Swal.fire({
                        title: response['title'],
                        text: response['msg'],
                        icon: 'error',
                        confirmButtonColor: '#5b7d97',
                    })
                    return 0;
                }
            }
        })
    }
    else if(emailRegex.test(email) == false){
        Swal.fire({
                    title: '회원가입 실패',
                    text: '이메일 형식이 올바르지 않습니다.',
                    icon: 'error',
                    confirmButtonColor: '#5b7d97',
                })
        return 0;
    }
    else if(pwRegex.test(pw) == false){
        Swal.fire({
                    title: '회원가입 실패',
                    text: '비밀번호 형식이 올바르지 않습니다.',
                    icon: 'error',
                    confirmButtonColor: '#5b7d97',
                })
        return 0;
    }
    else if(nicknameRegex.test(nickname) == false){
        Swal.fire({
                    title: '회원가입 실패',
                    text: '닉네임 형식이 올바르지 않습니다.',
                    icon: 'error',
                    confirmButtonColor: '#5b7d97',
                })
        return 0;
    }
    //혹시모를 수 있는 에러를 위해
    else{
        Swal.fire({
                    title: '회원가입 실패',
                    text: '개발자한테 신고하세요!!',
                    icon: 'error',
                    confirmButtonColor: '#5b7d97',
                })
        return 0;
    }
}

//회원가입 컨테이너 닫기, 버튼 컨테이너 열기
function closeSignupContainer(){
    $('.signup_container').css('display','none');
    $('.btn_container').css('display','flex');
}

//input 포커스시, label의 색상도 바꿔주기
$('input').focus(function (){
    $(this).prev($('label')).css('color','var(--color_deep_dark)')
})
$('input').blur(function (){
    $(this).prev($('label')).css('color','var(--color_dark')
})

//select 포커스시, label의 색상도 바꿔주기
$('select').focus(function (){
    $(this).prev($('label')).css('color','var(--color_deep_dark)')
})
$('select').blur(function (){
    $(this).prev($('label')).css('color','var(--color_dark')
})