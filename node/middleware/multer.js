// middleware/multer.js
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { v4 } from 'uuid'

// 파일 업로드 폴더 설정
const uploadDir = path.join('public/uploads');

const storageOption = {
    filename: (req, file, cb) => { // 파일명 설정

        const uuidPrefix = v4();
        // multer 의 busboy 패키지가 한글을 latin1  형식으로 디코딩하기 때문에 한글이 깨짐 그러므로 utf-8 형식으로 바꿔준다.
        const hashFileName = Buffer.from(`${uuidPrefix}-${file.originalname}`, "latin1").toString("utf-8"); // 파일 명을 uuid-파일명으로 변경

        const uploadFileName = hashFileName.substring(hashFileName.length - 255);
        cb(null, uploadFileName);
    },
    destination: (req, file, cb) => {
        if (!fs.existsSync(uploadDir)) {
            /**
               * 만약 public/upload/images라는 폴더를 생성하려고 할 때
               * public/upload 폴더가 있으면 문제없이 images 폴더가 생성
               * 하지만 public폴더만 있고 upload폴더가 없거나
               * 또는 public폴더가 없을 경우, 폴더 생성에서 오류가 발생
               *
               * 이 때 recursive 속성을 true로 설정하면 모든 경로에 대해
               * 검사한 후 폴더가 없으면 순차적으로 모두 생성
               * nodejs 10.x 이상에서 사용
               */
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    }
};

const storage = multer.diskStorage(storageOption);
export default multer({ storage });