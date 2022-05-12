$(document).ready(function () {
  userCheck();
  printPointRanking();
  printGameCount();
});
//로그인의 유무와 로그인한 정보의 권한을 체크, 권한별 컨텐츠 표시(일정추가)
function userCheck() {
  let myMembership = $(".mainlogo").attr("data-membership");
  if (myMembership == "비로그인") {
    alert("로그인이 필요합니다.");
    location.href = "/login/";
  } else if (myMembership == "비승인회원") {
    location.href = "/needallow/";
  } else if (myMembership == "관리자") {
  }
}

//포인트 랭킹 가져와서 출력해주기, 내 포인트 출력, -10만 포인트 보다 작으면 출입금지
function printPointRanking() {
  $.ajax({
    type: "GET",
    url: "/minigames/api_printpointranking/",
    dataType: "json",
    data: {},
    success: function (response) {
      if (response["mypoint"] < -100000) {
        Swal.fire({
          title: "출입금지",
          text: "주인장이 내쫓았습니다.",
          icon: "error",
          confirmButtonColor: "#5b7d97",
        }).then((result) => {
          location.href = "/";
        });
      }
      $(".myinfo_row:nth-child(2) > .myinfo_row_content:nth-child(2)").text(
        response["mypoint"]
      );

      let TopRankingList = response["top_ranking_list"];
      for (let i = 0; i < TopRankingList.length; i++) {
        $(
          ".point_ranking_contnet > .point_ranking_row:nth-child(" +
            (i + 1) +
            ") > .point_ranking_row_nickname"
        ).text(TopRankingList[i]["nickname"]);
        $(
          ".point_ranking_contnet > .point_ranking_row:nth-child(" +
            (i + 1) +
            ") > .point_ranking_row_point"
        ).text(TopRankingList[i]["point"]);
      }
    },
  });
}

