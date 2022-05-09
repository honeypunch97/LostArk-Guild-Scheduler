$(document).ready(function () {
  userCheck();
  printPointRanking();
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

//포인트 랭킹 가져와서 출력해주기, 내 포인트 출력
function printPointRanking() {
  $.ajax({
    type: "GET",
    url: "/minigames/api_printpointranking/",
    dataType: "json",
    data: {},
    success: function (response) {
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

let probability = 75;
let random_number;
let abilitystoneA = 1;
let abilitystoneB = 1;
let abilitystoneC = 1;
let abilitystoneASuccessNumber = 0;
let abilitystoneBSuccessNumber = 0;
let abilitystoneCSuccessNumber = 0;

function abilitystoneGameStoneA() {
  if (abilitystoneA <= 10) {
    random_number = Math.floor(Math.random() * 101);
    if (random_number < probability) {
      if (probability <= 25) {
        probability = 25;
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
        $("#abilitystonegame_probability").text(probability + "%");
      } else {
        probability = probability - 10;
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
        $("#abilitystonegame_probability").text(probability + "%");
      }
    } else {
      if (probability >= 75) {
        probability = 75;
        abilitystoneA = abilitystoneA + 1;
        $(
          ".abilitystonegame_row:nth-child(2) > .diamond:nth-child(" +
            abilitystoneA +
            ")"
        ).css("background-color", "gray");
        $("#abilitystonegame_probability").text(probability + "%");
      } else {
        probability = probability + 10;
        abilitystoneA = abilitystoneA + 1;
        $(
          ".abilitystonegame_row:nth-child(2) > .diamond:nth-child(" +
            abilitystoneA +
            ")"
        ).css("background-color", "gray");
        $("#abilitystonegame_probability").text(probability + "%");
      }
    }
  }
}
function abilitystoneGameStoneB() {
  if (abilitystoneB <= 10) {
    random_number = Math.floor(Math.random() * 101);
    if (random_number < probability) {
      if (probability <= 25) {
        probability = 20;
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
        $("#abilitystonegame_probability").text(probability + "%");
      } else {
        probability = probability - 10;
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
        $("#abilitystonegame_probability").text(probability + "%");
      }
    } else {
      if (probability >= 75) {
        probability = 75;
        abilitystoneB = abilitystoneB + 1;
        $(
          ".abilitystonegame_row:nth-child(3) > .diamond:nth-child(" +
            abilitystoneB +
            ")"
        ).css("background-color", "gray");
        $("#abilitystonegame_probability").text(probability + "%");
      } else {
        probability = probability + 10;
        abilitystoneB = abilitystoneB + 1;
        $(
          ".abilitystonegame_row:nth-child(3) > .diamond:nth-child(" +
            abilitystoneB +
            ")"
        ).css("background-color", "gray");
        $("#abilitystonegame_probability").text(probability + "%");
      }
    }
  }
}
function abilitystoneGameStoneC() {
  if (abilitystoneC <= 10) {
    random_number = Math.floor(Math.random() * 101);
    if (random_number < probability) {
      if (probability <= 25) {
        probability = 25;
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
        $("#abilitystonegame_probability").text(probability + "%");
      } else {
        probability = probability - 10;
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
        $("#abilitystonegame_probability").text(probability + "%");
      }
    } else {
      if (probability >= 75) {
        probability = 75;
        abilitystoneC = abilitystoneC + 1;
        $(
          ".abilitystonegame_row:nth-child(4) > .diamond:nth-child(" +
            abilitystoneC +
            ")"
        ).css("background-color", "gray");
        $("#abilitystonegame_probability").text(probability + "%");
      } else {
        probability = probability + 10;
        abilitystoneC = abilitystoneC + 1;
        $(
          ".abilitystonegame_row:nth-child(4) > .diamond:nth-child(" +
            abilitystoneC +
            ")"
        ).css("background-color", "gray");
        $("#abilitystonegame_probability").text(probability + "%");
      }
    }
  }
}
function abilitystoneGameInIt() {
  probability = 75;
  abilitystoneA = 1;
  abilitystoneB = 1;
  abilitystoneC = 1;
  abilitystoneASuccessNumber = 0;
  abilitystoneBSuccessNumber = 0;
  abilitystoneCSuccessNumber = 0;
  $("#abilitystonegame_probability").text("75%");
  $(".diamond").css("background-color", "white");
  $(".abilitystonegame_numberofsuccess").text(0);
}
