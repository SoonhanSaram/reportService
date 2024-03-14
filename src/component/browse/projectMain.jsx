import { useNavigate } from "react-router-dom"
import { useCommonContext } from "../../provider/common";
import { handleNavi } from "../../js/common";
import { Chat } from "../common/chat";

export const ProjectMain = () => {
    const { userInfo } = useCommonContext();
    const { userAuthority } = userInfo;
    const navigate = useNavigate();

    return (
        <div className="flex-container">
            <div className="flex-item-left">
                <ul>
                    <li><button onClick={() => handleNavi(navigate, 'createProject', userAuthority)}>프로젝트 생성</button></li>
                    <li>프로젝트 생성</li>
                    <li>프로젝트 생성</li>
                    <li>프로젝트 생성</li>
                </ul>
            </div>
            <div className="flex-item-right">
                <p>프로젝트 현황</p>
            </div>
            <Chat />
        </div>
    )
}