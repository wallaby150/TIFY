import React, { useState, useEffect, ReactEventHandler, useCallback, ReactHTMLElement } from "react";
import alert from '../../assets/iconAlert.svg';
import bell from '../../assets/bell.png';
import anony from '../../assets/anony.png';

import { ref, set, push, onValue, child, get, update, remove } from "firebase/database";
import { List } from "@mui/material";
import { useSelector } from 'react-redux';
import { RootState } from '../../store/Auth';

import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Justify, Search } from 'react-bootstrap-icons';
import { NavLink } from 'react-router-dom';
import {Modal, Form, Collapse, Container, Row, Col} from 'react-bootstrap';
import { borderRadius } from "@mui/system";

export interface FaqForm {
	createdDate: string;
	modifiedDate: string;
	id: number;
	title: string;
	content: string;
	idx: number;
  type: number;
  imgUrl: string;
}

export interface User {
	id: number;
	userid: string;
	password: string;
	roles: string;
	provider?: any;
	nickname: string;
	profileImg: string;
	username: string;
	birth: string;
	email: string;
	tel: string;
	addr1: string;
	addr2: string;
	zipcode: string;
	birthYear: string;
	gender: string;
	emailAuth: boolean;
	createTime: string;
	roleList: string[];
}


const Faq = () => {
    const [id, setId] = useState<string>(''); // faq id
    const [title, setTitle] = useState<string>(''); // faq title
    const [content, setContent] = useState<string>(''); // faq content
    const [type, setType] = useState<string>(''); // faq type
    const [idx, setIdx] = useState<string>(''); // faq idx
    const [imgUrl, setImgUrl] = useState<string>(''); // faq img

    const [show, setShow] = useState(false); // modal
    const [open, setOpen] = useState(false); // img collapse
    const [files, setFiles] = useState<File[]>([]); // img list
    const [Rfiles, setRFiles] = useState<File[]>([]); // repImg

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<FaqForm[]|null>(null);
    const [page, setPage] = useState(1);
    // const [newImgs,setNewImgs] = useState<Array<pImg>>([]);
    const [totalPages, setTotalPages] = useState(0);
    const maxResults = 10;
    const baseUrl = "https://i8e208.p.ssafy.io/api/qna";
    // const baseUrl = "https://i8e208.p.ssafy.io/api/faq";
    const [faqInfo, setFaqInfo] = useState<FaqForm|null> (null);// for 상품정보 edit

    const handleSearch = async (event:any) => {
      if (event.key === 'Enter' || event.type === 'click') {
        const response = await axios.get(`${baseUrl}/search/${searchTerm}`);
        setSearchResults(response.data.content);
      }
    };

    const getData = async (page: number) => {
      try {
        const response = await axios.get(`${baseUrl}`, {
          params: {
            page,
            max_result:10
          },
        });
        setSearchResults(response.data.content);
        setTotalPages(response.data.totalPages);
        console.log(response.data.content);
        return response.data.content;
      } catch (error) {
        console.error(error);
      }
    }
    if (searchResults === null) {
        getData(0);
    }

    const PageButtons = ({ totalPages }: { totalPages: number }) => {
        let buttons = [];
        for (let i = 1; i <= totalPages; i++) {
          buttons.push(
            <li className="page-item" key={i}>
                <button className="page-link" onClick={() => {setPage(i-1); getData(i-1);}}>{i}</button>
            </li>
          )
        }
        return (<> {buttons} </>);};

    const handleEdit = async (id: number) => {
        console.log(id);
        console.log("-----------------");
        const data = await axios.get(`${baseUrl}/${id}`).then((res) => {
          setFaqInfo(res.data);
          return res.data
        });
        setId(data.id)
        setTitle(data.title)
        setContent(data.content)
        setType(data.type)
        setIdx(data.idx)
        setImgUrl(data.imgUrl)
        console.log(data);
        return data;
    };
  
    const handleDelete = async (id : number) => {
        console.log(id);
        try {
            const response = await axios.delete(`${baseUrl}/${id}`);
            getData(page-1);
            console.log(`deleted faq ${id}`)
            return response;
        } catch (error) {
            console.error(error);
        }
    };
  
    // const handleCreate = async () => {
    //   await axios.post('localhost:8081/api/users/');
    // };

    const handleClose = () => setShow(false);
    const handleShow = async (id:number) => {
      await handleEdit(id);
      // setFiles([])
      setRFiles([])
      // setNewImgs([])
      setShow(true)
      setOpen(false)
    };


    const formTitleStyle = {
      color:"black",
      fontWeight:"bold"
    }
    

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles(files.concat(droppedFiles));
    };
  
    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
    };

    const onDropRep = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const droppedFiles = Array.from(e.dataTransfer.files);
      setRFiles(Rfiles.concat(droppedFiles));
    };
  
    const onDragOverRep = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
    };
    const fileToBlob = (file: File) => {
      return new Blob([file], { type: file.type });
    };

      // 사진 등록
  // imgFile 을 보내서 S3에 저장된 url받기
  const getImgUrl_one = async () => {
    let formData = new FormData();
    formData.append('file', Rfiles[0] ); // 파일 상태 업데이트
    const API_URL = `https://i8e208.p.ssafy.io/api/files/upload/`;
    return await axios
      .post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((con) => {
        console.log('이미지주소불러오기 성공', con.data);
        // setImgUrlS3(con.data);
        setImgUrl(con.data);
        console.log(con)
        console.log("이미지 성공")
        // setNewImgs(newImgs?.concat(temp));
        return con.data;
      })
      .catch((err) => {
        console.log('이미지주소불러오기 실패', err);
      });
  };

  const submitEdit = async (e:any) => {
    let id = faqInfo?.id;
    e.preventDefault();
    console.log(id);
    console.log("-----------------");
    if (Rfiles.length > 0) {
      await getImgUrl_one();
    }
    let arr = [];
    const response = await axios.put(`https://i8e208.p.ssafy.io/api/faq/${id}`,{ content, imgUrl, idx, title, type })
    .then(
      (response) => {
        console.log(response);
        setFaqInfo(response.data);
        }
      );
    handleClose();
  };

    return (
        <div className="m-12">
            <div className="input-group mb-3">
                <div className="form-floating">
                    <input type="text" className="form-control" id="floatingInputGroup1" onChange={(e) => setSearchTerm(e.target.value)}/>
                </div>
                <button className="input-group-text"><Search size={24} style={{ margin: "0 auto" }} onClick={(e) => handleSearch(e)}/></button>
            </div>
            
            <table className="table table-hover" style={{backgroundColor: "white",color: "unset"}}>
            <thead>
                <tr>
                <th scope="col">Idx</th>
                <th scope="col">ID</th>
                <th scope="col">Title</th>
                <th scope="col">idx</th>
                <th scope="col">type</th>
                <th scope="col">CreateDate</th>
                <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">0</th>
                    <th scope="col">1</th>
                    <th scope="col">에페큐입니다.</th>
                    <th scope="col">1</th>
                    <th scope="col">2</th>
                    <th scope="col">생성일</th>
                    <td colSpan={2}>
                    <button className="btn" style={{backgroundColor:"blue", color:"white"}} onClick={() => handleShow(1)}>수정</button>
                        {/* <button className="btn" style={{backgroundColor:"blue", color:"white"}} onClick={() => setIsModalOpen(true)}>수정</button> */}
                    <button className="btn" style={{backgroundColor:"gray", color:"black"}}>삭제</button>
                    </td>
                </tr>
                {searchResults?.map((faq,idx:any) => (
                <tr key={idx+1}>
                  <td>{idx+1}</td>
                  <td>
                    {faq?.id}
                  </td>
                  <td>{faq?.title}</td>
                  <td>{faq?.idx}</td>
                  <td>{faq?.type}</td>
                  <td>{faq?.createdDate}</td>

                  <td colSpan={2}>
                    {/* <NavLink to={`/admin/users/${user.id}`} > */}
                    <button className="btn" style={{backgroundColor:"blue", color:"white"}} onClick={() => handleShow(faq?.id)}>수정</button>
                    {/* </NavLink> */}
                    <button className="btn" style={{backgroundColor:"gray", color:"black"}}
                        onClick={() => handleDelete(faq?.id)}>삭제</button>
                  </td>
                    {/* <button onClick={() => handleEdit({ userPk: user.id })}>Edit {user.id}</button> */}
                    {/* <button onClick={() => handleDelete(user.idx)}>Delete</button> */}
                </tr>
              ))}

            </tbody>
            </table>
          {/* <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          /> */}
          {/* <button onClick={handleCreate}>Create</button> */}


          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title style={{fontWeight:"bold"}}>FAQ 수정</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{color:"red"}}>FAQ 상세 내용입니다.<br/></Modal.Body>
            <div style={{width:"400px", margin:"50px", marginBottom:"20px"}}>
            <Form>
              <Form.Group controlId="formPk">
                <Form.Label style={formTitleStyle}>Pk</Form.Label>
                <Form.Control type="text" placeholder="FAQ 고유번호" value={faqInfo?.id} readOnly/>
              </Form.Group><br/>
              <Form.Group controlId="formType">
                <Form.Label style={formTitleStyle}>Type</Form.Label>
                <Form.Control type="text" placeholder="FAQ 타입코드" value={type} onChange={(e) => setType(e.target.value) }/>
              </Form.Group><br/>
              <Form.Group controlId="formBasicIdx">
                <Form.Label style={formTitleStyle}>Idx</Form.Label>
                <Form.Control type="text" placeholder="FAQ 노출 순서" value={idx} onChange={(e) => setIdx(e.target.value) }/>
              </Form.Group><br/>
              <Form.Group controlId="formBasicDate">
                <Form.Label style={formTitleStyle}>createdDate</Form.Label>
                <Form.Control type="text" placeholder="FAQ 생성날짜 " value={faqInfo?.createdDate ? faqInfo?.createdDate:''} readOnly/>
              </Form.Group><br/>
              <Form.Group controlId="formBasicTitle">
                <Form.Label style={formTitleStyle}>Title</Form.Label>
                <Form.Control type="text" placeholder="FAQ 제목" value={title} onChange={(e) => setTitle(e.target.value) }/>
              </Form.Group><br/>
              <Form.Group controlId="formBasicContent">
                <Form.Label style={formTitleStyle}>Content</Form.Label>
                <Form.Control type="text" placeholder="FAQ 내용" value={content} onChange={(e) => setContent(e.target.value) }/>
              </Form.Group><br/>
                <div onDrop={onDropRep} onDragOver={onDragOverRep}>
                  <h1 style={formTitleStyle} >FAQ 첨부 이미지</h1>
                  <p>이미지를 끌어 올려주세요.<br/>(우클릭시 이미지 빼기)</p>
                  {/* <Form.Label style={formTitleStyle}>RepImg</Form.Label> */}
                  {/* <Form.Control type="file"/> */}
                    <div style={{display:"flex", justifyContent:"space-around"}}>
                        <p>선택한 이미지</p>
                        { Rfiles.length === 0 ? (
                            <img style={{width:"100px",height:"100px"}}
                            height={100}
                            src="data:image/png;base64,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"
                            />)
                            :
                            (
                              <img style={{width:"100px",height:"100px"}}
                              src={URL.createObjectURL(Rfiles[0])}
                              alt={Rfiles[0].name}
                              height={100}
                              onContextMenu={e => {
                                e.preventDefault();
                                setRFiles([]);
                              }}/>
                            )
                        }
                    </div>
                </div>
                <hr/>
              <button className="btn" style={{backgroundColor:"blue", color:"white"}} onClick={(e) => submitEdit(e)}>수정</button>
              {/* <Button variant="primary" type="submit" >
                수정하기
              </Button> */}
            </Form>
            </div>
          </Modal>

            <nav aria-label="Page navigation example">
                <ul className="pagination" style={{justifyContent:"center"}}>
                    <li className="page-item"><a className="page-link" href="#">Previous</a></li>
                    <PageButtons totalPages={totalPages} />
                    <li className="page-item"><a className="page-link" href="#">Next</a></li>
                </ul>
            </nav>
        </div>
      );
}
export default Faq;