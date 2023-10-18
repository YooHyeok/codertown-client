import axios from "axios"

export const reqToken = async (token, dispatch, cookie, setCookie) => {
    try {
        const res = await axios.post('/token-valid-check', null,
            {
                headers: { "X-AUTH-TOKEN": token + "," + cookie.refreshToken }
            });
    } catch (error) {
        console.log(error)
        if (error.request.status == 401) { //401 UnAuthorized (인증 만료)
            const rescode = error.response.data.rescode;
            if (rescode == 101) { //refreshToken 유효, 두개의 토큰 재발급됨
                dispatch({ type: "NEWTOKEN", data: error.response.data.accessToken });
                const expires = new Date();
                expires.setDate(expires.getDate() + 1);
                setCookie('refreshToken', error.response.data.refreshToken, {
                    url: '/', expires
                })
            } else if (rescode == 102) { //refresh 토큰 만료됨. 재로그인 요청(requestToken이 회원정보에 저장되어있다면 비밀번호 변경해야함)
                dispatch({ type: 'NEWTOKEN', data: '' });
                dispatch({ type: 'USERID', data: '' });
                document.location.href = "/";
            }
        }
    }

}