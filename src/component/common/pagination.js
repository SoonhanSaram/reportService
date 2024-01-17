// pagination.js 
import Pagination from "react-js-pagination"
import { useCommonContext } from "../../provider/common";
import { useEffect } from "react";
export const Paging = ({ callback }) => {
    // 상위 component 에서 fetch 함수 받아오기
    const getList = callback;

    const { paging, setPaging } = useCommonContext();
    const { page, offset, totalItems, limit, viewItems } = paging;

    // onChange 를 통해서 paging state 변수 제어
    const handlePageChange = async (page) => {
        await setPaging(
            {
                ...paging,
                page: page,
                offset: viewItems * (page - 1),
                limit: viewItems,
            }
        );
    }
    // useEffect 를 사용해서 batchRendering 실행
    useEffect(() => {
        const fetchData = async () => {
            try {
                await getList(offset, limit);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [offset, limit])

    console.log(paging);
    /** 
     * pagination 매개변수 
     * activePage : 현재페이지(필수 활성 페이지)
     * itemsCountPerPage = 페이지당 항목 수
     * totleItemsCount = 전체 데이터 수
     * pageRangeDisplayed = 페이지네이터의 페이지 범위
    */

    return (
        <>
            <Pagination activePage={page} itemsCountPerPage={viewItems} totalItemsCount={totalItems} pageRangeDisplayed={5} onChange={handlePageChange}></Pagination>
        </>
    )
}