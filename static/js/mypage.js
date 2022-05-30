$(document).ready(function () {
  printUserInfo();
  findMyGuildInfo();
  checkMembership();
});
//내 정보 수정의 유저 정보 넣어주기(이메일, 닉네임, 권한 등)
function printUserInfo() {
  $("#change_class1")
    .val($(".myinfo_container").attr("data-class1"))
    .prop("selected", true);
  $("#change_class2")
    .val($(".myinfo_container").attr("data-class2"))
    .prop("selected", true);
  $("#change_class3")
    .val($(".myinfo_container").attr("data-class3"))
    .prop("selected", true);
  $("#change_class4")
    .val($(".myinfo_container").attr("data-class4"))
    .prop("selected", true);
  $("#change_class5")
    .val($(".myinfo_container").attr("data-class5"))
    .prop("selected", true);
  $("#change_class6")
    .val($(".myinfo_container").attr("data-class6"))
    .prop("selected", true);
}

// 내 길드 정보 가져오기
function findMyGuildInfo() {
  $.ajax({
    type: "GET",
    url: "/mypage/api_find_myguildinfo/",
    dataType: "json",
    data: {},
    success: function (response) {
      if (response["result"] == "SUCCESS") {
        let tempHtml = `<div class="guild_btn btn_leave_site">
            사이트탈퇴
          </div>`;
        $("#guild_content").append(tempHtml);
        $(".guild_item_guildname .guild_item_content").text(response["guild"]);
        if (response["guild"] != "") {
          $(".guild_item_guildmember .guild_item_content").text(
            response["guildmember"]
          );
          if (
            response["membership"] == "관리자" ||
            response["membership"] == "길드마스터"
          ) {
            let tempHtml = `<div class="guild_btn btn_delete_guild">
            길드삭제
          </div>`;
            $("#guild_content").append(tempHtml);
          } else {
            let tempHtml = `<div class="guild_btn btn_leave_guild">
            길드탈퇴
          </div>`;
            $("#guild_content").append(tempHtml);
          }
        }
      }
    },
  });
}
// 사이트 탈퇴 기능
$(document).on("click", ".btn_leave_site", function () {
  Swal.fire({
    title: "사이트에서 탈퇴하시겠습니까?",
    text: "다음에는 더 좋은 모습으로 뵙겠습니다.",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#5b7d97",
    cancelButtonColor: "#bbdefb",
    confirmButtonText: "YES",
    cancelButtonText: "NO",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: "GET",
        url: "/mypage/api_leave_site/",
        dataType: "json",
        data: {},
        success: function (response) {
          if (response["result"] == "SUCCESS") {
            $.removeCookie("mytoken", { path: "/" });
            Swal.fire({
              title: response["title"],
              text: response["msg"],
              icon: "success",
              confirmButtonColor: "#5b7d97",
            }).then((result) => {
              location.href = "/";
            });
          } else {
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
    }
  });
});

// 길드 탈퇴 기능
$(document).on("click", ".btn_leave_guild", function () {
  $.ajax({
    type: "GET",
    url: "/mypage/api_leave_guild/",
    dataType: "json",
    data: {},
    success: function (response) {
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
      } else {
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

// 길드 삭제 기능
$(document).on("click", ".btn_delete_guild", function () {
  Swal.fire({
    title: "길드를 삭제하겠습니까?",
    text: "삭제한 길드는 되돌릴 수 없습니다.",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#5b7d97",
    cancelButtonColor: "#bbdefb",
    confirmButtonText: "YES",
    cancelButtonText: "NO",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: "GET",
        url: "/mypage/api_delete_guild/",
        dataType: "json",
        data: {},
        success: function (response) {
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
          } else {
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
    }
  });
});
//권한을 확인하여 '관리자'이면 '공지 수정', '회원 권한 수정', '로그 기록' 넣어주고 데이터 넣어주기
function checkMembership() {
  if (
    $(".myinfo_container").attr("data-membership") == "관리자" ||
    $(".myinfo_container").attr("data-membership") == "길드마스터" ||
    $(".myinfo_container").attr("data-membership") == "길드임원"
  ) {
    pushAnnouncementContainer();
    pushGradeContainer();
    pushPointManagementContainer();
    pushlogContainer();
    findUsersInfoAndAnnouncement();
    pushAnnouncementContent();
  }
}

//공지 수정 컨테이너 넣어주기
function pushAnnouncementContainer() {
  //메인 공지 수정 컨테이너 추가
  let announcementHtml = `<div class="announcement_wrap">
                                <div class="announcement_container">
                                    <div class="announcement_title">
                                        <h1>메인 공지 수정</h1>
                                        <div onclick="changeMainAnnouncement()" class="btn_change_announcement">수정</div>
                                    </div>
                                    <div class="main_announcement_content">
                                        <textarea></textarea>
                                    </div>
                                </div>
                                <div class="announcement_container">
                                    <div class="announcement_title">
                                        <h1>인력사무소 공지 수정</h1>
                                        <div onclick="changeResourceofficeAnnouncement()" class="btn_change_announcement">수정</div>
                                    </div>
                                    <div class="resourceoffice_announcement_content">
                                        <textarea></textarea>
                                    </div>
                                </div>
                            </div>`;
  $("#mypage_container").append(announcementHtml);
}

//공지 수정 컨테이너 내용 넣어주기
function pushAnnouncementContent() {
  $.ajax({
    type: "GET",
    url: "/mypage/api_print_announcement/",
    dataType: "json",
    data: {},
    success: function (response) {
      if (response["result"] == "SUCCESS") {
        $(".main_announcement_content > textarea").val(
          response["main_announcement"]
        );
        $(".resourceoffice_announcement_content > textarea").val(
          response["resourceoffice_announcement"]
        );
      } else {
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
}

//회원 권한 수정 컨테이너 넣어주기
function pushGradeContainer() {
  let gradeHtml = `
                    <div class="grade_container">
                    <div class="grade_title">회원 권한 수정</div>
                    <div class="grade_content">
                      <div id="guildmaster" class="grade_box">
                        <div class="grade_box_title">길드마스터</div>
                        <div class="grade_box_content"></div>
                      </div>
                      <div id="guildstaff" class="grade_box">
                        <div class="grade_box_title">길드임원</div>
                        <div class="grade_box_content"></div>
                      </div>
                      <div id="guildmember" class="grade_box">
                        <div class="grade_box_title">길드원</div>
                        <div class="grade_box_content"></div>
                      </div>
                      <div id="guildnonemember" class="grade_box">
                        <div class="grade_box_title">사용자</div>
                        <div class="grade_box_content"></div>
                      </div>
                    </div>
                  </div>`;
  $("#mypage_container").append(gradeHtml);
}

// 포인트 관리 컨테이너 넣어주기
function pushPointManagementContainer() {
  let tempHtml = `<div class="point_management_container">
                    <div class="point_management_title">
                    <h1>포인트 관리</h1>
                    </div>
                    <div class="point_management_content">
                    <div class="point_management_manual">
                        #사용방법#<br />
                        모니터링 창 초기화 : clear<br />
                        전체 회원 포인트 조회 : find_all<br />
                        선택 회원 포인트 조회 : find 닉네임<br />
                        선택 회원 포인트 변경 : set 닉네임 변경할값 {ex) set 모코코 3000 =>
                        모코코 포인트를 3000으로 변경}<br />
                        선택 회원 포인트 추가 : set 닉네임 +추가할값 {ex) set 모코코 +3000
                        => 모코코 기존 포인트에서 3000포인트 추가}<br />
                        선택 회원 포인트 차감 : set 닉네임 -차감할값 {ex) set 모코코 -3000
                        => 모코코 기존 포인트에서 3000포인트 차감}
                    </div>
                    <div class="point_management_Monitor">
                        <p>명령 대기중...</p>
                    </div>
                    <input
                        type="text"
                        name="point_management_command_box"
                        id="point_management_command_box"
                        placeholder=">"
                    >
                    </div>
                </div>`;
  $("#mypage_container").append(tempHtml);
}

//로그 기록 컨테이너 넣어주기
function pushlogContainer() {
  let logHtml = `<div class="log_container">
        <div class="log_title">
            <div onclick="deleteLog()" class="btn_delete_log">삭제</div>
            <h1>로그 기록</h1>
            <div onclick="printLog()" class="btn_print_log">출력</div>
        </div>
        <div class="log_content"></div>
    </div>`;
  $("#mypage_container").append(logHtml);
}

//DB에 저장된 공지값과 권한별 유저정보를 가져와서 넣어주기
function findUsersInfoAndAnnouncement() {
  $.ajax({
    type: "GET",
    url: "/mypage/api_find_announcement&userbymembership/",
    dataType: "json",
    data: {},
    success: function (response) {
      if (response["result"] == "SUCCESS") {
        //'공지 수정'칸에 저장되있던 공지값 넣어주기
        let announcement = $(".announcement_content textarea");
        announcement.val(response["announcement"]);

        //회원정보를 db에서 가져와서 권한별로 넣어주기
        let user_nickname;
        let user_email;
        let temp_html;
        //길드마스터 가져와서, 넣어주기
        for (let i = 0; i < response["users_guildmaster"].length; i++) {
          user_nickname = response["users_guildmaster"][i]["nickname"];
          user_email = response["users_guildmaster"][i]["email"];
          temp_html = `<div class="user-item">
                                <div class="user-item_nickname">${user_nickname}</div>
                                <div class="user-item_email">${user_email}</div>
                            </div>`;
          $("#guildmaster > .grade_box_content").append(temp_html);
        }

        //길드임원 가져와서, 넣어주기
        for (let i = 0; i < response["users_guildstaff"].length; i++) {
          user_nickname = response["users_guildstaff"][i]["nickname"];
          user_email = response["users_guildstaff"][i]["email"];
          temp_html = `<div class="user-item">
                                <div class="user-item_nickname">${user_nickname}</div>
                                <div class="user-item_email">${user_email}</div>
                                <div onclick="downGrade(event)" class="grade_downgrade_btn">X</div>
                            </div>`;
          $("#guildstaff > .grade_box_content").append(temp_html);
        }

        //길드원 가져와서, 넣어주기
        for (let i = 0; i < response["users_guildmember"].length; i++) {
          user_nickname = response["users_guildmember"][i]["nickname"];
          user_email = response["users_guildmember"][i]["email"];
          temp_html = `<div class="user-item">
                                <div class="user-item_nickname">${user_nickname}</div>
                                <div class="user-item_email">${user_email}</div>
                                <div onclick="upGrade(event)" class="grade_upgrade_btn">O</div>
                                <div onclick="downGrade(event)" class="grade_downgrade_btn">X</div>
                            </div>`;
          $("#guildmember > .grade_box_content").append(temp_html);
        }
        //사용자 가져와서, 넣어주기
        for (let i = 0; i < response["users_guildnonemember"].length; i++) {
          user_nickname = response["users_guildnonemember"][i]["nickname"];
          user_email = response["users_guildnonemember"][i]["email"];
          temp_html = `<div class="user-item">
                                <div class="user-item_nickname">${user_nickname}</div>
                                <div class="user-item_email">${user_email}</div>
                                <div onclick="upGrade(event)" class="grade_upgrade_btn">O</div>
                                <div onclick="downGrade(event)" class="grade_downgrade_btn">X</div>
                            </div>`;
          $("#guildnonemember > .grade_box_content").append(temp_html);
        }
      } else {
        Swal.fire({
          title: response["title"],
          text: response["msg"],
          icon: "error",
          confirmButtonColor: "#5b7d97",
        });
      }
    },
  });
}

//버튼클릭시, 메인페이지로 이동
function goToMainpage() {
  location.href = "/";
}

//로그아웃버튼클릭시, 쿠키삭제, 메인페이지로 이동
function logout() {
  $.removeCookie("mytoken", { path: "/" });
  Swal.fire({
    title: "로그아웃 성공",
    text: "로그아웃을 성공했습니다.",
    icon: "success",
    confirmButtonColor: "#5b7d97",
  }).then((result) => {
    location.href = "/";
  });
}

//나의 정보 수정 기능
function changeUserInfo() {
  // pw 정규식: 8~16글자 영문, 숫자, 특수문자 사용
  const pwRegex =
    /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;

  let change_pw = $("#change_user_pw").val();
  if (pwRegex.test(change_pw) == false) {
    Swal.fire({
      title: "내 정보 수정 실패",
      text: "비밀번호 형식이 올바르지 않습니다.(8~16글자 영문, 숫자, 특수문자 사용)",
      icon: "error",
      confirmButtonColor: "#5b7d97",
    });
    return 0;
  }
  let change_class1 = $("#change_class1").val();
  let change_class2 = $("#change_class2").val();
  let change_class3 = $("#change_class3").val();
  let change_class4 = $("#change_class4").val();
  let change_class5 = $("#change_class5").val();
  let change_class6 = $("#change_class6").val();

  //규정된 정규식의 유형과 같다면 data로 묶어서 보내주기
  if (pwRegex.test(change_pw)) {
    $.ajax({
      type: "POST",
      url: "/mypage/api_chage_myinfo/",
      dataType: "json",
      data: {
        pw_give: change_pw,
        class_give1: change_class1,
        class_give2: change_class2,
        class_give3: change_class3,
        class_give4: change_class4,
        class_give5: change_class5,
        class_give6: change_class6,
      },
      success: function (response) {
        if (response["result"] == "SUCCESS") {
          // 내 정보변경이 성공했을때, 기존 쿠키를 삭제하고 받아온 토큰값으로 다시 쿠키값 주기
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
        } else {
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
  }
}

//메인 공지 수정 기능
function changeMainAnnouncement() {
  let announcement = $(".main_announcement_content textarea").val();
  $.ajax({
    type: "POST",
    url: "/mypage/api_change_main_announcement/",
    dataType: "json",
    data: {
      announcement_give: announcement,
    },
    success: function (response) {
      if (response["result"] == "SUCCESS") {
        Swal.fire({
          title: response["title"],
          text: response["msg"],
          icon: "success",
          confirmButtonColor: "#5b7d97",
        });
      } else {
        Swal.fire({
          title: response["title"],
          text: response["msg"],
          icon: "error",
          confirmButtonColor: "#5b7d97",
        });
      }
    },
  });
}

//인력사무소 공지 수정 기능
function changeResourceofficeAnnouncement() {
  let announcement = $(".resourceoffice_announcement_content textarea").val();
  $.ajax({
    type: "POST",
    url: "/mypage/api_change_resourceoffice_announcement/",
    dataType: "json",
    data: {
      announcement_give: announcement,
    },
    success: function (response) {
      if (response["result"] == "SUCCESS") {
        Swal.fire({
          title: response["title"],
          text: response["msg"],
          icon: "success",
          confirmButtonColor: "#5b7d97",
        });
      } else {
        Swal.fire({
          title: response["title"],
          text: response["msg"],
          icon: "error",
          confirmButtonColor: "#5b7d97",
        });
      }
    },
  });
}

//권한 업그레이드, 업그레이드 버튼 클릭시, 실행
//비승인회원->승인회원, 승인회원->관리자
function upGrade(e) {
  let nickname = $(e.target).prevAll(".user-item_nickname").text();
  $.ajax({
    type: "POST",
    url: "/mypage/api_upgrade/",
    dataType: "json",
    data: {
      nickname_give: nickname,
    },
    success: function (response) {
      if (response["result"] == "SUCCESS") {
        Swal.fire({
          title: response["title"],
          text: response["msg"],
          icon: "success",
          confirmButtonColor: "#5b7d97",
        }).then((result) => {
          location.reload();
        });
      } else {
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
}

//권한 다운그레이드, 다운그레이드 버튼 클릭시, 실행
//관리자->승인회원, 승인회원->비승인회원, 비승인회원->user_data삭제
function downGrade(e) {
  let nickname = $(e.target).prevAll(".user-item_nickname").text();
  $.ajax({
    type: "POST",
    url: "/mypage/api_downgrade/",
    dataType: "json",
    data: {
      nickname_give: nickname,
    },
    success: function (response) {
      if (response["result"] == "SUCCESS") {
        Swal.fire({
          title: response["title"],
          text: response["msg"],
          icon: "success",
          confirmButtonColor: "#5b7d97",
        }).then((result) => {
          location.reload();
        });
      } else {
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
}

// 포인트 관리 기능
$(document).on("keypress", "#point_management_command_box", function (key) {
  if (key.keyCode == 13) {
    let command = $(this).val();
    let commandList = command.split(" ");
    let userNickname = "";
    let value = 0;
    let isCommand = true;
    const pointRegex = /\d/;

    $("#point_management_command_box").val("");
    if (commandList[0] == "clear") {
      $(".point_management_Monitor").empty();
      $(".point_management_Monitor").append(`<p>명령 대기중...</p>`);
      return 0;
    } else if (commandList[0] == "find_all" && commandList[1] == undefined) {
      command = "find_all";
    } else if (commandList[0] == "find" && commandList[1]) {
      command = "find";
      userNickname = commandList[1];
    } else if (commandList[0] == "set") {
      if (pointRegex.test(commandList[2][0])) {
        command = "set";
        userNickname = commandList[1];
        value = parseInt(commandList[2]);
      } else if (commandList[2][0] == "+") {
        command = "set_plus";
        userNickname = commandList[1];
        value = parseInt(commandList[2]);
      } else if (commandList[2][0] == "-") {
        command = "set_minus";
        userNickname = commandList[1];
        value = parseInt(commandList[2]);
      } else {
        isCommand = false;
      }
    } else {
      isCommand = false;
    }
    if (isCommand == false) {
      Swal.fire({
        title: "명령 에러",
        text: "명령어를 확인해주세요.",
        icon: "error",
        confirmButtonColor: "#5b7d97",
      }).then((result) => {
        return 0;
      });
    }
    $.ajax({
      type: "POST",
      url: "/mypage/api_point_management/",
      dataType: "json",
      data: {
        command_give: command,
        usernickname_give: userNickname,
        value_give: value,
      },
      success: function (response) {
        if (response["result"] == "SUCCESS") {
          if (command == "find_all") {
            for (let i = 0; i < response["return_value"].length; i++) {
              let tempHtml = `<p>${response["return_value"][i]["nickname"]}: ${response["return_value"][i]["point"]}포인트</p>`;
              $(".point_management_Monitor").append(tempHtml);
            }
          } else if (command == "find") {
            let tempHtml = `<p>${response["return_value"]["nickname"]}: ${response["return_value"]["point"]}포인트</p>`;
            $(".point_management_Monitor").append(tempHtml);
          } else if (command == "set") {
            let tempHtml = `<p>${response["return_value"]}</p>`;
            $(".point_management_Monitor").append(tempHtml);
          } else if (command == "set_plus") {
            let tempHtml = `<p>${response["return_value"]}</p>`;
            $(".point_management_Monitor").append(tempHtml);
          } else if (command == "set_minus") {
            let tempHtml = `<p>${response["return_value"]}</p>`;
            $(".point_management_Monitor").append(tempHtml);
          }
        } else {
          Swal.fire({
            title: response["title"],
            text: response["msg"],
            icon: "error",
            confirmButtonColor: "#5b7d97",
          });
        }
      },
    });
  }
});

//로그 가져오기 기능
function printLog() {
  $.ajax({
    type: "GET",
    url: "/mypage/api_printlog/",
    dataType: "json",
    data: {},
    success: function (response) {
      if (response["result"] == "SUCCESS") {
        let allLog = response["all_log"];
        let logTime;
        let logNickname;
        let logTitle;
        let temp_html;
        let logContent;
        for (let i = 0; i < response["all_log"].length; i++) {
          logTime = allLog[i]["time"];
          logNickname = allLog[i]["nickname"];
          logTitle = allLog[i]["title"];
          logContent = allLog[i]["content"];
          temp_html = `<p>[${logTime}][${logNickname}][${logTitle}][${logContent}]</p>`;
          $(".log_content").append(temp_html);
        }
        Swal.fire({
          title: response["title"],
          text: response["msg"],
          icon: "success",
          confirmButtonColor: "#5b7d97",
        });
      } else {
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
}

//로그기록 삭제 기능 (전체삭제)
function deleteLog() {
  Swal.fire({
    title: "전체 로그를 삭제하겠습니까?",
    text: "삭제한 로그는 되돌릴 수 없습니다.",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#5b7d97",
    cancelButtonColor: "#bbdefb",
    confirmButtonText: "YES",
    cancelButtonText: "NO",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: "GET",
        url: "/mypage/api_deletelog/",
        dataType: "json",
        data: {},
        success: function (response) {
          if (response["result"] == "SUCCESS") {
            Swal.fire({
              title: response["title"],
              text: response["msg"],
              icon: "success",
              confirmButtonColor: "#5b7d97",
            }).then((result) => {
              location.reload();
            });
          } else {
            Swal.fire({
              title: response["title"],
              text: response["msg"],
              icon: "success",
              confirmButtonColor: "#5b7d97",
            }).then((result) => {
              location.reload();
            });
          }
        },
      });
    }
  });
}