// 게임별 카운트 횟수 출력
function printGameCount() {
  $.ajax({
    type: "GET",
    url: "/minigames/api_printgamecount/",
    dataType: "json",
    data: {},
    success: function (response) {
      if (response["result"] == "SUCCESS") {
        $(".abilitystonegame_titlebox_count").text(
          response["abilitystonegamecount"] + "/4"
        );
        $(".findninavegame_titlebox_count").text(
          response["findninavegamecount"] + "/99"
        );
        $(".papunikafishinggame_titlebox_count").text(
          response["papunikafishinggamecount"] + "/10"
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

// 포인트 감소 기능
function decreasePoints(point, gamecount, maxGamecount) {
  $.ajax({
    type: "POST",
    url: "/minigames/api_gamestart/",
    dataType: "json",
    data: {
      decrease_point_give: point,
      gamecount_give: gamecount,
      max_gamecount_give: maxGamecount,
    },
    success: function (response) {
      if (response["result"] == "FAIL") {
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
let free_random_number;
var free_abilitystoneGameProbability = 75;
var free_abilitystoneA = 1;
var free_abilitystoneB = 1;
var free_abilitystoneC = 1;
var free_abilitystoneASuccessNumber = 0;
var free_abilitystoneBSuccessNumber = 0;
var free_abilitystoneCSuccessNumber = 0;

// 어빌리티 스톤 무료버전

// 어빌리티 스톤 게임 각인A 무료버전
$(document).on(
  "click",
  ".free_abilitystonegame_row:nth-child(2) .free_abilitystonegame_btn_doit",
  function () {
    if (free_abilitystoneA <= 10) {
      free_random_number = Math.floor(Math.random() * 101);
      if (free_random_number < free_abilitystoneGameProbability) {
        if (free_abilitystoneGameProbability <= 25) {
          free_abilitystoneGameProbability = 25;
          free_abilitystoneA = free_abilitystoneA + 1;
          free_abilitystoneASuccessNumber = free_abilitystoneASuccessNumber + 1;
          $(
            ".free_abilitystonegame_row:nth-child(2) > .free_diamond:nth-child(" +
              free_abilitystoneA +
              ")"
          ).css("background-color", "blue");
          $(
            ".free_abilitystonegame_row:nth-child(2) > .free_abilitystonegame_numberofsuccess"
          ).text(free_abilitystoneASuccessNumber);
          $("#free_abilitystonegame_probability").text(
            free_abilitystoneGameProbability + "%"
          );
        } else {
          free_abilitystoneGameProbability =
            free_abilitystoneGameProbability - 10;
          free_abilitystoneA = free_abilitystoneA + 1;
          free_abilitystoneASuccessNumber = free_abilitystoneASuccessNumber + 1;
          $(
            ".free_abilitystonegame_row:nth-child(2) > .diamond:nth-child(" +
              free_abilitystoneA +
              ")"
          ).css("background-color", "blue");
          $(
            ".free_abilitystonegame_row:nth-child(2) > .free_abilitystonegame_numberofsuccess"
          ).text(free_abilitystoneASuccessNumber);
          $("#free_abilitystonegame_probability").text(
            free_abilitystoneGameProbability + "%"
          );
        }
      } else {
        if (free_abilitystoneGameProbability >= 75) {
          free_abilitystoneGameProbability = 75;
          free_abilitystoneA = free_abilitystoneA + 1;
          $(
            ".free_abilitystonegame_row:nth-child(2) > .diamond:nth-child(" +
              free_abilitystoneA +
              ")"
          ).css("background-color", "gray");
          $("#free_abilitystonegame_probability").text(
            free_abilitystoneGameProbability + "%"
          );
        } else {
          free_abilitystoneGameProbability =
            free_abilitystoneGameProbability + 10;
          free_abilitystoneA = free_abilitystoneA + 1;
          $(
            ".free_abilitystonegame_row:nth-child(2) > .diamond:nth-child(" +
              free_abilitystoneA +
              ")"
          ).css("background-color", "gray");
          $("#free_abilitystonegame_probability").text(
            free_abilitystoneGameProbability + "%"
          );
        }
      }
    }
  }
);
// 어빌리티 스톤 게임 각인B 무료버전
$(document).on(
  "click",
  ".free_abilitystonegame_row:nth-child(3) .free_abilitystonegame_btn_doit",
  function () {
    if (free_abilitystoneB <= 10) {
      random_number = Math.floor(Math.random() * 101);
      if (random_number < free_abilitystoneGameProbability) {
        if (free_abilitystoneGameProbability <= 25) {
          free_abilitystoneGameProbability = 25;
          free_abilitystoneB = free_abilitystoneB + 1;
          free_abilitystoneBSuccessNumber = free_abilitystoneBSuccessNumber + 1;
          $(
            ".free_abilitystonegame_row:nth-child(3) > .diamond:nth-child(" +
              free_abilitystoneB +
              ")"
          ).css("background-color", "blue");
          $(
            ".free_abilitystonegame_row:nth-child(3) > .free_abilitystonegame_numberofsuccess"
          ).text(free_abilitystoneBSuccessNumber);
          $("#free_abilitystonegame_probability").text(
            free_abilitystoneGameProbability + "%"
          );
        } else {
          free_abilitystoneGameProbability =
            free_abilitystoneGameProbability - 10;
          free_abilitystoneB = free_abilitystoneB + 1;
          free_abilitystoneBSuccessNumber = free_abilitystoneBSuccessNumber + 1;
          $(
            ".free_abilitystonegame_row:nth-child(3) > .diamond:nth-child(" +
              free_abilitystoneB +
              ")"
          ).css("background-color", "blue");
          $(
            ".free_abilitystonegame_row:nth-child(3) > .free_abilitystonegame_numberofsuccess"
          ).text(free_abilitystoneBSuccessNumber);
          $("#free_abilitystonegame_probability").text(
            free_abilitystoneGameProbability + "%"
          );
        }
      } else {
        if (free_abilitystoneGameProbability >= 75) {
          free_abilitystoneGameProbability = 75;
          free_abilitystoneB = free_abilitystoneB + 1;
          $(
            ".free_abilitystonegame_row:nth-child(3) > .diamond:nth-child(" +
              free_abilitystoneB +
              ")"
          ).css("background-color", "gray");
          $("#free_abilitystonegame_probability").text(
            free_abilitystoneGameProbability + "%"
          );
        } else {
          free_abilitystoneGameProbability =
            free_abilitystoneGameProbability + 10;
          free_abilitystoneB = free_abilitystoneB + 1;
          $(
            ".free_abilitystonegame_row:nth-child(3) > .diamond:nth-child(" +
              free_abilitystoneB +
              ")"
          ).css("background-color", "gray");
          $("#free_abilitystonegame_probability").text(
            free_abilitystoneGameProbability + "%"
          );
        }
      }
    }
  }
);
// 어빌리티 스톤 게임 감소각인 무료버전
$(document).on(
  "click",
  ".free_abilitystonegame_row:nth-child(4) .free_abilitystonegame_btn_doit",
  function () {
    if (free_abilitystoneC <= 10) {
      random_number = Math.floor(Math.random() * 101);
      if (random_number < free_abilitystoneGameProbability) {
        if (free_abilitystoneGameProbability <= 25) {
          free_abilitystoneGameProbability = 25;
          free_abilitystoneC = free_abilitystoneC + 1;
          free_abilitystoneCSuccessNumber = free_abilitystoneCSuccessNumber + 1;
          $(
            ".free_abilitystonegame_row:nth-child(4) > .diamond:nth-child(" +
              free_abilitystoneC +
              ")"
          ).css("background-color", "red");
          $(
            ".free_abilitystonegame_row:nth-child(4) > .free_abilitystonegame_numberofsuccess"
          ).text(free_abilitystoneCSuccessNumber);
          $("#free_abilitystonegame_probability").text(
            free_abilitystoneGameProbability + "%"
          );
        } else {
          free_abilitystoneGameProbability =
            free_abilitystoneGameProbability - 10;
          free_abilitystoneC = free_abilitystoneC + 1;
          free_abilitystoneCSuccessNumber = free_abilitystoneCSuccessNumber + 1;
          $(
            ".free_abilitystonegame_row:nth-child(4) > .diamond:nth-child(" +
              free_abilitystoneC +
              ")"
          ).css("background-color", "red");
          $(
            ".free_abilitystonegame_row:nth-child(4) > .free_abilitystonegame_numberofsuccess"
          ).text(free_abilitystoneCSuccessNumber);
          $("#free_abilitystonegame_probability").text(
            free_abilitystoneGameProbability + "%"
          );
        }
      } else {
        if (free_abilitystoneGameProbability >= 75) {
          free_abilitystoneGameProbability = 75;
          free_abilitystoneC = free_abilitystoneC + 1;
          $(
            ".free_abilitystonegame_row:nth-child(4) > .diamond:nth-child(" +
              free_abilitystoneC +
              ")"
          ).css("background-color", "gray");
          $("#free_abilitystonegame_probability").text(
            free_abilitystoneGameProbability + "%"
          );
        } else {
          free_abilitystoneGameProbability =
            free_abilitystoneGameProbability + 10;
          free_abilitystoneC = free_abilitystoneC + 1;
          $(
            ".free_abilitystonegame_row:nth-child(4) > .diamond:nth-child(" +
              free_abilitystoneC +
              ")"
          ).css("background-color", "gray");
          $("#free_abilitystonegame_probability").text(
            free_abilitystoneGameProbability + "%"
          );
        }
      }
    }
  }
);
// 어빌리티 스톤 게임 초기화 무료버전
$(document).on("click", ".free_abilitystonegame_btn_done", function () {
  free_abilitystoneGameProbability = 75;
  free_abilitystoneA = 1;
  free_abilitystoneB = 1;
  free_abilitystoneC = 1;
  free_abilitystoneASuccessNumber = 0;
  free_abilitystoneBSuccessNumber = 0;
  free_abilitystoneCSuccessNumber = 0;
  $(".free_abilitystonegame_row:nth-child(2) > .diamond").css(
    "background-color",
    "white"
  );
  $(".free_abilitystonegame_row:nth-child(3) > .diamond").css(
    "background-color",
    "white"
  );
  $(".free_abilitystonegame_row:nth-child(4) > .diamond").css(
    "background-color",
    "white"
  );
  $("#free_abilitystonegame_probability").text(
    free_abilitystoneGameProbability + "%"
  );
  $(
    ".free_abilitystonegame_row:nth-child(2) > .free_abilitystonegame_numberofsuccess"
  ).text(free_abilitystoneASuccessNumber);
  $(
    ".free_abilitystonegame_row:nth-child(3) > .free_abilitystonegame_numberofsuccess"
  ).text(free_abilitystoneBSuccessNumber);
  $(
    ".free_abilitystonegame_row:nth-child(4) > .free_abilitystonegame_numberofsuccess"
  ).text(free_abilitystoneCSuccessNumber);
});

let random_number;
var abilitystoneGameProbability = 75;
var abilitystoneA = 1;
var abilitystoneB = 1;
var abilitystoneC = 1;
var abilitystoneASuccessNumber = 0;
var abilitystoneBSuccessNumber = 0;
var abilitystoneCSuccessNumber = 0;

// 어빌리티 스톤 유료버전
$(".abilitystonegame_start_btn").click(function () {
  let decreasePoint = 2500;
  decreasePoints(decreasePoint, "abilitystonegamecount", 4);
  $(".abilitystonegame_start_container").hide();
  let tempHtml = `<div class="abilitystonegame_contentbox">
                    <div class="abilitystonegame_row">
                      <div id="abilitystonegame_probability">75%</div>
                    </div>
                    <div class="abilitystonegame_row">
                      <div class="abilitystonegame_name">각인A</div>
                      <div class="diamond"></div>
                      <div class="diamond"></div>
                      <div class="diamond"></div>
                      <div class="diamond"></div>
                      <div class="diamond"></div>
                      <div class="diamond"></div>
                      <div class="diamond"></div>
                      <div class="diamond"></div>
                      <div class="diamond"></div>
                      <div class="diamond"></div>
                      <div class="abilitystonegame_numberofsuccess">0</div>
                      <div class="abilitystonegame_btn_doit">세공</div>
                    </div>
                    <div class="abilitystonegame_row">
                      <div class="abilitystonegame_name">각인B</div>
                      <div class="diamond"></div>
                      <div class="diamond"></div>
                      <div class="diamond"></div>
                      <div class="diamond"></div>
                      <div class="diamond"></div>
                      <div class="diamond"></div>
                      <div class="diamond"></div>
                      <div class="diamond"></div>
                      <div class="diamond"></div>
                      <div class="diamond"></div>
                      <div class="abilitystonegame_numberofsuccess">0</div>
                      <div class="abilitystonegame_btn_doit">세공</div>
                    </div>
                    <div class="abilitystonegame_row">
                      <div class="abilitystonegame_name">감소각인</div>
                      <div class="diamond"></div>
                      <div class="diamond"></div>
                      <div class="diamond"></div>
                      <div class="diamond"></div>
                      <div class="diamond"></div>
                      <div class="diamond"></div>
                      <div class="diamond"></div>
                      <div class="diamond"></div>
                      <div class="diamond"></div>
                      <div class="diamond"></div>
                      <div class="abilitystonegame_numberofsuccess">0</div>
                      <div class="abilitystonegame_btn_doit">세공</div>
                    </div>
                    <div class="abilitystonegame_row">
                      <div class="abilitystonegame_btn_done">완료</div>
                    </div>
                  </div>`;
  $(".abilitystonegame_container").append(tempHtml);
});

// 어빌리티 스톤 게임 각인A
$(document).on(
  "click",
  ".abilitystonegame_row:nth-child(2) .abilitystonegame_btn_doit",
  function () {
    if (abilitystoneA <= 10) {
      random_number = Math.floor(Math.random() * 101);
      if (random_number < abilitystoneGameProbability) {
        if (abilitystoneGameProbability <= 25) {
          abilitystoneGameProbability = 25;
          abilitystoneA = abilitystoneA + 1;
          abilitystoneASuccessNumber = abilitystoneASuccessNumber + 1;
          $(
            ".abilitystonegame_row:nth-child(2) > .diamond:nth-child(" +
              abilitystoneA +
              ")"
          ).css("background-color", "blue");
          $(
            ".abilitystonegame_row:nth-child(2) > .abilitystonegame_numberofsuccess"
          ).text(abilitystoneASuccessNumber);
          $("#abilitystonegame_probability").text(
            abilitystoneGameProbability + "%"
          );
        } else {
          abilitystoneGameProbability = abilitystoneGameProbability - 10;
          abilitystoneA = abilitystoneA + 1;
          abilitystoneASuccessNumber = abilitystoneASuccessNumber + 1;
          $(
            ".abilitystonegame_row:nth-child(2) > .diamond:nth-child(" +
              abilitystoneA +
              ")"
          ).css("background-color", "blue");
          $(
            ".abilitystonegame_row:nth-child(2) > .abilitystonegame_numberofsuccess"
          ).text(abilitystoneASuccessNumber);
          $("#abilitystonegame_probability").text(
            abilitystoneGameProbability + "%"
          );
        }
      } else {
        if (abilitystoneGameProbability >= 75) {
          abilitystoneGameProbability = 75;
          abilitystoneA = abilitystoneA + 1;
          $(
            ".abilitystonegame_row:nth-child(2) > .diamond:nth-child(" +
              abilitystoneA +
              ")"
          ).css("background-color", "gray");
          $("#abilitystonegame_probability").text(
            abilitystoneGameProbability + "%"
          );
        } else {
          abilitystoneGameProbability = abilitystoneGameProbability + 10;
          abilitystoneA = abilitystoneA + 1;
          $(
            ".abilitystonegame_row:nth-child(2) > .diamond:nth-child(" +
              abilitystoneA +
              ")"
          ).css("background-color", "gray");
          $("#abilitystonegame_probability").text(
            abilitystoneGameProbability + "%"
          );
        }
      }
    }
  }
);
// 어빌리티 스톤 게임 각인B
$(document).on(
  "click",
  ".abilitystonegame_row:nth-child(3) .abilitystonegame_btn_doit",
  function () {
    if (abilitystoneB <= 10) {
      random_number = Math.floor(Math.random() * 101);
      if (random_number < abilitystoneGameProbability) {
        if (abilitystoneGameProbability <= 25) {
          abilitystoneGameProbability = 25;
          abilitystoneB = abilitystoneB + 1;
          abilitystoneBSuccessNumber = abilitystoneBSuccessNumber + 1;
          $(
            ".abilitystonegame_row:nth-child(3) > .diamond:nth-child(" +
              abilitystoneB +
              ")"
          ).css("background-color", "blue");
          $(
            ".abilitystonegame_row:nth-child(3) > .abilitystonegame_numberofsuccess"
          ).text(abilitystoneBSuccessNumber);
          $("#abilitystonegame_probability").text(
            abilitystoneGameProbability + "%"
          );
        } else {
          abilitystoneGameProbability = abilitystoneGameProbability - 10;
          abilitystoneB = abilitystoneB + 1;
          abilitystoneBSuccessNumber = abilitystoneBSuccessNumber + 1;
          $(
            ".abilitystonegame_row:nth-child(3) > .diamond:nth-child(" +
              abilitystoneB +
              ")"
          ).css("background-color", "blue");
          $(
            ".abilitystonegame_row:nth-child(3) > .abilitystonegame_numberofsuccess"
          ).text(abilitystoneBSuccessNumber);
          $("#abilitystonegame_probability").text(
            abilitystoneGameProbability + "%"
          );
        }
      } else {
        if (abilitystoneGameProbability >= 75) {
          abilitystoneGameProbability = 75;
          abilitystoneB = abilitystoneB + 1;
          $(
            ".abilitystonegame_row:nth-child(3) > .diamond:nth-child(" +
              abilitystoneB +
              ")"
          ).css("background-color", "gray");
          $("#abilitystonegame_probability").text(
            abilitystoneGameProbability + "%"
          );
        } else {
          abilitystoneGameProbability = abilitystoneGameProbability + 10;
          abilitystoneB = abilitystoneB + 1;
          $(
            ".abilitystonegame_row:nth-child(3) > .diamond:nth-child(" +
              abilitystoneB +
              ")"
          ).css("background-color", "gray");
          $("#abilitystonegame_probability").text(
            abilitystoneGameProbability + "%"
          );
        }
      }
    }
  }
);
// 어빌리티 스톤 게임 감소각인
$(document).on(
  "click",
  ".abilitystonegame_row:nth-child(4) .abilitystonegame_btn_doit",
  function () {
    if (abilitystoneC <= 10) {
      random_number = Math.floor(Math.random() * 101);
      if (random_number < abilitystoneGameProbability) {
        if (abilitystoneGameProbability <= 25) {
          abilitystoneGameProbability = 25;
          abilitystoneC = abilitystoneC + 1;
          abilitystoneCSuccessNumber = abilitystoneCSuccessNumber + 1;
          $(
            ".abilitystonegame_row:nth-child(4) > .diamond:nth-child(" +
              abilitystoneC +
              ")"
          ).css("background-color", "red");
          $(
            ".abilitystonegame_row:nth-child(4) > .abilitystonegame_numberofsuccess"
          ).text(abilitystoneCSuccessNumber);
          $("#abilitystonegame_probability").text(
            abilitystoneGameProbability + "%"
          );
        } else {
          abilitystoneGameProbability = abilitystoneGameProbability - 10;
          abilitystoneC = abilitystoneC + 1;
          abilitystoneCSuccessNumber = abilitystoneCSuccessNumber + 1;
          $(
            ".abilitystonegame_row:nth-child(4) > .diamond:nth-child(" +
              abilitystoneC +
              ")"
          ).css("background-color", "red");
          $(
            ".abilitystonegame_row:nth-child(4) > .abilitystonegame_numberofsuccess"
          ).text(abilitystoneCSuccessNumber);
          $("#abilitystonegame_probability").text(
            abilitystoneGameProbability + "%"
          );
        }
      } else {
        if (abilitystoneGameProbability >= 75) {
          abilitystoneGameProbability = 75;
          abilitystoneC = abilitystoneC + 1;
          $(
            ".abilitystonegame_row:nth-child(4) > .diamond:nth-child(" +
              abilitystoneC +
              ")"
          ).css("background-color", "gray");
          $("#abilitystonegame_probability").text(
            abilitystoneGameProbability + "%"
          );
        } else {
          abilitystoneGameProbability = abilitystoneGameProbability + 10;
          abilitystoneC = abilitystoneC + 1;
          $(
            ".abilitystonegame_row:nth-child(4) > .diamond:nth-child(" +
              abilitystoneC +
              ")"
          ).css("background-color", "gray");
          $("#abilitystonegame_probability").text(
            abilitystoneGameProbability + "%"
          );
        }
      }
    }
  }
);
// 어빌리티 스톤 게임 완료기능
$(document).on("click", ".abilitystonegame_btn_done", function () {
  let resultPoint =
    500 *
    (parseInt(abilitystoneASuccessNumber) +
      parseInt(abilitystoneBSuccessNumber) -
      parseInt(abilitystoneCSuccessNumber));
  Swal.fire({
    title: "게임 결과",
    text:
      "성공: " +
      abilitystoneASuccessNumber +
      "+" +
      abilitystoneBSuccessNumber +
      " 실패: " +
      abilitystoneCSuccessNumber +
      " 포인트획득 = " +
      resultPoint,
    icon: "success",
    confirmButtonColor: "#5b7d97",
  }).then((result) => {
    $.ajax({
      type: "POST",
      url: "/minigames/api_gamedone/",
      dataType: "json",
      data: {
        result_point_give: resultPoint,
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
        }
      },
    });
  });
});

// 니나브 찾기 게임
const findninavegameRandomNumber = Math.floor(Math.random() * 4) + 1;
$(".findninavegame_start_btn").click(function () {
  let decreasePoint = 5000;
  decreasePoints(decreasePoint, "findninavegamecount", 99);
  $(".findninavegame_start_container").hide();
  let tempHtml = `<div class="findninavegame_contentbox">
                  <div class="findninavegame_background">
                    <div id="findninavegame_card1" class="findninavegame_card"></div>
                    <div id="findninavegame_card2" class="findninavegame_card"></div>
                    <div id="findninavegame_card3" class="findninavegame_card"></div>
                    <div id="findninavegame_card4" class="findninavegame_card"></div>
                    <div id="findninavegame_card5" class="findninavegame_card"></div>
                    <div class="findninavegame_btn_done">완료</div>
                  </div>
                </div>`;
  $(".findninavegame_container").append(tempHtml);
});
let selectedCard = "";
// 니나브 찾기 게임 카드 클릭
$(document).on("click", ".findninavegame_card", function (event) {
  $(document).off("click", ".findninavegame_card");
  let resultPoint = 0;
  $(".findninavegame_card").css(
    "background-image",
    "url('../static/img/findninavegame_koukusaton.png')"
  );
  $("#findninavegame_card" + findninavegameRandomNumber).css(
    "background-image",
    "url('../static/img/findninavegame_ninave.png')"
  );
  selectedCard = $(event.currentTarget).attr("style");
});
// 니나브 찾기 게임 완료 버튼 클릭
$(document).on("click", ".findninavegame_btn_done", function () {
  if (
    selectedCard ==
    'background-image: url("../static/img/findninavegame_ninave.png");'
  ) {
    resultPoint = 20000;
    Swal.fire({
      title: "니나브를 찾았습니다!",
      text: "20000포인트를 적립합니다.",
      icon: "success",
      confirmButtonColor: "#5b7d97",
    }).then((result) => {
      $.ajax({
        type: "POST",
        url: "/minigames/api_gamedone/",
        dataType: "json",
        data: {
          result_point_give: resultPoint,
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
          }
        },
      });
    });
  } else {
    resultPoint = 0;
    Swal.fire({
      title: "니나브를 찾지 못했습니다..",
      text: "다음 기회를 노려주세요.",
      icon: "error",
      confirmButtonColor: "#5b7d97",
    }).then((result) => {
      $.ajax({
        type: "POST",
        url: "/minigames/api_gamedone/",
        dataType: "json",
        data: {
          result_point_give: resultPoint,
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
          }
        },
      });
    });
  }
});

// 파푸니카 낚시 게임
const papunikaFishingGameRandomNumber = Math.floor(Math.random() * 100) + 1;
// 게임시작버튼 클릭시, 화면교체
$(".papunikafishinggame_start_btn").click(function () {
  let decreasePoint = 0;
  decreasePoints(decreasePoint, "papunikafishinggamecount", 10);
  $(".papunikafishinggame_start_container").hide();
  const tempHtml = `<div class="papunikafishinggame_contentbox">
                      <div class="papunikafishinggame_background">
                        <div class="papunikafishinggame_item">
                          <div class="papunikafishinggame_item_img"></div>
                          <div class="papunikafishinggame_item_content"></div>
                        </div>
                        <div class="papunikafishinggame_btn_start">뭔가 낚였다..!</div>
                      </div>
                    </div>`;
  $(".papunikafishinggame_container").append(tempHtml);
});
// '뭔가가 걸려들었다..!'클릭시 게임 진행
let resultPoint = 0;
$(document).on("click", ".papunikafishinggame_btn_start", function () {
  // 낚싯 보상 애니메이션
  $(".papunikafishinggame_item").animate(
    {
      opacity: 1,
      top: "50%",
    },
    2000
  );
  $(".papunikafishinggame_btn_start").remove();
  // 랜덤숫자로 보상 이미지, 텍스트 넣기, 보상포인트 변수에 넣기
  if (papunikaFishingGameRandomNumber >= 100) {
    resultPoint = 100000;
    $(".papunikafishinggame_item_img").css(
      "background-image",
      "url('../static/img/papunikafishinggame_sunfish.png')"
    );
    $(".papunikafishinggame_item_content").append(
      `<p>오레하 태양 잉어</p><p>+100000포인트</p>`
    );
  } else if (papunikaFishingGameRandomNumber >= 90) {
    resultPoint = 1000;
    $(".papunikafishinggame_item_img").css(
      "background-image",
      "url('../static/img/papunikafishinggame_pearl.png')"
    );
    $(".papunikafishinggame_item_content").append(
      `<p>진주</p><p>+1000포인트</p>`
    );
  } else if (papunikaFishingGameRandomNumber >= 50) {
    resultPoint = 500;
    $(".papunikafishinggame_item_img").css(
      "background-image",
      "url('../static/img/papunikafishinggame_fish.png')"
    );
    $(".papunikafishinggame_item_content").append(
      `<p>생선</p><p>+500포인트</p>`
    );
  } else {
    resultPoint = -500;
    $(".papunikafishinggame_item_img").css(
      "background-image",
      "url('../static/img/papunikafishinggame_trash.png')"
    );
    $(".papunikafishinggame_item_content").append(
      `<p>쓰레기</p><p>-500포인트</p>`
    );
  }
  $(".papunikafishinggame_background").append(
    `<div class="papunikafishinggame_btn_done">완료</div>`
  );
});
// 완료하기 버튼 클릭시 정산
$(document).on("click", ".papunikafishinggame_btn_done", function () {
  $.ajax({
    type: "POST",
    url: "/minigames/api_gamedone/",
    dataType: "json",
    data: {
      result_point_give: resultPoint,
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
      }
    },
  });
});
