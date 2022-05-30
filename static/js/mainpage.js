$(document).ready(function () {
  checkLogin();
  printAnnouncement();
  printPatchnote();
  slideAd();
});

// 로그인 체크
function checkLogin() {
  $.ajax({
    type: "GET",
    url: "/api_mainpage_check_login/",
    dataType: "json",
    data: {},
    success: function (response) {
      // 로그인시
      if (response["result"] == "SUCCESS") {
        // 로그인 안내문
        tempHtml = `<div id="login_announcement">
        <div class="login_announcement_section">
        <h1>안녕하세요! ${response["nickname"]}님!</h1>
        </div>
        <div class="login_announcement_section">
        <p id="btn_goto_mypage">마이페이지</P>
        <p id="btn_logout">로그아웃</P>
        </div>
        </div>`;
        $(".item_login").append(tempHtml);
        // 문의 버튼
        tempHtml = `<div id="btn_open_questions_container">문의</div>`;
        $(".item_questions").append(tempHtml);
        // 문의 창
        tempHtml = `<div id="questions_container">
        <div id="questions_box">
          <div id="questions_title">
            문의
            <div id="btn_close_questions_container">
              <i class="bi bi-x-lg"></i>
            </div>
          </div>
          <div id="questions_content">
            <input id="questions_input" type="text" />
            <div id="questions_comment">
              <p>문의는 공지, 패치노트를 통해 답변드리겠습니다.</p>
              <p>
                급하시거나 중요한 내용은 디스코드, 이메일 이용 부탁드립니다.
              </p>
              <p>디스코드 : 꿀주먹#1868</p>
              <p>이메일 : bkws04211@naver.com</p>
            </div>
            <div id="btn_send_questions">문의하기</div>
          </div>
        </div>
      </div>`;
        $("footer").append(tempHtml);
        // 가입된 길드가 없을 때
        if (response["guild"] == "") {
          // 길드생성, 길드가입 버튼
          let tempHtml = `<div id="btn_open_create_guild">길드생성</div>
          <div id="btn_open_join_guild">길드가입</div>`;
          $(".item_guild").append(tempHtml);
          // 길드생성 창, 길드가입 창
          tempHtml = `<div id="create_guild_container">
          <div id="create_guild_box">
            <div id="create_guild_title">
              길드생성
              <div id="btn_close_create_guild"><i class="bi bi-x-lg"></i></div>
            </div>
            <div id="create_guild_content">
              <label for="create_guild_name">길드이름</label>
              <input id="create_guild_name" type="text" />
              <label for="create_guild_password">비밀번호</label>
              <input id="create_guild_password" type="password" />
              <label for="create_guild_check_password">비밀번호 확인</label>
              <input id="create_guild_check_password" type="password" />
              <div id="btn_create_guild">길드생성</div>
            </div>
          </div>
        </div>
        <div id="join_guild_container">
          <div id="join_guild_box">
            <div id="join_guild_title">
              길드가입
              <div id="btn_close_join_guild"><i class="bi bi-x-lg"></i></div>
            </div>
            <div id="join_guild_content">
              <label for="join_guild_name">길드이름</label>
              <input id="join_guild_name" type="text" />
              <label for="join_guild_password">비밀번호</label>
              <input id="join_guild_password" type="password" />
              <div id="btn_join_guild">길드가입</div>
            </div>
          </div>
        </div>`;
          $("footer").append(tempHtml);
        }
        // 가입된 길드가 있을 때
        else {
          tempHtml = `<div id="btn_goto_myguild">
          <p>길드 : ${response["guild"]}</p>
          <p>권한 : ${response["membership"]}</p>
          <p>사용자 권한은 관리자의 승인이 필요합니다.</p>
          </div>`;
          $(".item_guild").append(tempHtml);
        }
        // 관리자 계정
        if (response["membership"] == "관리자") {
          tempHtml = `<div id="btn_management"><i class="bi bi-tools"></i></div>`;
          $("#btn_container").append(tempHtml);
        }
      }
      // 비로그인시
      else {
        // 로그인, 회원가입 버튼
        let tempHtml = `<div id="btn_open_login">로그인</div><div id="btn_open_signup">회원가입</div>`;
        $(".item_login").append(tempHtml);
        // 로그인 창, 회원가입 창
        tempHtml = `<div id="login_container">
        <div id="login_box">
          <div id="login_title">
            로그인
            <div id="btn_close_login"><i class="bi bi-x-lg"></i></div>
          </div>
          <div id="login_content">
            <label for="login_email">이메일</label>
            <input id="login_email" type="email" />
            <label for="login_password">비밀번호</label>
            <input id="login_password" type="password" />
            <div id="btn_login">로그인</div>
          </div>
        </div>
      </div>
      <div id="signup_container">
        <div id="signup_box">
          <div id="signup_title">
            회원가입
            <div id="btn_close_signup"><i class="bi bi-x-lg"></i></div>
          </div>
          <div id="signup_content">
            <label for="signup_email">이메일</label>
            <input required id="signup_email" type="email" / placeholder="이메일 형식으로 입력">
            <label for="signup_password">비밀번호</label>
            <input required id="signup_password" type="password" / placeholder="8~16글자 영문, 숫자, 특수문자 입력">
            <label for="signup_check_password">비밀번호 확인</label>
            <input required id="signup_check_password" type="password" / placeholder="비밀번호 재입력">
            <label for="signup_nickname">닉네임</label>
            <input required id="signup_nickname" type="text" / placeholder="2~6글자 한글, 영문, 숫자 입력">

            <label for="signup_class1">캐릭터1</label>
            <select
              id="signup_class1"
              name="signup_class1"
              class="signup_class"
            >
              <option></option>
              <option>디스트로이어</option>
              <option>버서커</option>
              <option>워로드</option>
              <option>홀리나이트</option>
              <option>기공사</option>
              <option>배틀마스터</option>
              <option>스트라이커</option>
              <option>인파이터</option>
              <option>창술사</option>
              <option>건슬링어</option>
              <option>데빌헌터</option>
              <option>블래스터</option>
              <option>스카우터</option>
              <option>호크아이</option>
              <option>바드</option>
              <option>서머너</option>
              <option>소서리스</option>
              <option>아르카나</option>
              <option>데모닉</option>
              <option>리퍼</option>
              <option>블레이드</option>
              <option>도화가</option>
            </select>
            <label for="signup_class1">캐릭터2</label>
            <select
              id="signup_class2"
              name="signup_class2"
              class="signup_class"
            >
              <option></option>
              <option>디스트로이어</option>
              <option>버서커</option>
              <option>워로드</option>
              <option>홀리나이트</option>
              <option>기공사</option>
              <option>배틀마스터</option>
              <option>스트라이커</option>
              <option>인파이터</option>
              <option>창술사</option>
              <option>건슬링어</option>
              <option>데빌헌터</option>
              <option>블래스터</option>
              <option>스카우터</option>
              <option>호크아이</option>
              <option>바드</option>
              <option>서머너</option>
              <option>소서리스</option>
              <option>아르카나</option>
              <option>데모닉</option>
              <option>리퍼</option>
              <option>블레이드</option>
              <option>도화가</option>
            </select>
            <label for="signup_class1">캐릭터3</label>
            <select
              id="signup_class3"
              name="signup_class3"
              class="signup_class"
            >
              <option></option>
              <option>디스트로이어</option>
              <option>버서커</option>
              <option>워로드</option>
              <option>홀리나이트</option>
              <option>기공사</option>
              <option>배틀마스터</option>
              <option>스트라이커</option>
              <option>인파이터</option>
              <option>창술사</option>
              <option>건슬링어</option>
              <option>데빌헌터</option>
              <option>블래스터</option>
              <option>스카우터</option>
              <option>호크아이</option>
              <option>바드</option>
              <option>서머너</option>
              <option>소서리스</option>
              <option>아르카나</option>
              <option>데모닉</option>
              <option>리퍼</option>
              <option>블레이드</option>
              <option>도화가</option>
            </select>
            <label for="signup_class1">캐릭터4</label>
            <select
              id="signup_class4"
              name="signup_class4"
              class="signup_class"
            >
              <option></option>
              <option>디스트로이어</option>
              <option>버서커</option>
              <option>워로드</option>
              <option>홀리나이트</option>
              <option>기공사</option>
              <option>배틀마스터</option>
              <option>스트라이커</option>
              <option>인파이터</option>
              <option>창술사</option>
              <option>건슬링어</option>
              <option>데빌헌터</option>
              <option>블래스터</option>
              <option>스카우터</option>
              <option>호크아이</option>
              <option>바드</option>
              <option>서머너</option>
              <option>소서리스</option>
              <option>아르카나</option>
              <option>데모닉</option>
              <option>리퍼</option>
              <option>블레이드</option>
              <option>도화가</option>
            </select>
            <label for="signup_class1">캐릭터5</label>
            <select
              id="signup_class5"
              name="signup_class5"
              class="signup_class"
            >
              <option></option>
              <option>디스트로이어</option>
              <option>버서커</option>
              <option>워로드</option>
              <option>홀리나이트</option>
              <option>기공사</option>
              <option>배틀마스터</option>
              <option>스트라이커</option>
              <option>인파이터</option>
              <option>창술사</option>
              <option>건슬링어</option>
              <option>데빌헌터</option>
              <option>블래스터</option>
              <option>스카우터</option>
              <option>호크아이</option>
              <option>바드</option>
              <option>서머너</option>
              <option>소서리스</option>
              <option>아르카나</option>
              <option>데모닉</option>
              <option>리퍼</option>
              <option>블레이드</option>
              <option>도화가</option>
            </select>
            <label for="signup_class1">캐릭터6</label>
            <select
              id="signup_class6"
              name="signup_class6"
              class="signup_class"
            >
              <option></option>
              <option>디스트로이어</option>
              <option>버서커</option>
              <option>워로드</option>
              <option>홀리나이트</option>
              <option>기공사</option>
              <option>배틀마스터</option>
              <option>스트라이커</option>
              <option>인파이터</option>
              <option>창술사</option>
              <option>건슬링어</option>
              <option>데빌헌터</option>
              <option>블래스터</option>
              <option>스카우터</option>
              <option>호크아이</option>
              <option>바드</option>
              <option>서머너</option>
              <option>소서리스</option>
              <option>아르카나</option>
              <option>데모닉</option>
              <option>리퍼</option>
              <option>블레이드</option>
              <option>도화가</option>
            </select>
            <div id="btn_signup">회원가입</div>
          </div>
        </div>
      </div>`;
        $("footer").append(tempHtml);
        // 길드 안내문
        tempHtml = `<div id="guild_announcement">로그인이 필요합니다.</div>`;
        $(".item_guild").append(tempHtml);
        // 문의 안내문
        tempHtml = `<div id="questions_announcement">로그인이 필요합니다.</div>`;
        $(".item_questions").append(tempHtml);
      }
    },
  });
}

