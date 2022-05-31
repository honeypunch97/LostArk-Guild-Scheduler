$(document).ready(function () {
  printPointRanking();
  printGameCount();
  printBettingGame();
  checkPremium();
});

// 프리미엄 길드 체크, 프리미엄길드 광고 넣어주기
function checkPremium() {
  $.ajax({
    type: "GET",
    url: "/minigames/api_checkpremium/",
    dataType: "json",
    data: {},
    success: function (response) {
      if (response["result"] == "SUCCESS") {
        try {
          const tempHtml = `<div class="advertising advertising1">
        <img src="../static/img/minigame_ad_1_${response["guildname"]}.png" alt="" />
      </div>
      <div class="advertising advertising2">
        <img src="../static/img/minigame_ad_2_${response["guildname"]}.png" alt="" />
      </div>`;
          $(".ad_section").append(tempHtml);
        } catch {}
      }
    },
  });
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
      // 포인트 랭킹
      let TopRankingList = response["top_ranking_list"];
      for (let i = 0; i < TopRankingList.length; i++) {
        let tempHtml = `
        <div class="point_ranking_row">
              <div class="point_ranking_row_rank">${i + 1}</div>
              <div class="point_ranking_row_nickname">${
                TopRankingList[i]["nickname"]
              }</div>
              <div class="point_ranking_row_point">${
                TopRankingList[i]["point"]
              }</div>
            </div>
        `;
        $(".point_ranking_contnet").append(tempHtml);
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
        $("#pointroulettegame_titlebox_count").text(
          response["pointroulettegamecount"] + "/99"
        );
        $("#bonusroulettegame_titlebox_count").text(
          response["bonusroulettegamecount"] + "/" + response["schjoincount"]
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

// 베팅게임 가져오기
function printBettingGame() {
  $.ajax({
    type: "GET",
    url: "/minigames/api_printbettinggame/",
    dataType: "json",
    data: {},
    success: function (response) {
      let user = response["user"];
      let gameIdList = response["game_id_list"];
      let allGame = response["all_game"];
      if (response["result"] == "SUCCESS") {
        for (let i = 0; i < gameIdList.length; i++) {
          let tempHtml = `<div class="bettinggame_item" data-id="${gameIdList[i]}" data-lock="${allGame[i]["lock"]}">
                            <div class="bettinggame_item_yes">
                              <div class="bettinggame_item_yes_title">YES</div>
                              <div class="bettinggame_item_yes_content"></div>
                            </div>
                            <div class="bettinggame_item_title_container">
                              <div class="bettinggame_item_title">"${allGame[i]["title"]}"</div>
                              <div class="bettinggame_item_row">
                                <div class="bettinggame_item_author">${allGame[i]["author"]}</div>
                                <div class="bettinggame_item_point">${allGame[i]["point"]}포인트</div>
                              </div>
                              <div class="bettinggame_item_row"></div>
                            </div>
                            <div class="bettinggame_item_no">
                              <div class="bettinggame_item_no_title">NO</div>
                              <div class="bettinggame_item_no_content">
                              </div>
                            </div>
                          </div>`;
          $(".bettinggame_contentbox").append(tempHtml);

          // 본인이 추가한 글이면 해당글에 대한 권한 부여
          if (user["nickname"] == allGame[i]["author"]) {
            let tempHtml = `<div class="bettinggame_btn_done_yes">정산'</div>
            <div class="bettinggame_btn_delete">삭제</div>
            <div class="bettinggame_btn_lock">잠금</div>
            <div class="bettinggame_btn_done_no">정산</div>`;
            $(
              ".bettinggame_item[data-id=" +
                gameIdList[i] +
                "] .bettinggame_item_row:last-child"
            ).append(tempHtml);
          }
        }
        // 각 게임 'YES', 'NO' 참여 인원 넣어주기
        for (let i = 0; i < gameIdList.length; i++) {
          // 'YES'에 참여한 인원 넣어주기
          for (let j = 0; j < allGame[i]["yesmember"].length; j++) {
            let tempHtml = `<p>${allGame[i]["yesmember"][j]}</p>`;
            $(
              ".bettinggame_item[data-id=" +
                gameIdList[i] +
                "] .bettinggame_item_yes_content"
            ).append(tempHtml);
          }
          // 'NO'에 참여한 인원 넣어주기
          for (let j = 0; j < allGame[i]["nomember"].length; j++) {
            let tempHtml = `<p>${allGame[i]["nomember"][j]}</p>`;
            $(
              ".bettinggame_item[data-id=" +
                gameIdList[i] +
                "] .bettinggame_item_no_content"
            ).append(tempHtml);
          }
        }
        // 잠금설정된 게임의 세팅 변경
        $(".bettinggame_item[data-lock=true]").css("opacity", "0.4");
        $(".bettinggame_item[data-lock=true] .bettinggame_item_yes").css(
          "cursor",
          "default"
        );

        $(".bettinggame_item[data-lock=true] .bettinggame_item_no").css(
          "cursor",
          "default"
        );
        // 관리자 권한에게 모든 버튼 추가
        if (
          user["membership"] == "관리자" ||
          user["membership"] == "길드마스터" ||
          user["membership"] == "길드임원"
        ) {
          $(".bettinggame_item_row:last-child").empty();
          let tempHtml = `<div class="bettinggame_btn_done_yes">정산</div>
            <div class="bettinggame_btn_delete">삭제</div>
            <div class="bettinggame_btn_lock">잠금</div>
            <div class="bettinggame_btn_done_no">정산</div>`;
          $(".bettinggame_item_row:last-child").append(tempHtml);
        }
      } else {
        Swal.fire({
          title: response["title"],
          text: response["msg"],
          icon: "error",
          confirmButtonColor: "#5b7d97",
        }).then((result) => {
          location.href("/");
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
                      <div class="abilitystonegame_name">A</div>
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
                      <div class="abilitystonegame_name">B</div>
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
                      <div class="abilitystonegame_name">감소</div>
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
  if (abilitystoneA == 11 && abilitystoneB == 11 && abilitystoneC == 11) {
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
  } else {
    Swal.fire({
      title: "완료 실패",
      text: "남아있는 각인횟수가 있습니다.",
      icon: "error",
      confirmButtonColor: "#5b7d97",
    });
  }
});

// 니나브 찾기 게임
const findninavegameRandomNumber = Math.floor(Math.random() * 5) + 1;

$(".findninavegame_start_btn").click(function () {
  let decreasePoint = 4500;
  decreasePoints(decreasePoint, "findninavegamecount", 99);
  $(".findninavegame_start_container").hide();
  let tempHtml = `<div class="findninavegame_contentbox">
                    <div class="findninavegame_background">
                    <img id="findninavegame_card1" class="findninavegame_card" src="../static/img/findninavegame_backofcard.png" alt="">
                    <img id="findninavegame_card2" class="findninavegame_card" src="../static/img/findninavegame_backofcard.png" alt="">
                    <img id="findninavegame_card3" class="findninavegame_card" src="../static/img/findninavegame_backofcard.png" alt="">
                    <img id="findninavegame_card4" class="findninavegame_card" src="../static/img/findninavegame_backofcard.png" alt="">
                    <img id="findninavegame_card5" class="findninavegame_card" src="../static/img/findninavegame_backofcard.png" alt="">
                  </div>
                </div>`;
  $(".findninavegame_container").append(tempHtml);
});
let selectedCard = "";
// 니나브 찾기 게임 카드 클릭
$(document).on("click", ".findninavegame_card", function (event) {
  $(document).off("click", ".findninavegame_card");
  let resultPoint = 0;
  $(".findninavegame_card").attr(
    "src",
    "../static/img/findninavegame_koukusaton.png"
  );
  $("#findninavegame_card" + findninavegameRandomNumber).attr(
    "src",
    "../static/img/findninavegame_ninave.png"
  );
  selectedCard = $(event.currentTarget).attr("id");
  const tempHtml = `<div class="findninavegame_btn_done">완료</div>`;
  $(".findninavegame_background").append(tempHtml);
});
// 니나브 찾기 게임 완료 버튼 클릭
$(document).on("click", ".findninavegame_btn_done", function () {
  if (selectedCard == "findninavegame_card" + findninavegameRandomNumber) {
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
  // 파푸니카 낚시 게임 보상 애니메이션
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

// 포인트 룰렛 게임 시작
$("#pointroulettegame_start_btn").click(function () {
  let decreasePoint = 4500;
  decreasePoints(decreasePoint, "pointroulettegamecount", 99);
  $("#pointroulettegame_start_container").hide();
  const tempHtml = `<div id="pointroulettegame_contentbox">
                      <div id="pointroulettegame_background">
                      <div id="pointroulettegame_roulette"></div>
                      <div id="pointroulettegame_arrow"></div>
                      </div>
                      <div id="pointroulettegame_btn_start">시작</div>
                    </div>`;
  $("#pointroulettegame_container").append(tempHtml);
});

// 포인트 룰렛 게임, 룰렛 동작
const pointroulettegameRotate = () => {
  const pointroulettegameRandomNumber = Math.floor(Math.random() * 100) + 1;
  let pointroulettegameDeg = 0;
  if (pointroulettegameRandomNumber == 100) {
    pointroulettegameDeg = 180;
  } else if (pointroulettegameRandomNumber >= 98) {
    pointroulettegameDeg = 60;
  } else if (pointroulettegameRandomNumber >= 95) {
    pointroulettegameDeg = 300;
  } else if (pointroulettegameRandomNumber >= 65) {
    pointroulettegameDeg = 240;
  } else if (pointroulettegameRandomNumber >= 15) {
    pointroulettegameDeg = 120;
  } else {
    pointroulettegameDeg = 360;
  }
  const roulette = $("#pointroulettegame_roulette");
  let num = 0;
  let pointroulettegameAnimation = setInterval(() => {
    num++;
    roulette.css("transform", "rotate(" + 360 * num + "deg)");
    if (num === 50) {
      clearInterval(pointroulettegameAnimation);
      roulette.css("transform", "rotate(" + pointroulettegameDeg + "deg)");
    }
  }, 50);
  return pointroulettegameDeg;
};
// 포인트 룰렛 게임, 룰렛 시작
$(document).on("click", "#pointroulettegame_btn_start", function () {
  $("#pointroulettegame_btn_start").remove();
  let pointroulettegameDeg = pointroulettegameRotate();
  setTimeout(() => {
    let resultPoint;
    switch (pointroulettegameDeg) {
      case 360:
        resultPoint = 1;
        break;
      case 120:
        resultPoint = 1000;
        break;
      case 240:
        resultPoint = 5000;
        break;
      case 300:
        resultPoint = 10000;
        break;
      case 60:
        resultPoint = 50000;
        break;
      case 180:
        resultPoint = 100000;
    }
    Swal.fire({
      title: "축하드립니다!",
      text: resultPoint + "포인트를 적립합니다.",
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
  }, 5000);
});

// 보너스 룰렛 게임 시작
$("#bonusroulettegame_start_btn").click(function () {
  let decreasePoint = 0;
  let gamecount = 0;
  $.ajax({
    type: "GET",
    url: "/minigames/api_bonusroulettegamecount/",
    dataType: "json",
    data: {},
    success: function (response) {
      if (response["result"] == "SUCCESS") {
        gamecount = response["gamecount"];
        decreasePoints(decreasePoint, "bonusroulettegamecount", gamecount);
      } else {
        Swal.fire({
          title: "게임시작 실패",
          text: "일정 참여 횟수 부족",
          icon: "error",
          confirmButtonColor: "#5b7d97",
        }).then((result) => {
          location.reload();
        });
      }
    },
  });
  $("#bonusroulettegame_start_container").hide();
  const tempHtml = `<div id="bonusroulettegame_contentbox">
                      <div id="bonusroulettegame_background">
                      <div id="bonusroulettegame_roulette"></div>
                      <div id="bonusroulettegame_arrow"></div>
                      </div>
                      <div id="bonusroulettegame_btn_start">시작</div>
                    </div>`;
  $("#bonusroulettegame_container").append(tempHtml);
});

// 보너스 룰렛 게임, 룰렛 동작
const bonusroulettegameRotate = () => {
  const bonusroulettegameRandomNumber = Math.floor(Math.random() * 100) + 1;
  let bonusroulettegameDeg = 0;
  if (bonusroulettegameRandomNumber >= 99) {
    bonusroulettegameDeg = 180;
  } else if (bonusroulettegameRandomNumber >= 95) {
    bonusroulettegameDeg = 60;
  } else if (bonusroulettegameRandomNumber >= 89) {
    bonusroulettegameDeg = 300;
  } else if (bonusroulettegameRandomNumber >= 59) {
    bonusroulettegameDeg = 240;
  } else if (bonusroulettegameRandomNumber >= 9) {
    bonusroulettegameDeg = 120;
  } else {
    bonusroulettegameDeg = 360;
  }
  const roulette = $("#bonusroulettegame_roulette");
  let num = 0;
  let bonusroulettegameAnimation = setInterval(() => {
    num++;
    roulette.css("transform", "rotate(" + 360 * num + "deg)");
    if (num === 50) {
      clearInterval(bonusroulettegameAnimation);
      roulette.css("transform", "rotate(" + bonusroulettegameDeg + "deg)");
    }
  }, 50);
  return bonusroulettegameDeg;
};
// 보너스 룰렛 게임, 룰렛 시작
$(document).on("click", "#bonusroulettegame_btn_start", function () {
  $("#bonusroulettegame_btn_start").remove();
  let bonusroulettegameDeg = bonusroulettegameRotate();
  setTimeout(() => {
    let resultPoint;
    switch (bonusroulettegameDeg) {
      case 360:
        resultPoint = 1;
        break;
      case 120:
        resultPoint = 1000;
        break;
      case 240:
        resultPoint = 5000;
        break;
      case 300:
        resultPoint = 10000;
        break;
      case 60:
        resultPoint = 50000;
        break;
      case 180:
        resultPoint = 100000;
    }
    Swal.fire({
      title: "축하드립니다!",
      text: resultPoint + "포인트를 적립합니다.",
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
  }, 5000);
});

// 베팅 게임 추가하기 기능
$(document).on("click", ".bettinggame_btn_addgame", function () {
  let title = $("#bettinggame_addgame_title").val();
  let point = $("#bettinggame_addgame_point").val();
  if (title.length > 0 && isNaN(point) == false && 50000 >= point > 0) {
    $.ajax({
      type: "POST",
      url: "/minigames/api_addbettinggame/",
      dataType: "json",
      data: {
        title_give: title,
        point_give: point,
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
  } else {
    Swal.fire({
      title: "베팅 게임 추가 실패",
      text: "입력 형식이 올바르지 않습니다.",
      icon: "error",
      confirmButtonColor: "#5b7d97",
    }).then((result) => {
      return 0;
    });
  }
});
// 베팅게임 참여하기 기능 (YES)
$(document).on("click", ".bettinggame_item_yes", function (event) {
  let id = $(event.target).closest(".bettinggame_item").attr("data-id");
  let team = "yes";
  $.ajax({
    type: "POST",
    url: "/minigames/api_joinbettinggame/",
    dataType: "json",
    data: {
      id_give: id,
      team_give: team,
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
});

// 베팅게임 참여하기 기능 (NO)
$(document).on("click", ".bettinggame_item_no", function (event) {
  let id = $(event.target).closest(".bettinggame_item").attr("data-id");
  let team = "no";
  $.ajax({
    type: "POST",
    url: "/minigames/api_joinbettinggame/",
    dataType: "json",
    data: {
      id_give: id,
      team_give: team,
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
});

// 베팅게임 삭제 기능
$(document).on("click", ".bettinggame_btn_delete", function (event) {
  let id = $(event.target).closest(".bettinggame_item").attr("data-id");

  $.ajax({
    type: "POST",
    url: "/minigames/api_deletebettinggame/",
    dataType: "json",
    data: {
      id_give: id,
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

// 베팅게임 잠금 기능
$(document).on("click", ".bettinggame_btn_lock", function (event) {
  let id = $(event.target).closest(".bettinggame_item").attr("data-id");
  $.ajax({
    type: "POST",
    url: "/minigames/api_lockebettinggame/",
    dataType: "json",
    data: {
      id_give: id,
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

// 베팅게임 정산 기능(YES)
$(document).on("click", ".bettinggame_btn_done_yes", function (event) {
  let id = $(event.target).closest(".bettinggame_item").attr("data-id");
  let result = "yes";

  $.ajax({
    type: "POST",
    url: "/minigames/api_donebettinggame/",
    dataType: "json",
    data: {
      id_give: id,
      result_give: result,
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

// 베팅게임 정산 기능(NO)
$(document).on("click", ".bettinggame_btn_done_no", function (event) {
  let id = $(event.target).closest(".bettinggame_item").attr("data-id");
  let result = "no";

  $.ajax({
    type: "POST",
    url: "/minigames/api_donebettinggame/",
    dataType: "json",
    data: {
      id_give: id,
      result_give: result,
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

// window size가 작아지면 메뉴바 체인지
$(document).on("click", ".bi-list", function () {
  if ($("#header_list_container").css("display") == "none") {
    $("#header_list_container").css("display", "flex");
  } else {
    $("#header_list_container").css("display", "none");
  }
});
$(window).resize(function () {
  if (window.innerWidth > 680) {
    $("#header_list_container").css("display", "flex");
  } else {
    $("#header_list_container").css("display", "none");
  }
});
