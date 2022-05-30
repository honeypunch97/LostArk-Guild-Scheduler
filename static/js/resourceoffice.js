$(document).ready(function () {
  userCheck();
  printCategory();
  printPost();
  findResourceofficeAnnouncement();
});

//로그인의 유무와 로그인한 정보의 권한을 체크, 권한별 컨텐츠 표시(일정추가)
function userCheck() {
  let myMembership = $(".mainlogo").attr("data-membership");
  if (myMembership == "사용자") {
    Swal.fire({
      title: "권한 없음",
      text: "승인이 필요합니다.",
      icon: "error",
      confirmButtonColor: "#5b7d97",
    }).then((result) => {
      location.href = "/";
    });
  } else if (
    myMembership == "관리자" ||
    myMembership == "길드마스터" ||
    myMembership == "길드임원"
  ) {
    //우측하단 일정추가하기 버튼 넣어주기
    let openDetailSchBtnHtml = `<i onclick="openAddCategoryContainer()" class="bi bi-plus-square"></i>`;
    $(".btn_container").append(openDetailSchBtnHtml);
    let addCategoryHtml = `<div class="add_category_container">
        <div class="add_category_box">
            <div class="add_category_title_container">
                <div class="add_category_title">항목 추가하기</div>
                <div onclick="closeAddCategoryContainer()" class="btn_close_add_category">X</div>
            </div>
            <div class="add_category_content_container">
                <select>
                    <option></option>
                    <option>아르고스</option>
                    <option>발탄</option>
                    <option>비아키스</option>
                    <option>쿠크세이튼</option>
                    <option>아브렐슈드</option>
                    <option>일리아칸</option>
                    <option>카양겔</option>
                </select>
                <div onclick="addCategory()" class="btn_add_category">추가하기</div>
            </div>
        </div>
    </div>`;
    $("footer").append(addCategoryHtml);
  }
}

//항목 불러오기 기능
function printCategory() {
  $.ajax({
    type: "GET",
    url: "/resourceoffice/api_printcategory/",
    dataType: "json",
    data: {},
    success: function (response) {
      let tempHtml = ``;
      let myMembership = response["membership"];
      let all_category = response["all_category"];
      for (let i = 0; i < all_category.length; i++) {
        let tempHtml = `<div class="content_container" data-id = ${all_category[i]["_id"]}>
                        <div class="content_title_box">
                            <div class="content_title_box_title_container">${all_category[i]["category"]}</div>
                            <div onclick="openJoinCategoryContainer(event)" class="btn_join_this_category">신청하기</div>
                        </div>
                        <div class="content_content_box">
                            <div class="content_item">
                                <div class="content_item_title content_item_title_nickname">닉네임</div>
                                <div class="content_item_title content_item_title_class">직업</div>
                                <div class="content_item_title content_item_title_level">레벨</div>
                                <div class="content_item_title content_item_title_memo">메모</div>
                                <div class="content_item_title content_item_title_btn"></div>
                            </div>
                        </div>
                    </div>`;
        $(".resourceoffice_container").append(tempHtml);
      }
      for (let i = 0; i < all_category.length; i++) {
        let categoryId = all_category[i]["_id"];
        for (let j = 0; j < all_category[i]["member"].length; j++) {
          let userNickname = all_category[i]["member"][j]["nickname"];
          let userClass = all_category[i]["member"][j]["class"];
          let userLevel = all_category[i]["member"][j]["level"];
          let userMemo = all_category[i]["member"][j]["memo"];
          tempHtml = `<div class="content_item">
                                        <div class="content_item_content content_item_nickname">${userNickname}</div>
                                        <div class="content_item_content content_item_class">${userClass}</div>
                                        <div class="content_item_content content_item_level">${userLevel}</div>
                                        <div class="content_item_content content_item_memo">${userMemo}</div>
                                        <div class="content_item_content content_item_btn"></div>
                                    </div>`;
          let correctCategory = $(
            `.content_container[data-id='${categoryId}']`
          );
          correctCategory.find(".content_content_box").append(tempHtml);
        }
      }
      //권한이 관리자일때, 삭제하기 버튼 추가
      if (
        myMembership == "관리자" ||
        myMembership == "길드마스터" ||
        myMembership == "길드임원"
      ) {
        tempHtml = `<div onclick="deleteCategory(event)" class="btn_delete_this_category">삭제하기</div>`;
        $(".content_title_box").append(tempHtml);
        tempHtml = `<div onclick="leaveCategory(event)" class="btn_delete_thisuser"><i class="bi bi-x-lg"></i></div>`;
        $(".content_item_btn").append(tempHtml);
      } else if (myMembership == "길드원") {
        let btnDeleteMyCategory = $(".content_item_nickname").filter(
          function () {
            return $(this).text() === response["nickname"];
          }
        );
        tempHtml = `<div onclick="leaveCategory(event)" class="btn_delete_thisuser"><i class="bi bi-x-lg"></i></div>`;
        btnDeleteMyCategory.nextAll(".content_item_btn").append(tempHtml);
      }
    },
  });
}