// 공지 가져오기
function printAnnouncement() {
  $.ajax({
    type: "GET",
    url: "/api_mainpage_print_announcement/",
    dataType: "json",
    data: {},
    success: function (response) {
      if (response["result"] == "SUCCESS") {
        $("#announcement_content").val(response["announcement"]["content"]);
        $("#announcement_comment").text(response["announcement"]["time"]);
      }
    },
  });
}

// 패치노트 가져오기
function printPatchnote() {
  $.ajax({
    type: "GET",
    url: "/api_mainpage_print_patchnote/",
    dataType: "json",
    data: {},
    success: function (response) {
      if (response["result"] == "SUCCESS") {
        let patchnotes = response["patchnotes"];
        let tempHtml = `<div class="patchnote_item">
          <div class="patchnote_item_title">${patchnotes[0]["time"]}</div>
          <textarea readonly class="patchnote_item_content">${patchnotes[0]["content"]}</textarea>
        </div>`;

        $("#patchnote_content").append(tempHtml);
        $(".patchnote_item_content").css(
          "height",
          $(".patchnote_item_content").prop("scrollHeight")
        );
        for (let i = 0; i < patchnotes.length; i++) {
          tempHtml = `<div class="detail_patchnote_item">
          <div class="detail_patchnote_item_title">
            ${patchnotes[i]["time"]}<i class="bi bi-caret-down"></i>
          </div>
          <textarea readonly class="detail_patchnote_item_content">
            ${patchnotes[i]["content"]}
          </textarea>
        </div>`;
          $("#detail_patchnote_content").append(tempHtml);
        }
      }
    },
  });
}

