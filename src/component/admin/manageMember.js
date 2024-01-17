import { useState } from "react";
import { useCommonContext } from "../../provider/common"
import { Paging } from "../common/pagination"
import { PasswordModal } from "./passwordModal";

export const ManageMember = () => {
    const { getToken, memberListInfo, setMemberListInfo, setPaging, paging, isOpenModal, openModal } = useCommonContext();

    const [name, setName] = useState();
    const { offset, limit } = paging;

    const [passwordIdx, setPasswordIdx] = useState();
    const passwordModal = (idx) => {
        setPasswordIdx(idx)
        openModal()
    }

    // memberList state
    const { memberList } = memberListInfo;

    // input name 할당 
    const handelNmae = (e) => {
        setName(e.target.value)
    }

    // 특정 아이디로 회원 검색
    const serchMember = async () => {
        const accessToken = localStorage.getItem('accessToken');

        //  회원 리스트 초기화 
        setMemberListInfo({
            ...memberList,
            memberList: null,
        })

        // fetch 옵션 설정
        const fetchOption = {
            method: "GET",
            headers: {
                'authorization': `Bearer ${accessToken}`
            }
        };
        const response = await fetch(`/admin/searchMember/${offset}/${limit}/${name}`, fetchOption)
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

    // 회원 탈퇴 요청 함수 
    const handleDeleteMemeber = async (userName) => {
        const answer = window.confirm("정말로 회원정보를 삭제하시겠습니까?");

        const accessToken = localStorage.getItem('accessToken');

        if (answer) {
            const fetchOption = {
                method: "DELETE",
                headers: {
                    'authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userName: userName
                })
            };

            // delete method api 호출
            const response = await fetch(`/admin/deleteMember`, fetchOption)
            const result = await response.json()

            if (response.status === 200) {
                alert(result.message)
                getList()
            } else {
                alert(result.message)
            }
        } else {
            return null
        }
    }

    // 회원 리시트를 받아 오는 method
    const getList = async () => {
        const accessToken = localStorage.getItem('accessToken');

        //  회원 리스트 초기화 
        setMemberListInfo({
            ...memberList,
            memberList: null,
        })

        // fetch 옵션 설정
        const fetchOption = {
            method: "GET",
            headers: {
                'authorization': `Bearer ${accessToken}`
            }
        };

        // fetch 실행
        const response = await fetch(`/admin/memberList/${offset}/${limit}`, fetchOption);

        // json data 로 변환
        const result = await response.json();
        console.log(result);

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
    };

    // api 에서 넘겨 받은 data 를 tbody 에 표현
    const viewMemberList = () => {
        if (memberList != null) {
            return memberList.map((item, index) => (
                <tr key={index}>
                    <td>{item.user_seq}</td>
                    <td>{item.user_name}</td>
                    <td>{item.user_authority}</td>
                    <td>{item.user_approval === true ? '예' : '아니오'}</td>
                    <td>{item.corp_name}</td>
                    <td><button className="btn check" onClick={() => handleDeleteMemeber(item.user_name)}></button></td>
                    <td><button className="btn check" onClick={() => passwordModal(item.user_name)}></button></td>
                </tr>
            ));
        } else {
            return (
                <tr>
                    <td colSpan="5">검색된 정보가 없습니다.</td>
                </tr>
            );
        }
    }

    // 조회 개수 선택 함수 onClick
    const handleItem = (e) => {
        setPaging({
            ...paging,
            viewItems: e.target.value,
        })
    }

    /**  useEffect 를 사용해서 batchRendering 실행
    useEffect(() => {
        const fetchData = async () => {
            if (name == '') {
                try {
                    await getList(paging.offset, paging.limit);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            } else {
                try {
                    await serchMember()
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        };
        fetchData();
    }, [paging.viewItems])
    */

    return (
        <>
            <div className="search-wrap">
                <label htmlFor="search" className="blind">검색 조건</label>
                <input id="search" type="search" name="" placeholder="검색어를 입력해주세요." value={name} onChange={handelNmae} />
                {/* <label> 조회 개수 선택 */}
                {/* <select onChange={handleItem}> */}
                {/* <option value={10} >10개</option> */}
                {/* <option value={20} >20개</option> */}
                {/* <option value={30} >30개</option> */}
                {/* <option value={40} >40개</option> */}
                {/* </select> */}
                {/* </label> */}
                <button type="submit" className="btn" onClick={serchMember}>검색</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>순번</th>
                        <th>아이디</th>
                        <th>권한</th>
                        <th>승인여부</th>
                        <th>회사명</th>
                        <th>회원삭제</th>
                        <th>비밀번호 변경</th>
                    </tr>
                </thead>
                <tbody>
                    {viewMemberList()}
                </tbody>
            </table>
            {/* <button onClick={getList} >삭제</button> */}
            {/* 함수를 props 로 전달하는 방법 */}
            <Paging callback={getList} />
            {isOpenModal ? <PasswordModal index={passwordIdx} /> : null}
        </>
    )
}
