$(document).ready(function (){
    userCheck()
    printPost()
    findResourceofficeAnnouncement()
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
            location.href = '/';
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

    }
}

//게시글 가져오기 기능
function printPost(){
    $.ajax({
        type: 'GET',
        url: '/jobsearch/api_print_jobsearch_posts/',
        dataType: 'json',
        data: {},
        success: function (response) {
            if (response['result'] == 'SUCCESS') {
                let all_post = response['all_post']
                for (let i = 0; i < all_post.length; i++) {
                    let temp_html = `<div class="read_item" data-id="${all_post[i]['_id']}">
                                    <div class="read_item_title">
                                        <div class="read_item_btn_container"></div>
                                        <div class="read_item_title_text">${all_post[i]['nickname']}</div>
                                        <div class="read_item_btn_container"></div>
                                    </div>
                                    <textarea class="read_item_content" readonly>${all_post[i]['content']}</textarea>
                                    <div class="read_item_comment">${all_post[i]['time']}</div>
                                </div>`
                    $('.read_section').append(temp_html);
                }
            }
            if (response['membership'] == '관리자') {
                let tempHtml = `<div onclick="deletePost(event)" class="btn_delete_this_post">X</div>`
                $('.read_item_btn_container:last-child').append(tempHtml)
            } else if(response['membership'] == '승인회원'){
                let tempHtml = `<div onclick="deletePost(event)" class="btn_delete_this_post">X</div>`
                let myPost = $('.read_item_title_text').filter(function (){
                    return $(this).text() == response['nickname'];
                })
                myPost.nextAll('.read_item_btn_container').append(tempHtml)
            }
        else
            {
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

//게시글 삭제하기 기능
function deletePost(e){
    let postId = $(e.currentTarget).closest('.read_item').attr('data-id');

    $.ajax({
            type: 'POST',
            url: '/jobsearch/api_delete_jobsearch_post/',
            dataType: 'json',
            data: {
                'id_give': postId
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
                else {
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
    let postContent = $('#write_content').val()

    $.ajax({
            type: 'POST',
            url: '/jobsearch/api_write_jobsearch_post/',
            dataType: 'json',
            data: {
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
                else {
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

//공지 토글버튼
function toggleAnnouncement(){
    const announcementBtn = document.querySelector('.btn_announcement')
    const announcementContainer = document.querySelector('.announcement')
    //클래스네임 확인해서, 토글
    if (announcementBtn.className=='btn_announcement bi bi-megaphone'){
        announcementContainer.style.display='none'
        announcementBtn.classList.replace('bi-megaphone','bi-megaphone-fill')
    }
    //클래스네임 확인해서, 토글
    else{
        announcementContainer.style.display='block'
        announcementBtn.classList.replace('bi-megaphone-fill','bi-megaphone')
    }
}

//인력사무소 공지 출력 기능
function findResourceofficeAnnouncement() {
    let announcement = $('.announcement')
    $.ajax({
        type: 'GET',
        url: '/resourceoffice/api_print_resourceoffice_announcement/',
        dataType: 'json',
        data:{},
        success: function (response) {
            announcement.text(response['announcement'])
        }
    })
}