// 광고섹션, 자동 슬라이드
function slideAd() {
  let slideWrap = $(".slide_wrap");
  let curIndex = 1;
  setInterval(function () {
    slideWrap
      .css("transition", "0.5s")
      .css("transform", `translate3d(${curIndex * -1000}px, 0px, 0px)`);
    curIndex++;
    if (curIndex == 4) {
      setTimeout(function () {
        slideWrap.css("transition", "0s");
        slideWrap.css("transform", `translate3d(0px, 0px, 0px)`);
      }, 501);
      curIndex = 1;
    }
  }, 5000);
}

// 로그인 창, 열기
$(document).on("click", "#btn_open_login", function () {
  $("#login_container").css("display", "flex");
});

// 로그인 창, 닫기
$(document).on("click", "#btn_close_login", function () {
  $("#login_container").css("display", "none");
});
// 로그인 기능
$(document).on("click", "#btn_login", function () {
  let email = $("#login_email").val();
  let pw = $("#login_password").val();

  $.ajax({
    type: "POST",
    url: "/api_login/",
    dataType: "json",
    data: {
      email_give: email,
      pw_give: pw,
    },
    success: function (response) {
      //로그인 성공일때, 받아온 토큰값을 mytoken값으로 지정, 메인화면으로 이동
      if (response["result"] == "SUCCESS") {
        $.cookie("mytoken", response["token"], { expires: 30, path: "/" });

        Swal.fire({
          title: response["title"],
          text: response["msg"],
          icon: "success",
          confirmButtonColor: "#5b7d97",
        }).then((result) => {
          document.location = "/";
        });
      }
      //로그인 실패일때, 문자 출력
      else {
        Swal.fire({
          title: response["title"],
          text: response["msg"],
          icon: "error",
          confirmButtonColor: "#5b7d97",
        });
      }
    },
  });
});

