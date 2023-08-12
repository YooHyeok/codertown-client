import axios from "axios"

export const reqToken = async (token, dispatch, cookie, setCookie) => {
    try {
        const res = await axios.post('/loginCheck', null,
            {
                headers: { Authorization: token + "," + cookie.refreshToken }
            });
    } catch (error) {
        if (error.request.status == 401) {
            const rescode = error.response.data.rescode;
            if (rescode == 101) { //refreshToken 유효, 두개의 토큰 재발급됨
                dispatch({ type: "NEWTOKEN", data: error.response.data.accessToken });

                const expires = new Date();
                expires.setDate(expires.getDate() + 1);
                setCookie('refreshToken', error.response.data.refreshToken, {
                    url: '/', expires
                })

            } else if (rescode == 102) {
                dispatch({ type: 'NEWTOKEN', data: '' });
                dispatch({ type: 'USERID', data: '' });
                document.location.href = "/";
            }
        }
    }

}