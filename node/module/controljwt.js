// 클라이언트가 가지고 있는 accessToken 을 검증하는 미들웨어 controljwt.js
import jwt from 'jsonwebtoken'
// 서버 secret code import 
import { secret } from '../config/secret.js'
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
        // console.log('토큰 인증 중', token);
        decoded = jwt.verify(token, secret);
        // console.log('토큰 인증', decoded);
        return {
            ok: true,
            id: decoded.name,
            role: decoded.autho,
            corp: decoded.cName,
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
    try {
        await redisClient.connect();
        const data = await redisClient.get(uName);

        console.log('리프레시 토큰확인', data);

        await redisClient.disconnect();

        if (token === data) {
            jwt.verify(token, secret);
            return true;
        } else {
            return false;
        };

    } catch (error) {
        return false;
    }
}

export {
    issueAccessToken, verifyToken, verifyRefreshToken, issueRefreshToken,
};