// 회원가입 창, 열기
$(document).on("click", "#btn_open_signup", function () {
  $("#signup_container").css("display", "flex");
});

// 회원가입 창, 닫기
$(document).on("click", "#btn_close_signup", function () {
  $("#signup_container").css("display", "none");
});

// 회원가입 기능
$(document).on("click", "#btn_signup", function () {
  // email 정규식: 이메일 체크
  const emailRegex =
    /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

  // pw 정규식: 8~16글자 영문, 숫자, 특수문자 사용
  const pwRegex =
    /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;

  // nickname 정규식: 2~5글자 한글, 영문, 숫자 사용
  const nicknameRegex = /^([a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]).{1,5}$/;

  let email = $("#signup_email").val();
  let pw = $("#signup_password").val();
  let pwCheck = $("#signup_check_password").val();
  let nickname = $("#signup_nickname").val();
  let class1 = $("#signup_class1").val();
  let class2 = $("#signup_class2").val();
  let class3 = $("#signup_class3").val();
  let class4 = $("#signup_class4").val();
  let class5 = $("#signup_class5").val();
  let class6 = $("#signup_class6").val();

  if (pw != pwCheck) {
    Swal.fire({
      title: "회원가입 실패",
      text: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
      icon: "error",
      confirmButtonColor: "#5b7d97",
    });
    return 0;
  }

  //규정된 정규식의 유형과 같다면 data로 묶어서 보내주기
  if (
    emailRegex.test(email) &&
    pwRegex.test(pw) &&
    nicknameRegex.test(nickname)
  ) {
    $.ajax({
      type: "POST",
      url: "/api_signup/",
      dataType: "json",
      data: {
        email_give: email,
        pw_give: pw,
        nickname_give: nickname,
        class_give1: class1,
        class_give2: class2,
        class_give3: class3,
        class_give4: class4,
        class_give5: class5,
        class_give6: class6,
      },
      success: function (response) {
        if (response["result"] == "SUCCESS") {
          Swal.fire({
            title: response["title"],
            text: response["msg"],
            icon: "success",
            confirmButtonColor: "#5b7d97",
          }).then((result) => {
            document.location = "/";
          });
        }
        //서버 리턴값이 ERROR면 함수종료
        else {
          Swal.fire({
            title: response["title"],
            text: response["msg"],
            icon: "error",
            confirmButtonColor: "#5b7d97",
          });
          return 0;
        }
      },
    });
  } else if (emailRegex.test(email) == false) {
    Swal.fire({
      title: "회원가입 실패",
      text: "이메일 형식이 올바르지 않습니다.",
      icon: "error",
      confirmButtonColor: "#5b7d97",
    });
    return 0;
  } else if (pwRegex.test(pw) == false) {
    Swal.fire({
      title: "회원가입 실패",
      text: "비밀번호 형식이 올바르지 않습니다.",
      icon: "error",
      confirmButtonColor: "#5b7d97",
    });
    return 0;
  } else if (nicknameRegex.test(nickname) == false) {
    Swal.fire({
      title: "회원가입 실패",
      text: "닉네임 형식이 올바르지 않습니다.",
      icon: "error",
      confirmButtonColor: "#5b7d97",
    });
    return 0;
  }
  //혹시모를 수 있는 에러를 위해
  else {
    Swal.fire({
      title: "회원가입 실패",
      text: "개발자한테 신고하세요!!",
      icon: "error",
      confirmButtonColor: "#5b7d97",
    });
    return 0;
  }
});

