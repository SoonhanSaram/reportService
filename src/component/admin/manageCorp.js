import { useState } from "react";
import { useCommonContext } from "../../provider/common";
import { Paging } from "../common/pagination";

export const ManageCorp = () => {
    const { getToken, memberListInfo, setMemberListInfo, setPaging, paging, isOpenModal, openModal } = useCommonContext();

    const [name, setName] = useState();
    const { offset, limit } = paging;

    const { memberList } = memberListInfo;

    // 특정 아이디로 회원 검색
    const getList = async () => {
        const accessToken = getToken();

        //  회원 리스트 초기화 
        setMemberListInfo({
            ...memberList,
            memberList: null,
        })

        const queryString = new URLSearchParams({
            offset: offset,
            limit: limit
        })

        // fetch 옵션 설정
        const fetchOption = {
            method: "GET",
            headers: {
                'authorization': `Bearer ${accessToken}`
            }
        };
        const response = await fetch(`/admin/getCorpList?${queryString}`, fetchOption)
        // json data 로 변환
        const result = await response.json();

        if (result != null) {
            // result 결과가 있을 경우 회원 리스트 할당
            setMemberListInfo({
                ...memberListInfo,
                memberList: result.memberList,
                memberLength: result.countMember
            })
            // pagination 에 쓸 전체 회원 수 저장
            setPaging(
                {
                    ...paging,
                    totalItems: result.countMember
                }
            )
        }
    }

    // api 에서 넘겨 받은 data 를 tbody 에 표현
    const viewMemberList = () => {
        if (memberList != null) {
            return memberList.map((item, index) => (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.corp_name}</td>
                    <td>{item.corp_number}</td>
                    <td>{item.user_count}</td>
                </tr>
            ));
        } else {
            return (
                <tr>
                    <td colSpan="4">검색된 정보가 없습니다.</td>
                </tr>
            );
        }
    }

    return (
        <>
            <div className="search-wrap">
                <label htmlFor="search" className="blind">검색 조건</label>
                <input id="search" type="search" name="" placeholder="검색어를 입력해주세요." value={name} onChange={(e) => setName(e.target.value)} />
                {/* <label> 조회 개수 선택 */}
                {/* <select onChange={handleItem}> */}
                {/* <option value={10} >10개</option> */}
                {/* <option value={20} >20개</option> */}
                {/* <option value={30} >30개</option> */}
                {/* <option value={40} >40개</option> */}
                {/* </select> */}
                {/* </label> */}
                <button type="submit" className="btn" onClick={getList}>검색</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>순번</th>
                        <th>회사명</th>
                        <th>사업자번호</th>
                        <th>사원 수</th>
                    </tr>
                </thead>
                <tbody>
                    {viewMemberList()}
                </tbody>
            </table>
            {/* <button onClick={getList} >삭제</button> */}
            {/* 함수를 props 로 전달하는 방법 */}
            <Paging callback={getList} />
            {/* {isOpenModal ? <PasswordModal index={passwordIdx} /> : null} */}
        </>
    )
}