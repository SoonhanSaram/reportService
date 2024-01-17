import express from 'express'
import db from "../models/index.js"
import { Op, QueryTypes } from 'sequelize';
import { encryptModule } from '../module/crypto.js';
import upload from '../middleware/multer.js';
import fs from 'fs';

const { corporationinfo, userInfo, fileInfo } = db.models;
const router = express.Router();

// 회원 관리
router.get('/memberList/:offset/:limit', async (req, res, next) => {
    let { offset, limit } = req.params

    offset = parseInt(offset);
    limit = parseInt(limit);

    const name = null
    // let offset = 0;
    // let name = null;
    // let limit = 20;
    // let memberList;

    try {
        /**
         * pagination 을 위한 offset, limit
         * await userInfo.findAll({offset: x}) 
         * x 만큼 다음 자료를 검색하는 sequelize 명령어
         * 
         * limit 을 설정해 필요 이상의 데이터가 검색되는 것을 방지
         */


        // const memberList = await userInfo.findAll({ offset: offset, limit: limit });
        const countMember = await userInfo.count();

        /**
         * 커버링 인덱스를 활용한 쿼리 능률 향상
         * 커버링 인덱스 ? 
         * 쿼리를 충족시키는 데 필요한 모든 데이터를 갖고 있는 인덱스 
         * 
         * select, where, order by, limit, group by 등에서 사용되는 모든 칼럼이 인덱스 칼럼에 포함된 경우
         * 
         */

        if (name === null) {
            const query = `SELECT a.user_seq, a.user_name, a.user_authority, a.user_approval, a.corp_belongTo, b.corp_name
            from (SELECT user_seq, user_name, user_authority, user_approval, corp_belongTo from userInfo LIMIT ${offset}, ${limit}) a
            join corporationInfo b on a.corp_belongTo = b.corp_number;`

            // sequelize query
            // const memberList = await userInfo.findAll({
            // attributes: ['user_seq', 'user_name', 'user_authority', 'user_approval', 'corp_belongTo'],
            // offset: offset,
            // limit: limit,
            // include: [{
            // model: corporationinfo,
            // attributes: ['corp_number', 'corp_name'],
            // }],
            // });

            const memberList = await userInfo.sequelize.query(query, { type: QueryTypes.SELECT });

            console.log(memberList);
            // console.log(memberList, countMember);
            return res.status(200).json({ memberList: memberList, countMember: countMember });
        } else {
            const query = `SELECT a.user_seq, a.user_name, a.user_authority, a.user_approval, a.corp_belongTo 
            from (SELECT user_name from userInfo WHERE user_name like ' % ${name} %' LIMIT ${offset}, ${limit}) b 
            join userInfo a on a.user_name = b.user_name`
            const memberList = await userInfo.sequelize.query(query, { type: QueryTypes.SELECT })
            return res.status(200).json({ memberList: memberList, countMember: countMember });
        }
    } catch (error) {
        return res.status(404).send({ message: '검색에 내용이 존재하지 않습니다.' })
    }

})