// 로그인 안내문, 마이페이지 버튼
$(document).on("click", "#btn_goto_mypage", function () {
  window.location.href = "/mypage/";
});

// 로그인 안내문, 로그아웃 버튼
$(document).on("click", "#btn_logout", function () {
  $.removeCookie("mytoken", { path: "/" });
  Swal.fire({
    title: "로그아웃 성공",
    text: "로그아웃을 성공했습니다.",
    icon: "success",
    confirmButtonColor: "#5b7d97",
  }).then((result) => {
    location.href = "/";
  });
});

// 나의 길드 스케줄 열기
$(document).on("click", "#btn_goto_myguild", function () {
  window.location.replace("/thisweeksch/");
});

// 길드생성 창, 열기
$(document).on("click", "#btn_open_create_guild", function () {
  $("#create_guild_container").css("display", "flex");
});

// 길드생성 창, 닫기
$(document).on("click", "#btn_close_create_guild", function () {
  $("#create_guild_container").css("display", "none");
});

// 길드생성 기능
$(document).on("click", "#btn_create_guild", function () {
  let guildName = $("#create_guild_name").val();
  let guildPw = $("#create_guild_password").val();
  let guildPwCheck = $("#create_guild_check_password").val();
  // 비밀번호와 비밀번호 확인이 일치하지 않을 때
  if (guildPw != guildPwCheck) {
    Swal.fire({
      title: "길드생성 실패",
      text: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
      icon: "error",
      confirmButtonColor: "#5b7d97",
    });
    return 0;
  }
  $.ajax({
    type: "POST",
    url: "/api_create_guild/",
    dataType: "json",
    data: {
      guild_name_give: guildName,
      guild_pw_give: guildPw,
    },
    success: function (response) {
      // 길드생성 성공
      if (response["result"] == "SUCCESS") {
        $.removeCookie("mytoken", { path: "/" });
        $.cookie("mytoken", response["token"], { expires: 30, path: "/" });
        Swal.fire({
          title: response["title"],
          text: response["msg"],
          icon: "success",
          confirmButtonColor: "#5b7d97",
        }).then((result) => {
          location.reload();
        });
      }
      // 길드생성 실패
      else {
        Swal.fire({
          title: response["title"],
          text: response["msg"],
          icon: "error",
          confirmButtonColor: "#5b7d97",
        }).then((result) => {
          location.reload();
        });
      }
    },
  });
});

// 길드가입 창, 열기
$(document).on("click", "#btn_open_join_guild", function () {
  $("#join_guild_container").css("display", "flex");
});
// 길드가입 창, 닫기
$(document).on("click", "#btn_close_join_guild", function () {
  $("#join_guild_container").css("display", "none");
});

