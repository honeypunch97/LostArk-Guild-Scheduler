$(document).ready(function () {
  printStatus();
  printQuestions();
  printSystemLog();
});
// 스케줄러 상황 가져오기
function printStatus() {
  $.ajax({
    type: "GET",
    url: "/management_for_admin/api_print_status/",
    dataType: "json",
    data: {},
    success: function (response) {
      if (response["result"] == "SUCCESS") {
        $("#status_item_content_guildnum").text(response["guild_num"]);
        $("#status_item_content_usernum").text(response["user_num"]);
      }
    },
  });
}

// 공지 수정
$(document).on("click", "#btn_update_announcement", function () {
  let announcement = $("#announcement_textarea").val();
  $.ajax({
    type: "POST",
    url: "/management_for_admin/api_update_announcement/",
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
});

// 패치 등록
$(document).on("click", "#btn_insert_patchnote", function () {
  let patchnote = $("#patchnote_textarea").val();
  $.ajax({
    type: "POST",
    url: "/management_for_admin/api_insert_patchnote/",
    dataType: "json",
    data: {
      patchnote_give: patchnote,
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
});

// 문의 가져오기 기능
function printQuestions() {
  $.ajax({
    type: "GET",
    url: "/management_for_admin/api_print_questions/",
    dataType: "json",
    data: {},
    success: function (response) {
      if (response["result"] == "SUCCESS") {
        let questions = response["questions"];
        for (i = 0; i < questions.length; i++) {
          let tempHtml = `<div class="questions_item">
          <div class="questions_item_content">
            ${questions[i]["content"]}
          </div>
          <div class="questions_item_comment">
            <span>${questions[i]["nickname"]}</span><span>${questions[i]["time"]}</span>
          </div>
        </div>`;
          $("#questions_content").append(tempHtml);
        }
      } else {
        let tempHtml = `<div class="questions_item">
          <div class="questions_item_content">
            문의가 없습니다.
          </div>
          <div class="questions_item_comment">
            <span>SYSTEM</span><span>SYSTEM</span>
          </div>
        </div>`;
        $("#questions_content").append(tempHtml);
      }
    },
  });
}

// 문의 삭제 기능
$(document).on("click", "#btn_delete_questions", function () {
  $.ajax({
    type: "GET",
    url: "/management_for_admin/api_delete_questions/",
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
          icon: "error",
          confirmButtonColor: "#5b7d97",
        }).then((result) => {
          location.reload();
        });
      }
    },
  });
});

// 시스템 로그 가져오기 기능
function printSystemLog() {
  $.ajax({
    type: "GET",
    url: "/management_for_admin/api_print_syslog/",
    dataType: "json",
    data: {},
    success: function (response) {
      if (response["result"] == "SUCCESS") {
        let syslog = response["syslog"];
        for (i = 0; i < syslog.length; i++) {
          let tempHtml = `<p>[${syslog[i]["time"]}][${syslog[i]["nickname"]}][${syslog[i]["content"]}]</p>`;
          $("#syslog_content").append(tempHtml);
        }
      }
    },
  });
}

// 시스템 로그 삭제 기능
$(document).on("click", "#btn_delete_syslog", function () {
  $.ajax({
    type: "GET",
    url: "/management_for_admin/api_delete_syslog/",
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
          icon: "error",
          confirmButtonColor: "#5b7d97",
        }).then((result) => {
          location.reload();
        });
      }
    },
  });
});