router.get('/searchMember/:offset/:limit/:name', async (req, res, next) => {
    let { offset, limit, name } = req.params
    offset = parseInt(offset);
    limit = parseInt(limit);
    name = name.toString()
    // let offset = 0;
    // let name = null;
    // let limit = 20;
    // let memberList;
    try {
        /**
         * pagination 을 위한 offset, limit
         * await userInfo.findAll({offset: x}) 
         * x 만큼 다음 자료를 검색하는 sequelize 명령어
         * 
         * limit 을 설정해 필요 이상의 데이터가 검색되는 것을 방지
         */


        // const memberList = await userInfo.findAll({ offset: offset, limit: limit });
        const countMember = await userInfo.count();

        /**
         * 커버링 인덱스를 활용한 쿼리 능률 향상
         * 커버링 인덱스 ? 
         * 쿼리를 충족시키는 데 필요한 모든 데이터를 갖고 있는 인덱스 
         * 
         * select, where, order by, limit, group by 등에서 사용되는 모든 칼럼이 인덱스 칼럼에 포함된 경우
         * 
         */
        // console.log("체크1");
        /**
         *  관계 설정 
         *  userinfo.belongsTo(corporationinfo, { as: "corp_belongto_corporationinfo", foreignKey: "corp_belongto" });
            corporationinfo.hasMany(userinfo, { as: "userinfos", foreignKey: "corp_belongto" });
         */
        if (name === null) {
            const memberList = await userInfo.findAll({
                attributes: ['user_seq', 'user_name', 'user_authority', 'user_approval', 'corp_belongTo'],
                offset: offset,
                limit: limit,
                // include: [{
                //     model: corporationinfo,
                //     as: corp_belongto_corporationInfo,
                //     attributes: ['corp_name'],
                // }]
            });
            // console.log(memberList);
            return res.status(200).json({ memberList: memberList, countMember: countMember });
        } else {
            // console.log("체크2");
            const query = `SELECT a.user_seq, a.user_name, a.user_authority, a.user_approval, a.corp_belongTo 
            from (SELECT user_name from userInfo WHERE user_name like '%${name}%' LIMIT ${offset}, ${limit}) b 
            join userInfo a on a.user_name = b.user_name`
            const memberList = await userInfo.sequelize.query(query, { type: QueryTypes.SELECT })
            return res.status(200).json({ memberList: memberList, countMember: countMember });
        }
    } catch (error) {
        return res.status(404).send({ message: '검색에 내용이 존재하지 않습니다.' })
    }

})

router.delete('/deleteMember', async (req, res, next) => {
    const { userName } = req.body

    try {
        await userInfo.destroy({ where: { user_name: userName } });
        res.status(200).send({ message: '삭제가 완료되었습니다.' })
    } catch (error) {
        res.status(403).send({ message: '삭제 중 에러가 발생했습니다.' })
    }
})

router.put('/updatePassword', async (req, res, next) => {
    const { userName, password } = req.body;

    if (password === undefined) return null;

    const hashedPassword = encryptModule(password);

    /**
     * raw query 문 
     * const query = `UPDATE userInfo SET user_password = '${password}' WHERE user_name = '${userName}';` 
     */

    try {
        await userInfo.update({ user_password: hashedPassword }, { where: { user_name: userName } });
        res.status(200).send({ message: '변경 완료되었습니다..' })
    } catch (error) {
        res.status(403).send({ message: '변경 중 에러가 발생했습니다.' })
    }
})

// static 파일 관리
router.get('/getFormList', async (req, res, next) => {
    try {
        const result = await fileInfo.findAll(); // 추후 file 소유주를 통해서 admin 값만 가져오도록 설정
        if (typeof result === 'undefined' || result === null || result === "" || result.length === 0 || typeof result === 'object' && !Object.keys(result).length) {
            res.status(200).send({ message: "보고서 파일 리스트 없음" });
        }
        res.status(200).send({ message: "보고서 파일 get 성공", data: result });
    } catch (error) {
        res.status(401).send({ message: "GET 실패" });
    }
})
router.get('/getFormfile', async (req, res, next) => {

    // queryString 으로 전달한 params 구조분해 
    const { fileTitle, fileOriginalname } = req.query
    // console.log(fileTitle, fileOriginalname);

    try {
        console.log('체크1');
        const response = await fileInfo.findOne({ where: { file_name: fileTitle, file_original_name: fileOriginalname } })

        if (!response) {
            res.status(404).send({ message: '다운로드 할 수 없습니다.' })
        } else {
            console.log('체크2');
            res.download(`public/uploads/${response.file_path}`, response.file_name, (err) => {
                if (err) {
                    console.error('Error sending file:', err);
                    res.status(500).send({ message: '파일 다운로드 중 오류가 발생했습니다.' });
                } else {
                    console.log('체크4');
                }
            })
            // 파일이 버퍼형식으로 존재
            // stream.pipe(res);
        }
    } catch (error) {
        res.status(404).send({ message: '저장된 파일이 없습니다.' })
    }
})

