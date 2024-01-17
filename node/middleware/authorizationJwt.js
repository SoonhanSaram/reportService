import { verifyToken } from '../module/controljwt.js'

export const authorizationJwt = (req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split('Bearer ')[1];
        const result = verifyToken(token);

        if (result.ok) {
            req.name = result.name;
            req.role = result.autho;
            next();
        } else {
            console.log('인증 실패');
            res.status(401).send({
                ok: false,
                message: result.message,
            })
        }
    }
}