import { useEffect, useState } from "react";
import { useCommonContext } from "../../provider/common"
import Modal from "../login/modal";
import { Paging } from "../common/pagination";

export const ManageForm = () => {
    const { openModal, isOpenModal, getToken } = useCommonContext();

    const [fileList, setFileList] = useState();

    const [inputValue, setInputValue] = useState(
        {
            fileTitle: '',
            file: '',
        }
    );

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputValue({
            ...inputValue,
            [name]: value,
        })
        console.log(inputValue);
    }

    const getFormList = async () => {
        setFileList();
        const fetchOption = {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${getToken()}`,
            }
        }
        const response = await fetch('/admin/getFormList', fetchOption)

        const result = await response.json()

        if (response.status === 200) {
            setFileList(result.data);
            console.log('완료');
            console.log(fileList);
        }
    }

    const deleteFormFile = async (fileTitle) => {
        const fetchOption = {
            method: 'DELETE',
            headers: {
                'authorization': `Bearer ${getToken()}`,
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                fileTitle: fileTitle
            })
        }

        const response = await fetch('/admin/deleteFormFile', fetchOption)
        const result = await response.json()

        if (response.status === 200) {
            alert(result.message)
            await getFormList()
        } else {
            alert(result.message)
        }
    }

    const downloadFile = async (name, originalname) => {
        console.log('체크1');

        const queryString = new URLSearchParams({
            fileTitle: name,
            fileOriginalname: originalname,
        }).toString();
        console.log('체크2');
        const fetchOption = {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
            },
        }
        console.log('체크3');
        const response = await fetch(`/admin/getFormfile?${queryString}`, fetchOption);
        console.log('체크4');
        console.log(response);
        if (response.status === 200) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = originalname;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else {
            console.error('File download failed. Status:', response.status);
        }
    }
    // useEffect(() => {
    //     getFormList()
    //     console.log(fileList);
    // }, []);

    const showFileList = () => {
        if (fileList) {
            return fileList.map((item, index) => (
                <tr key={index + 1}>
                    <td>{index + 1}</td>
                    <td onClick={() => downloadFile(item.file_name, item.file_original_name)}>{item.file_name}</td>
                    <td>{item.file_original_name}</td>
                    <td><button className="btn" onClick={() => deleteFormFile(item.file_name)}>삭제</button></td>
                </tr>
            ))
        }
    }

    return (
        <div className="table_wrap">
            <table>
                <thead>
                    <tr>
                        <th>순번</th>
                        <th>파일명</th>
                        <th>파일</th>
                        <th>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {fileList ? showFileList() : <tr><td colSpan={4}>저장된 파일이 없습니다.</td></tr>}
                </tbody>
            </table>
            <div className="btn_wrap">
                <button className="btn" onClick={openModal}>파일 추가</button>
            </div>
            <Paging callback={getFormList} />
            {isOpenModal ? <Modal type={'saveForm'} /> : null}
        </div>
    )
}