/**
* express generator ES6+ Template
* @author : callor@callor.com
* @since : 2020-12-10
* @update : 2023-01-19
* @see : nodejs + express 프로젝트에서 ES6+ 문법을 사용하기 위한 template
*/

// essential modules
import express from 'express';
import createError from 'http-errors';
import path from 'path';

import cors from 'cors'

// 3rd party lib modules  
import cookieParser from 'cookie-parser';
import logger from 'morgan';

// router modules import
import regist from "../routes/regist.js";
import login from "../routes/login.js";
import admin from "../routes/admin.js";
import content from '../routes/content.js';

// jwt 인증 미들웨어
import { authorizationJwt } from '../middleware/authorizationJwt.js';

// db 정보 import 
import db from '../models/index.js'

// create express framework
const app = express();

// cors  허용 
app.use(cors());

db.sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터 베이스 연결 성공');
  })
  .catch((err) => {
    console.log(err);
  })

// Disable the fingerprinting of this web technology.
app.disable("x-powered-by");

// view engine setup
app.set('views', path.join('views'));
app.set('view engine', 'react');


// middleWare enable
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join("public")));
// jwt 인증 미들웨어 적용
app.use('/admin', authorizationJwt);

// router link enable
app.use('/regist', regist);
app.use('/login', login);
app.use('/admin', admin);
app.use('/content', content);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;