//항목 추가 창, 창 열기
function openAddCategoryContainer() {
  $(".add_category_container").css("display", "flex");
}

//항목 추가 창, 창 닫기
function closeAddCategoryContainer() {
  $(".add_category_container").css("display", "none");
}

//항목 추가 창, 항목 추가 기능
function addCategory() {
  let category = $(".add_category_content_container > select").val();
  if (category == "") {
    Swal.fire({
      title: "항목 추가 실패",
      text: "항목을 선택해주세요.",
      icon: "error",
      confirmButtonColor: "#5b7d97",
    }).then((result) => {
      return 0;
    });
  } else {
    $.ajax({
      type: "POST",
      url: "/resourceoffice/api_addcategory/",
      dataType: "json",
      data: {
        category_give: category,
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
}

//항목 삭제 기능
function deleteCategory(e) {
  let categoryId = $(e.currentTarget)
    .closest(".content_container")
    .attr("data-id");
  Swal.fire({
    title: "항목을 삭제하겠습니까?",
    text: "삭제한 항목은 되돌릴 수 없습니다.",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#5b7d97",
    cancelButtonColor: "#bbdefb",
    confirmButtonText: "YES",
    cancelButtonText: "NO",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        type: "POST",
        url: "/resourceoffice/api_deletecategory/",
        dataType: "json",
        data: {
          categoryid_give: categoryId,
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

//항목 신청하기 창 열기
function openJoinCategoryContainer(e) {
  let categoryId = $(e.currentTarget)
    .closest(".content_container")
    .attr("data-id");
  $(".join_category_container").attr("data-id", categoryId);
  $(".join_category_container").css("display", "flex");
}

//항목 신청하기 창 닫기
function closeJoinCategoryContainer() {
  $(".join_category_container").css("display", "none");
}

//참가하기 기능
function JoinCategory(e) {
  let categoryId = $(".join_category_container").attr("data-id");
  let myClass = $(
    ".join_category_content_container > .join_category_content_row:nth-child(2) > .join_category_content_content > select"
  ).val();
  let myLevel = $("#join_category_level").val();
  let myMemo = $("#join_category_memo").val();
  if (myLevel == "") {
    Swal.fire({
      title: "미입력 오류",
      text: "레벨을 입력해주세요.",
      icon: "error",
      confirmButtonColor: "#5b7d97",
    }).then((result) => {
      return 0;
    });
  } else {
    $.ajax({
      type: "POST",
      url: "/resourceoffice/api_joincategory/",
      dataType: "json",
      data: {
        categoryid_give: categoryId,
        class_give: myClass,
        level_give: myLevel,
        memo_give: myMemo,
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
}

//탈퇴하기 기능
function leaveCategory(e) {
  let categoryId = $(e.currentTarget)
    .closest(".content_container")
    .attr("data-id");
  let btnContainer = $(e.currentTarget).closest(".content_item_btn");
  let myNickname = btnContainer.prevAll(".content_item_nickname").text();
  let myClass = btnContainer.prevAll(".content_item_class").text();
  let myLevel = btnContainer.prevAll(".content_item_level").text();
  let myMemo = btnContainer.prevAll(".content_item_memo").text();

  $.ajax({
    type: "POST",
    url: "/resourceoffice/api_leavecategory/",
    dataType: "json",
    data: {
      categoryid_give: categoryId,
      nickname_give: myNickname,
      class_give: myClass,
      level_give: myLevel,
      memo_give: myMemo,
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

//게시글 가져오기 기능
function printPost() {
  $.ajax({
    type: "GET",
    url: "/resourceoffice/api_print_jobsearch_posts/",
    dataType: "json",
    data: {},
    success: function (response) {
      if (response["result"] == "SUCCESS") {
        let all_post = response["all_post"];
        for (let i = 0; i < all_post.length; i++) {
          let temp_html = `<div class="read_item" data-id="${all_post[i]["_id"]}">
                                    <div class="read_item_title">
                                        <div class="read_item_title_text">${all_post[i]["nickname"]}</div>
                                    </div>
                                    <div class="read_item_content">
                                    <textarea  readonly>${all_post[i]["content"]}</textarea>
                                    <div class="read_item_comment">${all_post[i]["time"]}</div>
                                    </div>
                                </div>`;
          $(".read_section").append(temp_html);
        }
      }
      if (
        response["membership"] == "관리자" ||
        response["membership"] == "길드마스터" ||
        response["membership"] == "길드임원"
      ) {
        let tempHtml = `<div onclick="deletePost(event)" class="btn_delete_this_post"><i class="bi bi-x-lg"></i></div>`;
        $(".read_item_title").append(tempHtml);
      } else if (response["membership"] == "길드원") {
        let tempHtml = `<div onclick="deletePost(event)" class="btn_delete_this_post"><i class="bi bi-x-lg"></i></div>`;
        let myPost = $(".read_item_title_text").filter(function () {
          return $(this).text() == response["nickname"];
        });
        myPost.nextAll(".read_item_title").append(tempHtml);
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

//작성하기 최소화, 최대화 토글버튼
function btn_toggle_writebox() {
  if ($(".write_box_content").css("display") == "none") {
    $(".write_box_content").css("display", "flex");
    $(".write_box_title").css("border-radius", "0.5rem 0.5rem 0 0");
    $(".btn_toggle_writebox").text("최소화");
  } else {
    $(".write_box_content").css("display", "none");
    $(".write_box_title").css("border-radius", "0.5rem");
    $(".btn_toggle_writebox").text("최대화");
  }
}

//구인구직 게시글 작성하기 기능
function writePost() {
  let postContent = $("#write_content").val();

  $.ajax({
    type: "POST",
    url: "/resourceoffice/api_write_jobsearch_post/",
    dataType: "json",
    data: {
      content_give: postContent,
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

//구인구직 게시글 삭제하기 기능
function deletePost(e) {
  let postId = $(e.currentTarget).closest(".read_item").attr("data-id");

  $.ajax({
    type: "POST",
    url: "/resourceoffice/api_delete_jobsearch_post/",
    dataType: "json",
    data: {
      id_give: postId,
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

//인력사무소 공지 출력 기능
function findResourceofficeAnnouncement() {
  let announcement = $(".announcement");
  $.ajax({
    type: "GET",
    url: "/resourceoffice/api_print_resourceoffice_announcement/",
    dataType: "json",
    data: {},
    success: function (response) {
      announcement.text(response["announcement"]);
    },
  });
}

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

// window size가 작아지면 공지버튼 없애기
$(window).resize(function () {
  if (window.innerWidth <= 570) {
    $(".btn_announcement").css("display", "none");
  } else {
    $(".btn_announcement").css("display", "flex");
  }
});
