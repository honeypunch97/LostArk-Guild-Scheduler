$(document).ready(function (){
    userCheck()
    printPost()
})

//로그인의 유무와 로그인한 정보의 권한을 체크, 권한별 컨텐츠 표시(일정추가)
function userCheck() {
    let myMembership = $('.mainlogo').attr('data-membership')
    if (myMembership == '비로그인') {
        Swal.fire({
            title: '비로그인',
            text: '로그인이 필요합니다.',
            icon: 'error',
            confirmButtonColor: '#5b7d97',
        }).then((result) => {
            location.href = '/mainpage/';
        })
    }
    else if(myMembership == '비승인회원'){
        Swal.fire({
            title: '승인되지 않은 회원',
            text: '관리자의 승인이 필요합니다.',
            icon: 'error',
            confirmButtonColor: '#5b7d97',
        }).then((result) => {
            location.href = '/needallow/';
        })
    }
    else if(myMembership == '관리자'){
        let temp_html = `<div onclick="btn_delete_allpost()" class="btn_delete_allpost">전체 삭제</div>`
        $('.write_box_title > .write_box_title_subbox:nth-child(1)').append(temp_html)
    }
}

//게시글 가져오기
function printPost(){
    $.ajax({
        type: 'GET',
        url: '/anonymousboard/api_print_posts/',
        dataType: 'json',
        data: {},
        success: function (response) {
            let all_post = response['all_post']
            for(let i=0; i<all_post.length; i++) {
                let temp_html = `<div class="read_item">
                                    <div class="read_item_title">${all_post[i]['title']}</div>
                                    <textarea class="read_item_content" readonly>${all_post[i]['content']}</textarea>
                                    <div class="read_item_comment">${all_post[i]['time']}</div>
                                 </div>`;
                $('.read_section').append(temp_html);
            }
        }
    })
}

//전체 게시글 삭제 기능(관리자만 사용가능)
function btn_delete_allpost() {
    Swal.fire({
        title: '전체 게시글을 삭제하겠습니까?',
        text: '삭제한 게시글은 되돌릴 수 없습니다.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#5b7d97',
        cancelButtonColor: '#bbdefb',
        confirmButtonText: 'YES',
        cancelButtonText: 'NO',
    }).then((result) => {
        if (result.isConfirmed) {
            let myNickname = $('.mainlogo').attr('data-nickname')
            $.ajax({
                type: 'GET',
                url: '/anonymousboard/api_delete_allpost/',
                dataType: 'json',
                data: {'nickname_give': myNickname},
                success: function (response) {
                    if(response['result'] == 'SUCCESS'){
                        Swal.fire({
                        title: response['title'],
                        text: response['msg'],
                        icon: 'success',
                        confirmButtonColor: '#5b7d97',
                    }).then((result) => {
                        location.reload()
                    })
                    }
                    else{
                        Swal.fire({
                        title: response['title'],
                        text: response['msg'],
                        icon: 'error',
                        confirmButtonColor: '#5b7d97',
                    }).then((result) => {
                        location.reload()
                    })
                    }
                }
            })
        }
    })
}

//작성하기 최소화, 최대화 토글버튼
function btn_toggle_writebox(){
    if ($('.btn_toggle_writebox').attr('class') == 'btn_toggle_writebox toggleon'){
        $('.write_box_content').css('display','none');
        $('.write_box_comment').css('display','none');
        $('.btn_toggle_writebox').text('최대화')
        $('.btn_toggle_writebox').attr('class', 'btn_toggle_writebox toggleoff')
    }
    else{
        $('.write_box_content').css('display','flex');
        $('.write_box_comment').css('display','flex');
        $('.btn_toggle_writebox').text('최소화')
        $('.btn_toggle_writebox').attr('class', 'btn_toggle_writebox toggleon')
    }
}

//게시글 작성하기 기능
function writePost(){
    let postTitle = $('#write_title').val()
    if (postTitle.length > 20) {
        Swal.fire({
            title: '게시글 작성 실패',
            text: '제목의 최대 글자수를 초과했습니다. (최대 20자)',
            icon: 'error',
            confirmButtonColor: '#5b7d97',
        })
        return 0;
    }
    let postContent = $('#write_content').val()

    $.ajax({
            type: 'POST',
            url: '/anonymousboard/api_write_post/',
            dataType: 'json',
            data: {
                'title_give': postTitle,
                'content_give': postContent
            },
            success: function (response) {
                if (response['result'] == 'SUCCESS'){
                    Swal.fire({
                    title: response['title'],
                    text: response['msg'],
                    icon: 'success',
                    confirmButtonColor: '#5b7d97',
                }).then((result) => {
                    location.reload()
                })
                }
            }
        })
}