import { issueAccessToken, verifyToken, verifyRefreshToken } from '../module/controljwt.js'
import jwt from 'jsonwebtoken'

// accesstoken 만료시 refreshtoken 으로 accesstoken 재발급 함수
const refresh = async (req, res) => {
    // headers 에서 토큰 존재 유무 확인
    if (req.headers.authorization && req.headers.refresh) {
        const authToken = req.headers.authorization.split('Bearer ')[1];
        const refreshToken = req.headers.refresh;

        //  access token 검증 
        const authResult = verifyToken(authToken);

        // 토큰에서 user 정보 추출
        const decoded = jwt.decode(authToken);

        // user 정보가 없으면 권한 없음
        if (decoded == null) {
            res.status(401).send({
                ok: false,
                message: 'No authorized'
            });
        }

        // user 정보를 가져와 refreshtoken 을 검증
        const refreshResult = verifyRefreshToken(refreshToken, decoded.name)

        // accesstoken 이 만료되어 있고 authresult.ok 가 false 일 때,
        if (authResult.ok === false && authResult.message === 'jwt expired') {
            // refresh token 도 만료된 상황
            if (refreshResult.ok === false) {
                res.status(401).send({
                    ok: false,
                    message: 'No authorized'
                })
            } else {
                const newAccessToken = issueAccessToken();

                res.status(200).send({
                    ok: true,
                    data: {
                        accessToken: newAccessToken,
                    }
                })
            }
        } else {
            res.status(400).send({
                ok: false,
                message: 'not expired Access token yet!'
            })
        }
    }
}

module.exports = refresh;