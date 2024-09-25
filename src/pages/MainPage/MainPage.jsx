/*global kakao*/
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import palette from '../../constants/styles';
import { useDispatch, useSelector } from 'react-redux';

import { setUserLoginStatus, setCurrUser } from '../../store/actions/userStatus';

import KakaoMap from "./components/KakaoMap";
import Sidebar from "../../components/shared/Sidebar";
import SideWindow from "./components/SideWindow";
import LandRegisterPage from "./components/LandRegisterPage";
import LandReportModal from "./components/LandReportModal";
import AddressSearchBar from "../../components/shared/AddressSearchBar";

import { ReactComponent as SearchIcon } from "../../assets/images/icons/search.svg";
import { fetchUserVerification } from "../../utils/api";


function MainPage() {
    const dispatch = useDispatch();
    const currUser = useSelector(state => state.userStatus.currUser);
    const landAddress = useSelector(state => state.globalValues.landAddress);

    // 지번 검색 관련 변수
    const [addrSearch, setAddrSearch] = useState("");
    const addrInput = useRef();

    // 사이드바 기능 관련 변수
    // 사이드바 상태
    const [regLandData, setRegLandData] = useState(null);
    const [isLandReportModalOpen, setIsLandReportModalOpen] = useState(false);

    // 페이지 렌더링이 끝난 후 실행 (1회 실행)
    useEffect(() => {
        UserVerification();
    }, []);

    // 유저 토큰 검증 함수
    const UserVerification = () => {
        // 유저의 로컬스토리지에 있는 토큰 유효성 검사
        fetchUserVerification()
        .then(function(response) {
            // 유저의 토큰이 유효함
            dispatch(setCurrUser({
                user: response.data.user,
                name: response.data.name,
                email:response.data.email,
            }));
            dispatch(setUserLoginStatus(true));
        }).catch(function(error) {
            // 유저의 토큰이 유효하지 않음
            dispatch(setUserLoginStatus(false));
        });
    }

    const openLandReportModal = () => {
        setIsLandReportModalOpen(true);
    };
    
    const closeLandReportModal = () => {
        setIsLandReportModalOpen(false);
    };

    useEffect(() => {
        console.log(landAddress);
    }, [landAddress]);

    return(
        <>
            {regLandData !== null && <LandRegisterPage currUserData={currUser} regLandData={regLandData} setRegLandData={setRegLandData}/>}
            {isLandReportModalOpen && <LandReportModal onClose={closeLandReportModal}/>}
            <TopBar>
                <div style={{ width:"495px", display:"flex", flexDirection: "row", alignItems: "center" }}>
                    <AddrSearchBar 
                        ref={addrInput} 
                        className="addr-search" 
                        type="text" 
                        value={addrSearch} 
                        onChange={(e) => setAddrSearch(e.target.value)} 
                        placeholder="지번 검색" 
                    />
                    <SearchIcon style={{marginLeft: "-32px"}}/>
                </div>
            </TopBar>
            <Sidebar />
            <Container>
                <KakaoMap addrInput={addrInput}/>
                <SideWindow openLandReportModal={openLandReportModal} setRegLandData={setRegLandData}/>
            </Container>
        </>
    );
}

// * 상단바 스타일
// 상단바
const TopBar = styled.div`
    background: ${palette.whiteL};
    filter: drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.161));
    position: relative;

    width: calc(100vw - 10px);
    min-width: ${(props) => (props.isMobile ? "none" : "900px")};
    height: 60px;
    display:flex;
    margin: 0 auto;
    padding-right: 10px;

    flex-direction: row;
    justify-content: right;
    z-index: 10;
`
// 주소 검색창
const AddrSearchBar = styled.input`
    background: rgba(236, 236, 236, 1);
    width: ${(props) => (props.isMobile ? "calc(100% - 60px)" : "430px")};
    height: 36px;
    border: none;
    border-radius: 6px;
    margin-left: 10px;
    padding-left: 20px;
    padding-right: 40px;
    font-family: "SC Dream 4";
	font-size: 12px;
    color: rgba(127,127,127,1);
`

// * 메인 뷰 스타일
// 컨테이너 (PC화면 최소 크기 900px)
const Container = styled.div`
    display: flex;
    width: 100vw;
    min-width: ${(props) => (props.isMobile ? "none" : "900px")};
    height: ${(props) => (props.isMobile ? "calc(100vh - 140px)" : "calc(100vh - 60px)")};
`




// 모바일 사이드바 스타일
const LoginButton = styled.button`
    background-color: #0067a3;
    margin-right: 10px;

    border: 0;
    border-radius: 6px;
    width: 135px;
    height: 50px;

    font-family: "SC Dream 6";
	font-size: 12px;
    color: #fafafa;
`

const RegisterButton = styled.button`
    background-color: #fafafa;

    border: 0;
    border-radius: 6px;
    width: 135px;
    height: 50px;

    font-family: "SC Dream 6";
	font-size: 12px;
    color: #393939;
`

export default MainPage;
