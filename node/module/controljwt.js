// 클라이언트가 가지고 있는 accessToken 을 검증하는 미들웨어 controljwt.js
import jwt from 'jsonwebtoken'
// 서버 secret code import 
import { secret as configSecret, secret } from '../config/secret.js'
import { redisClient } from './redis.js'


// 엑세스 토큰 발급 모듈
const issueAccessToken = (uName, uAuthority, corpName) => {
    return jwt.sign({ name: uName, autho: uAuthority, cName: corpName }, secret, {
        algorithm: 'HS256',
        expiresIn: '1h'
    });
};

// 토큰 인증 모듈
const verifyToken = (token) => {
    let decoded = null;
    try {
        decoded = jwt.verify(token, secret);
        return {
            ok: true,
            id: decoded.name,
            role: decoded.autho
        };
    } catch (error) {
        return {
            ok: false,
            message: error.message,
        }
    }
};
// 리프레시 토큰 발급
// 보안사항으로는 HTTP ONLY 와 secure 
const issueRefreshToken = () => {
    return jwt.sign({}, secret, {
        algorithm: 'HS256',
        expiresIn: '14d'
    })
};
const verifyRefreshToken = async (token, uName) => {
    // redis module 은 promise 를 반환하지 않는다고 한다.
    const getAsync = promiseify(redisClient.get).bind(redisClient);
    try {
        const data = await getAsync(uName);
        if (token === data) {
            try {
                jwt.verify(token, secret);
                return true
            } catch (error) {
                return false
            }
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}

export {
    issueAccessToken, verifyToken, verifyRefreshToken, issueRefreshToken,
};
