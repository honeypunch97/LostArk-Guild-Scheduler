$(document).ready(function () {
  userCheck();
  printSch();
  findMainAnnouncement();
});

//로그인의 유무와 로그인한 정보의 권한을 체크, 권한별 컨텐츠 표시(일정추가)
function userCheck() {
  let myMembership = $(".mainlogo").attr("data-membership");
  if (myMembership == "비로그인") {
    Swal.fire({
      title: "비로그인",
      text: "로그인이 필요합니다.",
      icon: "error",
      confirmButtonColor: "#5b7d97",
    }).then((result) => {
      location.href = "/";
    });
  } else if (myMembership == "비승인회원") {
    location.href = "/needallow/";
  } else if (myMembership == "승인회원") {
    //우측하단 일정추가하기 버튼 넣어주기
    let openDetailSchBtnHtml = `<i onclick="openBtn()" class="bi bi-plus-square"></i>`;
    $(".btn_container").append(openDetailSchBtnHtml);

    //일정추가하기창 넣어주기(고정팟, )
    let addSchContainerHtml = `<div class="addsch_container">
                                    <div class="addsch_box">
                                        <div class="addsch_title">
                                            <div></div>
                                            <h1>일정추가</h1>
                                            <div onclick="closeBtn()" class="btn_close">X</div>
                                        </div>
                                        <div class="addsch_content">
                                            <div class="addsch_content_row">
                                                <div class="addsch_content_item">
                                                    <div>난이도</div>
                                                    <select id="addsch_difficulty">
                                                        <option>노말</option>
                                                        <option>하드</option>
                                                        <option>헬</option>
                                                    </select>
                                                </div>
                                                <div class="addsch_content_item">
                                                    <div>컨텐츠</div>
                                                    <select id="addsch_content">
                                                        <option>토벌전</option>
                                                        <option>카양겔</option>
                                                        <option>아르고스</option>
                                                        <option>발탄</option>
                                                        <option>비아키스</option>
                                                        <option>쿠크세이튼</option>
                                                        <option>아브렐슈드</option>
                                                        <option>일리아칸</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="addsch_content_row">
                                                <div class="addsch_content_item">
                                                    <div>관문</div>
                                                    <select id="addsch_gate">
                                                        <option>관문없음</option>
                                                        <option>1~2관문</option>
                                                        <option>1~3관문</option>
                                                        <option>1~4관문</option>
                                                        <option>1~6관문</option>
                                                        <option>3~4관문</option>
                                                        <option>5~6관문</option>
                                                    </select>
                                                </div>
                                                <div class="addsch_content_item">
                                                    <div>요일</div>
                                                    <select id="addsch_day">
                                                        <option>수</option>
                                                        <option>목</option>
                                                        <option>금</option>
                                                        <option>토</option>
                                                        <option>일</option>
                                                        <option>월</option>
                                                        <option>화</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="addsch_content_row">
                                                <div class="addsch_content_item">
                                                    <div>시간</div>
                                                    <select id="addsch_time">
                                                        <option>00:00</option>
                                                        <option>01:00</option>
                                                        <option>02:00</option>
                                                        <option>03:00</option>
                                                        <option>04:00</option>
                                                        <option>05:00</option>
                                                        <option>06:00</option>
                                                        <option>07:00</option>
                                                        <option>08:00</option>
                                                        <option>09:00</option>
                                                        <option>10:00</option>
                                                        <option>11:00</option>
                                                        <option>12:00</option>
                                                        <option>13:00</option>
                                                        <option>14:00</option>
                                                        <option>15:00</option>
                                                        <option>16:00</option>
                                                        <option>17:00</option>
                                                        <option>18:00</option>
                                                        <option>19:00</option>
                                                        <option>20:00</option>
                                                        <option>21:00</option>
                                                        <option>22:00</option>
                                                        <option>23:00</option>
                                                        <option>24:00</option>
                                                    </select>
                                                </div>
                                                <div class="addsch_content_item">
                                                    <div>메모</div>
                                                    <input type="text" name="addsch_memo" id="addsch_memo">
                                                </div>
                                            </div>
                                            <div class="addsch_content_row">
                                                <div onclick="addSch()" class="btn_insertsch">추가하기</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
    $("footer").append(addSchContainerHtml);
  } else if (myMembership == "관리자") {
    //우측하단 일정추가하기 버튼 넣어주기
    let openDetailSchBtnHtml = `<i onclick="openBtn()" class="bi bi-plus-square"></i>`;
    $(".btn_container").append(openDetailSchBtnHtml);

    //일정 추가하기 창 넣어주기(display:none)
    let addSchContainerHtml = `<div class="addsch_container">
        <div class="addsch_box">
            <div class="addsch_title">
                <div></div>
                <h1>일정추가</h1>
                <div onclick="closeBtn()" class="btn_close">X</div>
            </div>
            <div class="addsch_content">
                <div class="addsch_content_row">
                    <div class="addsch_content_item">
                        <div>난이도</div>
                        <select id="addsch_difficulty">
                            <option>노말</option>
                            <option>하드</option>
                            <option>헬</option>
                        </select>
                    </div>
                    <div class="addsch_content_item">
                        <div>컨텐츠</div>
                        <select id="addsch_content">
                            <option>토벌전</option>
                            <option>카양겔</option>
                            <option>아르고스</option>
                            <option>발탄</option>
                            <option>비아키스</option>
                            <option>쿠크세이튼</option>
                            <option>아브렐슈드</option>
                            <option>일리아칸</option>
                        </select>
                    </div>
                </div>
                <div class="addsch_content_row">
                    <div class="addsch_content_item">
                        <div>관문</div>
                        <select id="addsch_gate">
                            <option>관문없음</option>
                            <option>1~2관문</option>
                            <option>1~3관문</option>
                            <option>1~4관문</option>
                            <option>1~6관문</option>
                            <option>3~4관문</option>
                            <option>5~6관문</option>
                        </select>
                    </div>
                    <div class="addsch_content_item">
                        <div>요일</div>
                        <select id="addsch_day">
                            <option>수</option>
                            <option>목</option>
                            <option>금</option>
                            <option>토</option>
                            <option>일</option>
                            <option>월</option>
                            <option>화</option>
                        </select>
                    </div>
                </div>
                <div class="addsch_content_row">
                    <div class="addsch_content_item">
                        <div>시간</div>
                        <select id="addsch_time">
                            <option>00:00</option>
                            <option>01:00</option>
                            <option>02:00</option>
                            <option>03:00</option>
                            <option>04:00</option>
                            <option>05:00</option>
                            <option>06:00</option>
                            <option>07:00</option>
                            <option>08:00</option>
                            <option>09:00</option>
                            <option>10:00</option>
                            <option>11:00</option>
                            <option>12:00</option>
                            <option>13:00</option>
                            <option>14:00</option>
                            <option>15:00</option>
                            <option>16:00</option>
                            <option>17:00</option>
                            <option>18:00</option>
                            <option>19:00</option>
                            <option>20:00</option>
                            <option>21:00</option>
                            <option>22:00</option>
                            <option>23:00</option>
                            <option>24:00</option>
                        </select>
                    </div>
                    <div class="addsch_content_item">
                        <div>메모</div>
                        <input type="text" name="addsch_memo" id="addsch_memo">
                    </div>
                </div>
                <div class="addsch_content_row">
                    <div class="addsch_content_item">
                        <div>고정팟</div>
                        <input type="checkbox" name="fixedparty" id="fixedparty">
                        <label for="fixedparty"></label>
                        <div>반복일정</div>
                        <input type="checkbox" name="repeatsch" id="repeatsch">
                        <label for="repeatsch"></label>
                    </div>
                    <div onclick="addSch()" class="btn_insertsch">추가하기</div>
                </div>
            </div>
        </div>
    </div>`;
    $("footer").append(addSchContainerHtml);

    //세부일정창, 일정삭제하기 버튼 넣어주기
    let btnDeleteSchHtml = `<div onclick="detailSchDeleteBtn(event)" class="btn_delete_sch">일정 삭제하기</div>`;
    $(".detail_sch_content_btn_box").append(btnDeleteSchHtml);
  }
}

//로드후, 일정들 db에서 가져와서 화면에 뿌려주기
function printSch() {
  $.ajax({
    type: "GET",
    url: "/thisweeksch/api_printsch/",
    dataType: "json",
    data: {},
    success: function (response) {
      let tempNickname = $(".mainlogo").attr("data-nickname");
      let sch_id_list = response["sch_id_list"];
      let all_sch = response["all_sch"];
      let temp_html;

      let contentCategory = [];
      //난이도와 컨텐츠 조합해서 모든 경우의 row 만들어주기
      for (let i = 0; i < all_sch.length; i++) {
        if (
          contentCategory.includes(
            "[" + all_sch[i]["difficulty"] + "]" + all_sch[i]["content"]
          )
        ) {
        } else {
          contentCategory.push(
            "[" + all_sch[i]["difficulty"] + "]" + all_sch[i]["content"]
          );
          temp_html = `<div class="category_schedule_row" data-difficulty="${all_sch[i]["difficulty"]}" data-content="${all_sch[i]["content"]}">
                                    <div class="category_schedule_title">[${all_sch[i]["difficulty"]}]${all_sch[i]["content"]}</div>
                                    <div class="category_schedule_contents"></div>
                                </div>`;
          $(".category_schedule_container").append(temp_html);
        }
      }

      //일정들을 만들어서, 알맞는 위치에 넣어주기
      for (let i = 0; i < all_sch.length; i++) {
        //일정별 멤버리스트 가공, 추후 수정가능있음 (처음부터 가공해서 넣어주면 더 좋을듯)
        let schMember = [];
        for (let j = 0; j < $(all_sch[i]["member"]).length; j++) {
          schMember.push(all_sch[i]["member"][j]);
        }

        //넣어줄 일정 teml_html
        temp_html = `<div onclick="schDetail(event)" class="table_schedule_content" 
                                data-difficulty="${all_sch[i]["difficulty"]}" data-content="${all_sch[i]["content"]}"
                                data-day="${all_sch[i]["day"]}" data-time="${all_sch[i]["time"]}" data-gate="${all_sch[i]["gate"]}"
                                data-id="${sch_id_list[i]}" data-member="${schMember}" data-memo="${all_sch[i]["memo"]}"
                                data-fixedparty="${all_sch[i]["fixedparty"]}" data-repeatsch="${all_sch[i]["repeatsch"]}">
                                <div class="table_schedule_content_title">
                                    <div class="main_title_box">
                                        <div class="main_title"><i class="bi bi-pin-angle"></i></div>
                                        <div class="main_title">[${all_sch[i]["difficulty"]}]</div>
                                        <div class="main_title">${all_sch[i]["content"]}</div>
                                        <div class="main_title">${all_sch[i]["gate"]}</div>
                                        <div class="main_title"><i class="bi bi-chat-dots"></i></div>
                                    </div>
                                    <div class="sub_title_box">
                                        <div class="sub_title">${all_sch[i]["day"]}요일</div>
                                        <div class="sub_title">${all_sch[i]["time"]}</div>
                                        <div class="sub_title">${all_sch[i]["member"].length}명</div>
                                    </div>
                                </div>
                                <div class="table_schedule_users"></div>
                            </div>`;

        //시간표별, 각 요일에 맞춰 넣어주기
        switch (all_sch[i]["day"]) {
          case "월":
            $(
              ".table_schedule_column_monday > .table_schedule_contents"
            ).append(temp_html);
            break;
          case "화":
            $(
              ".table_schedule_column_tuesday > .table_schedule_contents"
            ).append(temp_html);
            break;
          case "수":
            $(
              ".table_schedule_column_wednesday > .table_schedule_contents"
            ).append(temp_html);
            break;
          case "목":
            $(
              ".table_schedule_column_thursday > .table_schedule_contents"
            ).append(temp_html);
            break;
          case "금":
            $(
              ".table_schedule_column_friday > .table_schedule_contents"
            ).append(temp_html);
            break;
          case "토":
            $(
              ".table_schedule_column_saturday > .table_schedule_contents"
            ).append(temp_html);
            break;
          case "일":
            $(
              ".table_schedule_column_sunday > .table_schedule_contents"
            ).append(temp_html);
            break;
        }

        //항목별, 각 항목에 맞춰 넣어주기
        let categoryScheduleContents = $(
          `.category_schedule_row[data-difficulty='${all_sch[i]["difficulty"]}'][data-content='${all_sch[i]["content"]}']`
        );
        categoryScheduleContents
          .find(".category_schedule_contents")
          .append(temp_html);

        //이번주 일정 페이지에서 추가한 일정의 색상 바꿔주기(new sch)
        if (all_sch[i]["new"] == "true") {
          $(
            ".table_schedule_content[data-id = " +
              sch_id_list[i] +
              "] > .table_schedule_content_title"
          ).css("background-color", "#ff7669");
        }

        //본인이 참여한 일정의 색을 바꿔주기
        if (schMember.map((row) => row.nickname).includes(tempNickname)) {
          $(
            ".table_schedule_content[data-id = " +
              sch_id_list[i] +
              "] > .table_schedule_content_title"
          ).css("background-color", "var(--color_deep_dark)");
        }

        //메모의 내용이 있는 일정에 아이콘 표시
        if (all_sch[i]["memo"] != "") {
          $(
            ".table_schedule_content[data-id = " +
              sch_id_list[i] +
              "] .bi-chat-dots"
          ).css("display", "flex");
        }

        //고정팟이 체크된 일정에 아이콘 표시
        if (all_sch[i]["fixedparty"] == "true") {
          $(
            ".table_schedule_content[data-id = " +
              sch_id_list[i] +
              "] .bi-pin-angle"
          ).css("display", "flex");
        }
      }
    },
  });
}

//일정 추가 창에서 추가하기 버튼 클릭시, 종합된 데이터들을 DB에 넣어주기
function addSch() {
  let difficulty = $("#addsch_difficulty option:selected").val();
  let content = $("#addsch_content option:selected").val();
  let gate = $("#addsch_gate option:selected").val();
  let day = $("#addsch_day option:selected").val();
  let time = $("#addsch_time option:selected").val();
  let memo = $("#addsch_memo").val();
  if (memo.length > 300) {
    Swal.fire({
      title: "일정 추가 실패",
      text: "메모의 최대 입력수를 초과했습니다. (최대 300자)",
      icon: "error",
      confirmButtonColor: "#5b7d97",
    });
    return 0;
  }
  let fixedparty = $("#fixedparty").is(":checked");
  let repeatsch = $("#repeatsch").is(":checked");
  $.ajax({
    type: "POST",
    url: "/thisweeksch/api_addsch/",
    dataType: "json",
    data: {
      difficulty_give: difficulty,
      content_give: content,
      gate_give: gate,
      day_give: day,
      time_give: time,
      memo_give: memo,
      fixedparty_give: fixedparty,
      repeatsch_give: repeatsch,
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
}

//메인화면, 일정추가창 열기 버튼
function openBtn() {
  $(".addsch_container").css("display", "flex");
}

//일정 추가 창, 창닫기 버튼
function closeBtn() {
  $(".addsch_container").css("display", "none");
}

//일정클릭시 세부 일정 보기창 열기, data넣어주기
function schDetail(e) {
  $(".detail_sch_container").css("display", "flex");
  let sch = $(e.currentTarget);
  $(".detail_sch_container").attr("data-id", sch.attr("data-id"));
  $(".detail_sch_item_difficulty > .detail_sch_item_content").text(
    sch.attr("data-difficulty")
  );
  $(".detail_sch_item_contentname > .detail_sch_item_content").text(
    sch.attr("data-content")
  );
  $(".detail_sch_item_gate > .detail_sch_item_content").text(
    sch.attr("data-gate")
  );
  $(".detail_sch_item_day > .detail_sch_item_content").text(
    sch.attr("data-day")
  );
  $(".detail_sch_item_time > .detail_sch_item_content").text(
    sch.attr("data-time")
  );
  $(".detail_sch_item_memo > .detail_sch_item_content").text(
    sch.attr("data-memo")
  );
  if (sch.attr("data-fixedparty") == "true") {
    $(".detail_sch_item_fixedparty > .detail_sch_item_content").text("O");
  } else {
    $(".detail_sch_item_fixedparty > .detail_sch_item_content").text("X");
  }
  if (sch.attr("data-repeatsch") == "true") {
    $(".detail_sch_item_repeatsch > .detail_sch_item_content").text("O");
  } else {
    $(".detail_sch_item_repeatsch > .detail_sch_item_content").text("X");
  }

  $.ajax({
    type: "POST",
    url: "/thisweeksch/api_printdetailedschmember/",
    dataType: "json",
    data: { sch_id_give: sch.attr("data-id") },
    success: function (response) {
      if (response["result"] == "SUCCESS") {
        let sch = response["sch"];
        let myInfo = response["myinfo"];
        let memberNickname;
        let memberClass;
        let isMember = false; //본인이 일정에 참여되어 있는지 체크

        //{무제한: (토벌전)}, {4인: (쿠크세이튼, 카양겔)}, {8인: (이외)}
        if (sch["content"] == "토벌전") {
          //참여하기 버튼 넣어주기
          let btnJoinSchHtml = `<div onclick="detailSchJoinSch(event)" class="btn_join_sch">참여하기</div>`;
          $(".detail_sch_content_btn_box").append(btnJoinSchHtml);
        } else if (
          sch["content"] == "쿠크세이튼" ||
          sch["content"] == "카양겔"
        ) {
          if (sch["member"].length < 4) {
            //참여하기 버튼 넣어주기
            let btnJoinSchHtml = `<div onclick="detailSchJoinSch(event)" class="btn_join_sch">참여하기</div>`;
            $(".detail_sch_content_btn_box").append(btnJoinSchHtml);
          }
        } else {
          if (sch["member"].length < 8) {
            //참여하기 버튼 넣어주기
            let btnJoinSchHtml = `<div onclick="detailSchJoinSch(event)" class="btn_join_sch">참여하기</div>`;
            $(".detail_sch_content_btn_box").append(btnJoinSchHtml);
          }
        }

        for (let i = 0; i < sch["member"].length; i++) {
          memberNickname = sch["member"][i]["nickname"];
          if (memberNickname == myInfo["nickname"]) {
            isMember = true;
            $("div.btn_join_sch").remove();
          }
          memberClass = sch["member"][i]["class"];
          let temp_html = `<div class="detail_sch_member_row_content">
                                    <div class="detail_sch_member_content">${memberNickname}</div>
                                    <div class="detail_sch_member_content">${memberClass}</div>
                                </div>`;
          $(".detail_sch_member_section").append(temp_html);
        }

        let myNickname = myInfo["nickname"];
        let myMembership = myInfo["membership"];

        if (myMembership == "관리자") {
          let btnDoneSchHtml = `<div onclick="detailSchDoneSch(event)" class="btn_done_sch">일정완료</div>`;
          $(".detail_sch_content_btn_box").append(btnDoneSchHtml);

          let btnLeaveSchHtml = `<div onclick="detailSchLeaveSch(event)" class="btn_detail_sch_delete_member">X</div>`;
          $(".detail_sch_member_row_content").append(btnLeaveSchHtml);
        } else if (myMembership == "승인회원") {
          let btnDeleteMySch = $(
            ".detail_sch_member_content:nth-child(1)"
          ).filter(function () {
            return $(this).text() === myNickname;
          });
          let btnLeaveSchHtml = `<div onclick="detailSchLeaveSch(event)" class="btn_detail_sch_delete_member">X</div>`;
          btnDeleteMySch
            .parent(".detail_sch_member_row_content")
            .append(btnLeaveSchHtml);

          if (isMember == true) {
            let btnDoneSchHtml = `<div onclick="detailSchDoneSch(event)" class="btn_done_sch">일정완료</div>`;
            $(".detail_sch_content_btn_box").append(btnDoneSchHtml);
          }
        }
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

//세부 일정 보기창, 창닫기 버튼
function detailSchCloseBtn() {
  $("div.btn_join_sch").remove();
  $(".btn_done_sch").remove();
  $(".detail_sch_member_row_content").remove();
  $(".detail_sch_container").css("display", "none");
}

//세부 일정 보기창, 일정삭제하기 기능
function detailSchDeleteBtn(e) {
  Swal.fire({
    title: "일정을 삭제하겠습니까?",
    text: "삭제한 일정은 되돌릴 수 없습니다.",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#5b7d97",
    cancelButtonColor: "#bbdefb",
    confirmButtonText: "YES",
    cancelButtonText: "NO",
  }).then((result) => {
    if (result.isConfirmed) {
      let sch_id = $(".detail_sch_container").attr("data-id");
      $.ajax({
        type: "POST",
        url: "/thisweeksch/api_deletesch/",
        dataType: "json",
        data: {
          sch_id_give: sch_id,
        },
        success: function (response) {
          if (response["result"] == "SUCCESS") {
            if (result.isConfirmed) {
              Swal.fire({
                title: response["title"],
                text: response["msg"],
                icon: "success",
                confirmButtonColor: "#5b7d97",
              }).then((result) => {
                location.reload();
              });
            }
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
}

//세부 일정 보기창, 참여하기 버튼 클릭, 참여 직업 선택 기능
function detailSchJoinSch(e) {
  let user_class1 = $(".mainlogo").attr("data-class1");
  let user_class2 = $(".mainlogo").attr("data-class2");
  let user_class3 = $(".mainlogo").attr("data-class3");
  let user_class4 = $(".mainlogo").attr("data-class4");
  let user_class5 = $(".mainlogo").attr("data-class5");
  let user_class6 = $(".mainlogo").attr("data-class6");
  let user_nickname = $(".mainlogo").attr("data-nickname");
  $(".join_sch_container").css("display", "flex");

  $(".join_sch_row:nth-child(2) > .join_sch_item:first-child").text(
    user_nickname
  );
  $(".join_sch_class").append("<option>" + user_class1 + "</option>");
  $(".join_sch_class").append("<option>" + user_class2 + "</option>");
  $(".join_sch_class").append("<option>" + user_class3 + "</option>");
  $(".join_sch_class").append("<option>" + user_class4 + "</option>");
  $(".join_sch_class").append("<option>" + user_class5 + "</option>");
  $(".join_sch_class").append("<option>" + user_class6 + "</option>");
}

//세부 일정 보기창, 일정 완료하기 기능
function detailSchDoneSch(e) {
  let sch_id = $(".detail_sch_container").attr("data-id");
  $.ajax({
    type: "POST",
    url: "/thisweeksch/api_donesch/",
    dataType: "json",
    data: {
      sch_id_give: sch_id,
    },
    success: function (response) {
      if (response["result"]) {
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

//세부 일정 보기창, 일정 탈퇴하기 기능
function detailSchLeaveSch(e) {
  let sch_id = $(".detail_sch_container").attr("data-id");
  let myNickname = $(e.target).prevAll(".detail_sch_member_content")[1]
    .innerText;
  let myClass = $(e.target).prevAll(".detail_sch_member_content")[0].innerText;

  $.ajax({
    type: "POST",
    url: "/thisweeksch/api_leavesch/",
    dataType: "json",
    data: {
      sch_id_give: sch_id,
      nickname_give: myNickname,
      selectedclass_give: myClass,
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

//참여 직업 선택 창, 일정 참여 버튼 기능
//로그인한 현재 사용자의 닉네임과 선택한 직업을 해당되는 일정의 멤버로 넣어주기
function detailSchJoinSchConfirm(e) {
  let sch_id = $(".detail_sch_container").attr("data-id");
  let selectedclass = $(".join_sch_class").val();

  $.ajax({
    type: "POST",
    url: "/thisweeksch/api_joinsch/",
    dataType: "json",
    data: {
      sch_id_give: sch_id,
      selectedclass_give: selectedclass,
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
      } else if (response["result"] == "FAIL") {
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

//참여 직업 선택창 닫기 버튼
function CloseSelectClassBtn() {
  $(".join_sch_container").css("display", "none");
}

//메인공지 내용 가져와서, 출력해주기
function findMainAnnouncement() {
  let announcement = $(".announcement");
  $.ajax({
    type: "GET",
    url: "/api_find_main_announcement/",
    dataType: "json",
    data: {},
    success: function (response) {
      announcement.text(response["announcement"]);
    },
  });
}
//공지 토글버튼
function toggleAnnouncement() {
  const announcementBtn = document.querySelector(".btn_announcement");
  const announcementContainer = document.querySelector(".announcement");
  //클래스네임 확인해서, 토글
  if (announcementBtn.className == "btn_announcement bi bi-megaphone") {
    announcementContainer.style.display = "none";
    announcementBtn.classList.replace("bi-megaphone", "bi-megaphone-fill");
  }
  //클래스네임 확인해서, 토글
  else {
    announcementContainer.style.display = "block";
    announcementBtn.classList.replace("bi-megaphone-fill", "bi-megaphone");
  }
}
//요일별, 항목별 토글버튼
function toggleView() {
  const toggleViewBtn = document.querySelector(".btn_toggleView");
  const tableView = document.querySelector(".table_schedule_container");
  const categoryView = document.querySelector(".category_schedule_container");
  //클래스네임 확인해서, 토글
  if (toggleViewBtn.className == "btn_toggleView bi bi-filter-square") {
    tableView.style.display = "none";
    categoryView.style.display = "flex";
    toggleViewBtn.classList.replace(
      "bi-filter-square",
      "bi-filter-square-fill"
    );
  }
  //클래스네임 확인해서, 토글
  else {
    tableView.style.display = "flex";
    categoryView.style.display = "none";
    toggleViewBtn.classList.replace(
      "bi-filter-square-fill",
      "bi-filter-square"
    );
  }
}
