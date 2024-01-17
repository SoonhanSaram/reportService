// 암호화를 위한 module

/* 단방향 암호화 (암호화 가능 / 복호화 불가능)
Hash : 고정된 길이의 문자열로 반환 
레인보우 테이블로 돌아가는 암호화 보완을 위해 salt 추가
*/

// crpyto lib import
import crypto from 'crypto'

export const salt = 'bnvcjkg4544!%46=='

export const encryptModule = (password) => {
    const hashAlgorithm = crypto.createHash('sha512') // sha 512 암호 알고리즘
    const hashing = hashAlgorithm.update(password + salt);
    const hashedPassword = hashing.digest('base64');


    return hashedPassword;
}

