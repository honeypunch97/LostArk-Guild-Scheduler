$(document).ready(function () {
  userCheck();
  printPost();
});

//로그인의 유무와 로그인한 정보의 권한을 체크, 권한별 컨텐츠 표시(일정추가)
function userCheck() {
  let myMembership = $(".mainlogo").attr("data-membership");
  if (myMembership == "사용자") {
    Swal.fire({
      title: "승인되지 않은 회원",
      text: "권한 승인이 필요합니다.",
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
    let temp_html = `<div onclick="btn_delete_allpost()" class="btn_delete_allpost">전체 삭제</div>`;
    $(".write_box_title > .write_box_title_subbox:nth-child(1)").append(
      temp_html
    );
  }
}

//게시글 가져오기
function printPost() {
  $.ajax({
    type: "GET",
    url: "/anonymousboard/api_print_posts/",
    dataType: "json",
    data: {},
    success: function (response) {
      let all_post = response["all_post"];
      for (let i = 0; i < all_post.length; i++) {
        let temp_html = `<div class="read_item">
                                    <div class="read_item_title">${all_post[i]["title"]}</div>
                                    <div  class="read_item_content">
                                    <textarea readonly>${all_post[i]["content"]}</textarea>
                                    <div class="read_item_comment">${all_post[i]["time"]}</div>
                                    </div>
                                 </div>`;
        $(".read_section").append(temp_html);
      }
    },
  });
}

//전체 게시글 삭제 기능(관리자만 사용가능)
function btn_delete_allpost() {
  Swal.fire({
    title: "전체 게시글을 삭제하겠습니까?",
    text: "삭제한 게시글은 되돌릴 수 없습니다.",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#5b7d97",
    cancelButtonColor: "#bbdefb",
    confirmButtonText: "YES",
    cancelButtonText: "NO",
  }).then((result) => {
    if (result.isConfirmed) {
      let myNickname = $(".mainlogo").attr("data-nickname");
      $.ajax({
        type: "GET",
        url: "/anonymousboard/api_delete_allpost/",
        dataType: "json",
        data: { nickname_give: myNickname },
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

//게시글 작성하기 기능
function writePost() {
  let postTitle = $("#write_title").val();
  if (postTitle.length == 0 || $("#write_content").val().length == 0) {
    Swal.fire({
      title: "게시글 작성 실패",
      text: "입력이 필요합니다.",
      icon: "error",
      confirmButtonColor: "#5b7d97",
    });
    return 0;
  }
  if (postTitle.length > 20) {
    Swal.fire({
      title: "게시글 작성 실패",
      text: "제목의 최대 글자수를 초과했습니다. (최대 20자)",
      icon: "error",
      confirmButtonColor: "#5b7d97",
    });
    return 0;
  }
  let postContent = $("#write_content").val();

  $.ajax({
    type: "POST",
    url: "/anonymousboard/api_write_post/",
    dataType: "json",
    data: {
      title_give: postTitle,
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
      }
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