/**
router.get('/getFormfile', async (req, res) => { // GPT 버전 코드
    const { fileTitle, fileOriginalname } = req.query;

    try {
        console.log('체크1');
        const response = await fileInfo.findOne({ where: { file_name: fileTitle, file_original_name: fileOriginalname } })

        if (!response) {
            res.status(404).send({ message: '다운로드 할 수 없습니다.' });
        } else {
            console.log('체크2');
            const filePath = path.join(__dirname, 'public/uploads', response.file_path);
            console.log('체크3');

            // Set the appropriate headers for the response
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename="${response.file_path}"`);

            // Create a readable stream from the file and pipe it to the response
            const stream = fs.createReadStream(filePath);
            stream.pipe(res);

            stream.on('error', (err) => {
                console.error('Error reading file:', err);
                res.status(500).send({ message: '파일 읽기 중 오류가 발생했습니다.' });
            });

            stream.on('end', () => {
                console.log('체크4');
            });
        }
    } catch (error) {
        res.status(404).send({ message: '저장된 파일이 없습니다.' });
    }
});
 */

router.post('/uploadFormFile', upload.single('file'), async (req, res) => {
    const file = req.file;
    const { fileTitle, fileExt } = req.body;

    const fileInfos = {
        fileOriginalName: Buffer.from(file.originalname, "latin1").toString("utf8"),
        filePath: file.filename,
        fileName: fileTitle,
        fileExt: fileExt,
    }
    // console.log(fileInfos);
    try {
        const result = await fileInfo.create({ file_name: fileInfos.fileName, file_original_name: fileInfos.fileOriginalName, file_ext: fileInfos.fileExt, file_path: fileInfos.filePath });
        res.status(200).send({ message: '파일 업로드 성공' })
    } catch (error) {
        res.status(403).send({ message: '파일 업로드 실패' })
    }
})

router.delete('/deleteFormFile', async (req, res) => {
    const { fileTitle } = req.body;
    console.log(fileTitle);

    try {
        // 실제 파일을 찾아서 삭제하기 위해서 db 에서 path 정보 가져오기
        const response = await fileInfo.findOne({ where: { file_name: fileTitle } });

        const filePath = response.file_path
        console.log('체크3');

        // 파일이 존재한다면 true 그렇지 않은 경우 false 반환
        if (fs.existsSync(`public/uploads/${filePath}`)) {
            try {
                fs.unlinkSync(`public/uploads/${filePath}`);
                await fileInfo.destroy({ where: { file_name: fileTitle } });
                res.status(200).send({ message: '파일 삭제 성공' });
            } catch (error) {
                res.status(404).send({ message: '삭제할 파일이 존재하지 않습니다.' });
            }
        } else {
            res.status(404).send({ message: '삭제할 파일이 존재하지 않습니다.' });
        }
    } catch (error) {
        res.status(403).send({ message: 'DB에 파일 정보가 없습니다.' })
    }
})

// 회원 기업 관리
router.get('/getCorpList', async (req, res) => {

    let { offset, limit } = req.query

    // req.query의 각 속성에 대해 parseInt를 적용
    Object.keys(req.query).forEach(key => {
        req.query[key] = parseInt(req.query[key]);
    });

    const query = `SELECT a.corp_number, a.corp_name, a.corp_category ,a.corp_tel, count(b.user_seq) AS user_count
                    from (SELECT corp_number, corp_name, corp_category, corp_tel from  corporationInfo LIMIT ${offset}, ${limit}) a
                    join userinfo b on a.corp_number = b.corp_belongTo
                    GROUP BY a.corp_number, a.corp_name, a.corp_category, a.corp_tel;`
    const countMember = await corporationinfo.count();
    try {
        const memberList = await corporationinfo.sequelize.query(query, { type: QueryTypes.SELECT });
        return res.status(200).json({ memberList: memberList, countMember: countMember });
    } catch (error) {
        return res.status(404).send({ message: '검색에 내용이 존재하지 않습니다.' })
    }
})

export default router;