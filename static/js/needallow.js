function btnLogout(){
    $.removeCookie('mytoken', {path: '/'});
    Swal.fire({
        title: '로그아웃 성공',
        text: '로그아웃을 성공했습니다.',
        icon: 'success',
        confirmButtonColor: '#4b6457',
    }).then((result) => {
        location.href = "/";
    })
}