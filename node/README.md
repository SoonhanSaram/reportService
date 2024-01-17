# XSS 공격 : 해커가 클라이언트 브라우저에 JavaScript 를 삽입해 실행하는 공격
# CSRF 공격 : 공격자가 다른 사이트에서 우리 사이트의 API 콜을 요청해 실행하는 공격

- 해결 방법 HTTPS 에서 Secure Cookie 와 HTTP Only 쿠키를 사용해 자바스크립트 기반 
공격을 방어 

- Secure Cookie : 웹브라우저와 웹서버가 HTTPS 로 통신하는 경우에만 웹브라우저가 쿠키를 서버로 전송하는 옵션

- HTTP Only : 자바스크립트로 쿠키를 조회하는 것을 막는 옵션

# multer 모듈

- 이미지, 동영상 등을 비롯한 여러 가지 파일들을 멀티파트 형식으로 업로드 할 때 사용하는 미들웨어
- '멀티파트 형식' ? enctype 이 multipart/form-data 