// 길드가입 기능
$(document).on("click", "#btn_join_guild", function () {
  let guildName = $("#join_guild_name").val();
  let guildPw = $("#join_guild_password").val();
  // 비밀번호와 비밀번호 확인이 일치하지 않을 때
  $.ajax({
    type: "POST",
    url: "/api_join_guild/",
    dataType: "json",
    data: {
      guild_name_give: guildName,
      guild_pw_give: guildPw,
    },
    success: function (response) {
      // 길드가입 성공
      if (response["result"] == "SUCCESS") {
        $.removeCookie("mytoken", { path: "/" });
        $.cookie("mytoken", response["token"], { expires: 30, path: "/" });
        Swal.fire({
          title: response["title"],
          text: response["msg"],
          icon: "success",
          confirmButtonColor: "#5b7d97",
        }).then((result) => {
          location.reload();
        });
      }
      // 길드생성 실패
      else {
        Swal.fire({
          title: response["title"],
          text: response["msg"],
          icon: "error",
          confirmButtonColor: "#5b7d97",
        }).then((result) => {
          location.reload();
        });
      }
    },
  });
});

// 문의 창 열기
$(document).on("click", "#btn_open_questions_container", function () {
  $("#questions_container").css("display", "flex");
});
// 문의 창 닫기
$(document).on("click", "#btn_close_questions_container", function () {
  $("#questions_container").css("display", "none");
});
// 문의 기능
$(document).on("click", "#btn_send_questions", function () {
  let question = $("#questions_input").val();
  $.ajax({
    type: "POST",
    url: "/api_mainpage_question/",
    dataType: "json",
    data: {
      question_give: question,
    },
    success: function (response) {
      // 문의하기 성공
      if (response["result"] == "SUCCESS") {
        Swal.fire({
          title: response["title"],
          text: response["msg"],
          icon: "success",
          confirmButtonColor: "#5b7d97",
        }).then((result) => {
          location.reload();
        });
      }
      // 문의하기 실패
      else {
        Swal.fire({
          title: response["title"],
          text: response["msg"],
          icon: "error",
          confirmButtonColor: "#5b7d97",
        }).then((result) => {
          location.reload();
        });
      }
    },
  });
});

// 세부 패치노트 창 열기
$(document).on("click", ".item_patchnote", function () {
  $("#detail_patchnote_container").css("display", "flex");
});
// 세부 패치노트 창 닫기
$(document).on("click", "#btn_close_detail_patchnote_container", function () {
  $("#detail_patchnote_container").css("display", "none");
});
// 세부 패치노트 창, 내용 열기
$(document).on(
  "click",
  ".detail_patchnote_item_title .bi-caret-down",
  function () {
    $(this).attr("class", "bi bi-caret-up");
    $(this)
      .closest(".detail_patchnote_item")
      .children(".detail_patchnote_item_content")
      .css("display", "flex");
  }
);
// 세부 패치노트 창, 내용 닫기
$(document).on(
  "click",
  ".detail_patchnote_item_title .bi-caret-up",
  function () {
    $(this).attr("class", "bi bi-caret-down");
    $(this)
      .closest(".detail_patchnote_item")
      .children(".detail_patchnote_item_content")
      .css("display", "none");
  }
);

// 클릭시, 링크 창 열기
// 로스트아크 공홈
$(document).on("click", ".item_officalwebsite", function () {
  window.open("https://lostark.game.onstove.com/");
});
// 로아와
$(document).on("click", ".item_loawa", function () {
  window.open("https://loawa.com/");
});
// 로아인벤
$(document).on("click", ".item_lostarkinven", function () {
  window.open("https://lostark.inven.co.kr/");
});
// 빈아크
$(document).on("click", ".item_bynnark", function () {
  window.open("https://ark.bynn.kr/");
});
// 통합디코
$(document).on("click", ".item_integrationdiscord", function () {
  window.open("https://discord.com/invite/lark");
});
// 아이스펭
$(document).on("click", ".item_icepang", function () {
  window.open("https://loa.icepeng.com/");
});

// 버튼 컨테이너
// 관리 사이트
$(document).on("click", "#btn_management", function () {
  window.location.replace("/management_for_admin/");
});
