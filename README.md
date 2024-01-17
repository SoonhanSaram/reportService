# 프론트 React, 서버 Express

- CRA 를 통한 react 프로젝트 생성
- express "프로젝트명" --vies=react 를 통한 express 프로젝트 생성

# refresh token 을 제어하기 위한 react-cookie 설치

```
yarn add react-cookie
```

## xlsx-js-style 을 쓰고 있던 와중에 write 시 데이터 누락 발생

- 셀 병합이 문제였다, xlsx 에서 merge 를 통해서 특정 셀들을 병합해도, 데이터를 넣어줄 땐, 병합된 셀에 하나 하나 데이터가 
다 들어간다고 생각하기 때문에 병합된 셀만큼 공백을 넣어줘야 데이터가 누락없이 제대로 나오게 된다.