import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import axios from "axios";
import palette from '../../../lib/styles/colorPalette';

import { useDispatch, useSelector } from 'react-redux';

import { ReactComponent as MenuIcon } from "../../../assets/icons/menu.svg";
import { ReactComponent as CloseIcon } from "../../../assets/icons/close.svg";


const Sidebar = ({ isMobile=false, width=320, LoadLand }) => {
    const userLoginStatus = useSelector(state => state.userStatus.userLoginStatus);
    const currUser = useSelector(state => state.userStatus.currUser);

    const navigate = useNavigate();
    // 사이드바 UI 기능 관련 변수
    const [isOpen, setOpen] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [xPos, setX] = useState(0);
    const side = useRef();

    // 마이페이지 관련 변수
    const [currPage, setCurrPage] = useState("main")    // main, favorite, myland, mysale
    const [favoriteLandList, setFavoriteLandList] = useState([]);
    const [mySaleList, setMySaleList] = useState([]);
    const [refresh, setRefresh] = useState(true);

    // 버튼 클릭 시 토글
    const toggleMenu = () => {
        if (xPos < 0) {
            setX(0);
            setOpen(false);
        } else {
            setX(-width);
            setIsHidden(false);
            setOpen(true);
        }
    };

    // 메뉴가 열려있을 때 배경 클릭 시 메뉴 닫기
    const clickBackground = () => {
        setX(0);
        setOpen(false);
    }

    useEffect(() => {
        if (!isOpen) {
            const timeout = setTimeout(() => {
                setIsHidden(true);
            }, 500);   // 1초 지연
            return () => clearTimeout(timeout);
        }
    }, [isOpen]);

    // 처음 호출 시 한 번 실행되는 코드
    useEffect(() => {
            if (userLoginStatus) {
                // 관심목록 불러오기
                axios.post(`${process.env.REACT_APP_API_URL}/user_land_like_list`, {
                    "email": currUser.email
                })
                .then(function(landResponse) {
                    setFavoriteLandList(landResponse.data.land_like);
                    console.log(landResponse.data.land_like)
                });

                // 나의 토지 목록 불러오기
                axios.post(`${process.env.REACT_APP_API_URL}/user_land_for_sale_list`, {
                    "email": currUser.email
                })
                .then(function(landResponse) {
                    setMySaleList(landResponse.data.land_for_sale);
                });
                
            }
            setRefresh(false);
    }, [userLoginStatus, refresh])

    const Logout = () => {
        localStorage.removeItem("access_token");
        alert("로그아웃되었습니다.");
        window.location.replace("/");
    };

    const NumberFormat = (number) => {
        // 조 단위 포멧팅
        if (Math.floor(number / 1000000000000) !== 0) {
            return Math.floor(number / 1000000000000).toLocaleString('ko-KR') + "조";
        }
        // 억 단위 포멧팅
        else if (Math.floor(number / 100000000) !== 0) {
            return Math.floor(number / 100000000).toLocaleString('ko-KR') + "억";
        }
        // 만 단위 포멧팅
        else if (Math.floor(number / 10000) !== 0) {
            return Math.floor(number / 10000).toLocaleString('ko-KR') + "만";
        }
        // 그 외
        else {
            return Math.floor(number).toLocaleString('ko-KR');
        }
    };

    const LandType = (land) => {
        if (land.bid_data !== null) {
            return "경매";
        } else if (land.sale_data !== null) {
            return "매물";
        } else {
            return "일반";
        }
    }

    if (!isMobile) {
        // 데스크톱 렌더링
        if (!userLoginStatus) {
            // 비로그인
            return (
                <Container>
                    <OpenButton onClick={() => toggleMenu()}>
                        <MenuIcon style={{marginTop:"2px"}}/>
                    </OpenButton>
                    <Panel ref={side} style={{ width: `${width}px`, height: '100%',  transform: `translatex(${-xPos}px)`}}>
                        <TopPanel>
                            <CloseButton onClick={() => toggleMenu()}>
                                    <CloseIcon style={{marginTop:"2px"}}/>
                            </CloseButton>
                        </TopPanel>
                        <div style={{display:"flex", justifyContent:"center"}}>
                                <LoginButton onClick={() => navigate("/login")}>로그인</LoginButton>
                                <RegisterButton onClick={() => navigate("/register")}>회원가입</RegisterButton>
                            </div>
                        <BottomPanel>
                            <CategoryText>문의</CategoryText>
                            <CategoryButton>고객센터</CategoryButton>
                            <br/><br/>
                            <CategoryText>약관</CategoryText>
                            <CategoryButton>개인정보처리방침</CategoryButton>
                            <CategoryButton>이용약관</CategoryButton>
                            <br/><br/>
                            <CategoryText>기타</CategoryText>
                            <CategoryButton>DB 정보</CategoryButton>
                        </BottomPanel>
                    </Panel>
                </Container>
            );
        }
        // 관심 목록
        else if (currPage === "favorite") {
            return (
                <Container>
                    <OpenButton onClick={() => toggleMenu()}>
                        <MenuIcon style={{marginTop:"2px"}}/>
                    </OpenButton>
                    <Panel ref={side} style={{ width: `${width}px`, height: '100%',  transform: `translatex(${-xPos}px)`}}>
                    
                        <TopPanel>
                            <CloseButton onClick={() => toggleMenu()}>
                                    <CloseIcon style={{marginTop:"2px"}}/>
                            </CloseButton>
                        </TopPanel>
                        <MiddlePanel>
                            <div style={{display:"flex"}}>
                                <UserImage/>
                                <div>
                                    <UserNameText>{currUser.user}</UserNameText>
                                    <UserEmailText>{currUser.email}</UserEmailText><br/>
                                </div>
                            </div>
                            <div style={{marginTop:"10px", display:"flex", justifyContent:"space-around"}}>
                                <TextButton>회원정보 수정</TextButton>
                                <TextButton onClick={Logout}>로그아웃</TextButton>
                            </div>
                        </MiddlePanel>
                        <BottomPanel>
                            <div style={{display:"flex"}}>
                                <BackButton onClick={() => setCurrPage("main")}></BackButton>
                                <CategoryText>나의 관심 목록</CategoryText>
                                <RefreshButton onClick={() => setRefresh(true)}/>
                            </div>
                            {favoriteLandList.length === 0 ? 
                                    <LandNavigateText>
                                        내 관심목록이 존재하지 않습니다.
                                    </LandNavigateText>
                                :
                            favoriteLandList.map((favorite, index) => {
                                return (
                                    <LandNavigateButton onClick={() => LoadLand(favorite.lat, favorite.lng)}>
                                        [{LandType(favorite)}]<br/>
                                        <LandNavigateText>{favorite.addr}<br/></LandNavigateText>
                                        <LandNavigateHighlightText>예측가: {NumberFormat(favorite.land_area * favorite.predict_land_price)}원</LandNavigateHighlightText>
                                        {LandType(favorite) === "경매" ? <LandNavigateHighlightText style={{color:"#0067a3"}}><br/>경매가: {NumberFormat(favorite.bid_data.case_info.minimum_sale_price)}원</LandNavigateHighlightText>
                                        : LandType(favorite) === "매물" && <LandNavigateHighlightText style={{color:"#0067a3"}}><br/>매매가: {NumberFormat(favorite.sale_data.land_price)}원</LandNavigateHighlightText>}
                                    </LandNavigateButton>
                                ); 
                            })}
                        </BottomPanel>
                    </Panel>
                </Container>
            );
        }
        // 나의 매물
        else if (currPage === "mysale") {
            return (
                <Container>
                    <OpenButton onClick={() => toggleMenu()}>
                        <MenuIcon style={{marginTop:"2px"}}/>
                    </OpenButton>
                    <Panel ref={side} style={{ width: `${width}px`, height: '100%',  transform: `translatex(${-xPos}px)`}}>
                    
                        <TopPanel>
                            <CloseButton onClick={() => toggleMenu()}>
                                    <CloseIcon style={{marginTop:"2px"}}/>
                            </CloseButton>
                        </TopPanel>
                        <MiddlePanel>
                            <div style={{display:"flex"}}>
                                <UserImage/>
                                <div>
                                    <UserNameText>{currUser.user}</UserNameText>
                                    <UserEmailText>{currUser.email}</UserEmailText><br/>
                                </div>
                            </div>
                            <div style={{marginTop:"10px", display:"flex", justifyContent:"space-around"}}>
                                <TextButton>회원정보 수정</TextButton>
                                <TextButton onClick={Logout}>로그아웃</TextButton>
                            </div>
                        </MiddlePanel>
                        <BottomPanel>
                            <div style={{display:"flex"}}>
                                <BackButton onClick={() => setCurrPage("main")}></BackButton>
                                <CategoryText>나의 매물</CategoryText>
                                <RefreshButton onClick={() => setRefresh(true)}/>
                            </div>
                            { mySaleList.length === 0 ? 
                                    <LandNavigateText>
                                        내 매물이 존재하지 않습니다.
                                    </LandNavigateText>
                                :
                                mySaleList.map((mysale, index) => {
                                    return (
                                        <LandNavigateButton onClick={() => LoadLand(mysale.lat, mysale.lng)}>
                                            [{LandType(mysale)}]<br/>
                                            <LandNavigateText>{mysale.addr}<br/></LandNavigateText>
                                            <LandNavigateHighlightText>예측가: {NumberFormat(mysale.land_area * mysale.predict_land_price)}원</LandNavigateHighlightText>
                                            <LandNavigateHighlightText style={{color:"#0067a3"}}><br/>매매가: {NumberFormat(mysale.sale_data.land_price)}원</LandNavigateHighlightText>
                                        </LandNavigateButton>
                                    );
                                })
                            }
                        </BottomPanel>
                    </Panel>
                </Container>
            );
        }
        // 회원 메인 페이지
        else {
            return (
                <Container>
                    <OpenButton onClick={() => toggleMenu()}>
                        <MenuIcon style={{marginTop:"2px"}}/>
                    </OpenButton>
                    <Panel ref={side} style={{ width: `${width}px`, height: '100%',  transform: `translatex(${-xPos}px)`}}>
                        <TopPanel>
                            <CloseButton onClick={() => toggleMenu()}>
                                    <CloseIcon style={{marginTop:"2px"}}/>
                            </CloseButton>
                        </TopPanel>
                        <MiddlePanel>
                            <div style={{display:"flex"}}>
                                <UserImage/>
                                <div>
                                    <UserNameText>{currUser.user}</UserNameText>
                                    <UserEmailText>{currUser.email}</UserEmailText><br/>
                                </div>
                            </div>
                            <div style={{marginTop:"10px", display:"flex", justifyContent:"space-around"}}>
                                <TextButton>회원정보 수정</TextButton>
                                <TextButton onClick={Logout}>로그아웃</TextButton>
                            </div>
                        </MiddlePanel>
                        <BottomPanel>
                            <CategoryText>마이페이지</CategoryText>
                            <CategoryButton onClick={() => setCurrPage("favorite")}>나의 관심 목록</CategoryButton>
                            <CategoryButton onClick={() => setCurrPage("mysale")}>나의 매물</CategoryButton>
                            <br/><br/>
                            <CategoryText>문의</CategoryText>
                            <CategoryButton>고객센터</CategoryButton>
                            <br/><br/>
                            <CategoryText>약관</CategoryText>
                            <CategoryButton>개인정보처리방침</CategoryButton>
                            <CategoryButton>이용약관</CategoryButton>
                            <br/><br/>
                            <CategoryText>기타</CategoryText>
                            <CategoryButton>DB 정보</CategoryButton>
                        </BottomPanel>
                    </Panel>
                </Container>
            );
        }
    } else {
        // 모바일 렌더링
        if (!userLoginStatus) {
            // 비로그인
            return (
                <Container>
                    <OpenButton onClick={() => toggleMenu()}>
                        <MenuIcon style={{marginTop:"2px"}}/>
                    </OpenButton>
                    <Panel ref={side} style={{ width: `${width}px`, height: '100%',  transform: `translatex(${-xPos}px)`}}>
                        <TopPanel>
                            <CloseButton onClick={() => toggleMenu()}>
                                    <CloseIcon style={{marginTop:"2px"}}/>
                            </CloseButton>
                        </TopPanel>
                        <div style={{display:"flex", justifyContent:"center"}}>
                                <LoginButton onClick={() => navigate("/login")}>로그인</LoginButton>
                                <RegisterButton onClick={() => navigate("/register")}>회원가입</RegisterButton>
                            </div>
                        <BottomPanel>
                            <CategoryText>문의</CategoryText>
                            <CategoryButton>고객센터</CategoryButton>
                            <br/><br/>
                            <CategoryText>약관</CategoryText>
                            <CategoryButton>개인정보처리방침</CategoryButton>
                            <CategoryButton>이용약관</CategoryButton>
                            <br/><br/>
                            <CategoryText>기타</CategoryText>
                            <CategoryButton>DB 정보</CategoryButton>
                        </BottomPanel>
                    </Panel>
                    <Background 
                        isOpen={isOpen} 
                        isHidden={isHidden} 
                        onClick={clickBackground}
                    />
                </Container>
            );
        } else if (currPage === "favorite") {
            // 관심 목록
            return (
                <Container>
                    <OpenButton onClick={() => toggleMenu()}>
                        <MenuIcon style={{marginTop:"2px"}}/>
                    </OpenButton>
                    <Panel ref={side} style={{ width: `${width}px`, height: '100%',  transform: `translatex(${-xPos}px)`}}>
                    
                        <TopPanel>
                            <CloseButton onClick={() => toggleMenu()}>
                                    <CloseIcon style={{marginTop:"2px"}}/>
                            </CloseButton>
                        </TopPanel>
                        <MiddlePanel>
                            <div style={{display:"flex"}}>
                                <UserImage/>
                                <div>
                                    <UserNameText>{currUser.user}</UserNameText>
                                    <UserEmailText>{currUser.email}</UserEmailText><br/>
                                </div>
                            </div>
                            <div style={{marginTop:"10px", display:"flex", justifyContent:"space-around"}}>
                                <TextButton>회원정보 수정</TextButton>
                                <TextButton onClick={Logout}>로그아웃</TextButton>
                            </div>
                        </MiddlePanel>
                        <BottomPanel>
                            <div style={{display:"flex"}}>
                                <BackButton onClick={() => setCurrPage("main")}></BackButton>
                                <CategoryText>나의 관심 목록</CategoryText>
                                <RefreshButton onClick={() => setRefresh(true)}/>
                            </div>
                            {favoriteLandList.length === 0 ? 
                                    <LandNavigateText>
                                        내 관심목록이 존재하지 않습니다.
                                    </LandNavigateText>
                                :
                            favoriteLandList.map((favorite, index) => {
                                return (
                                    <LandNavigateButton onClick={() => LoadLand(favorite.lat, favorite.lng)}>
                                        [{LandType(favorite)}]<br/>
                                        <LandNavigateText>{favorite.addr}<br/></LandNavigateText>
                                        <LandNavigateHighlightText>예측가: {NumberFormat(favorite.land_area * favorite.predict_land_price)}원</LandNavigateHighlightText>
                                        {LandType(favorite) === "경매" ? <LandNavigateHighlightText style={{color:"#0067a3"}}><br/>경매가: {NumberFormat(favorite.bid_data.case_info.minimum_sale_price)}원</LandNavigateHighlightText>
                                        : LandType(favorite) === "매물" && <LandNavigateHighlightText style={{color:"#0067a3"}}><br/>매매가: {NumberFormat(favorite.sale_data.land_price)}원</LandNavigateHighlightText>}
                                    </LandNavigateButton>
                                ); 
                            })}
                        </BottomPanel>
                    </Panel>
                    <Background 
                        isOpen={isOpen} 
                        isHidden={isHidden} 
                        onClick={clickBackground}
                    />
                </Container>
            );
        } else if (currPage === "mysale") {
            // 나의 매물
            return (
                <Container>
                    <OpenButton onClick={() => toggleMenu()}>
                        <MenuIcon style={{marginTop:"2px"}}/>
                    </OpenButton>
                    <Panel ref={side} style={{ width: `${width}px`, height: '100%',  transform: `translatex(${-xPos}px)`}}>
                    
                        <TopPanel>
                            <CloseButton onClick={() => toggleMenu()}>
                                    <CloseIcon style={{marginTop:"2px"}}/>
                            </CloseButton>
                        </TopPanel>
                        <MiddlePanel>
                            <div style={{display:"flex"}}>
                                <UserImage/>
                                <div>
                                    <UserNameText>{currUser.user}</UserNameText>
                                    <UserEmailText>{currUser.email}</UserEmailText><br/>
                                </div>
                            </div>
                            <div style={{marginTop:"10px", display:"flex", justifyContent:"space-around"}}>
                                <TextButton>회원정보 수정</TextButton>
                                <TextButton onClick={Logout}>로그아웃</TextButton>
                            </div>
                        </MiddlePanel>
                        <BottomPanel>
                            <div style={{display:"flex"}}>
                                <BackButton onClick={() => setCurrPage("main")}></BackButton>
                                <CategoryText>나의 매물</CategoryText>
                                <RefreshButton onClick={() => setRefresh(true)}/>
                            </div>
                            { mySaleList.length === 0 ? 
                                    <LandNavigateText>
                                        내 매물이 존재하지 않습니다.
                                    </LandNavigateText>
                                :
                                mySaleList.map((mysale, index) => {
                                    return (
                                        <LandNavigateButton onClick={() => LoadLand(mysale.lat, mysale.lng)}>
                                            [{LandType(mysale)}]<br/>
                                            <LandNavigateText>{mysale.addr}<br/></LandNavigateText>
                                            <LandNavigateHighlightText>예측가: {NumberFormat(mysale.land_area * mysale.predict_land_price)}원</LandNavigateHighlightText>
                                            <LandNavigateHighlightText style={{color:"#0067a3"}}><br/>매매가: {NumberFormat(mysale.sale_data.land_price)}원</LandNavigateHighlightText>
                                        </LandNavigateButton>
                                    );
                                })
                            }
                        </BottomPanel>
                    </Panel>
                    <Background 
                        isOpen={isOpen} 
                        isHidden={isHidden} 
                        onClick={clickBackground}
                    />
                </Container>
            );
        } else {
            // 회원 메인 페이지
            return (
                <Container>
                    <OpenButton onClick={() => toggleMenu()}>
                        <MenuIcon style={{marginTop:"2px"}}/>
                    </OpenButton>
                    <Panel ref={side} style={{ width: `${width}px`, height: '100%',  transform: `translatex(${-xPos}px)`}}>
                        <TopPanel>
                            <CloseButton onClick={() => toggleMenu()}>
                                    <CloseIcon style={{marginTop:"2px"}}/>
                            </CloseButton>
                        </TopPanel>
                        <MiddlePanel>
                            <div style={{display:"flex"}}>
                                <UserImage/>
                                <div>
                                    <UserNameText>{currUser.user}</UserNameText>
                                    <UserEmailText>{currUser.email}</UserEmailText><br/>
                                </div>
                            </div>
                            <div style={{marginTop:"10px", display:"flex", justifyContent:"space-around"}}>
                                <TextButton>회원정보 수정</TextButton>
                                <TextButton onClick={Logout}>로그아웃</TextButton>
                            </div>
                        </MiddlePanel>
                        <BottomPanel>
                            <CategoryText>마이페이지</CategoryText>
                            <CategoryButton onClick={() => setCurrPage("favorite")}>나의 관심 목록</CategoryButton>
                            <CategoryButton onClick={() => setCurrPage("mysale")}>나의 매물</CategoryButton>
                            <br/><br/>
                            <CategoryText>문의</CategoryText>
                            <CategoryButton>고객센터</CategoryButton>
                            <br/><br/>
                            <CategoryText>약관</CategoryText>
                            <CategoryButton>개인정보처리방침</CategoryButton>
                            <CategoryButton>이용약관</CategoryButton>
                            <br/><br/>
                            <CategoryText>기타</CategoryText>
                            <CategoryButton>DB 정보</CategoryButton>
                        </BottomPanel>
                    </Panel>
                    <Background 
                        isOpen={isOpen} 
                        isHidden={isHidden} 
                        onClick={clickBackground}
                    />
                </Container>
            );
        }
    }
}

const Container = styled.div`
    background-color: ${palette.blackB};
`

const Panel = styled.div`
    position: fixed;
    filter: drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.161));
    background-color: ${palette.whiteB};

    top: 0;
    bottom: 0;
    left: -320px;
    transition: 0.4s ease;
    color: ${palette.whiteL};
    height: 100%;
    z-index: 99;
`

const Background = styled.button`
    position: fixed;
    top: 0;
    left: 0;
    background-color: ${palette.blackB};
    opacity: ${(props) => (props.isOpen ? 0.5 : 0)};
    visibility: ${props => (props.isHidden ? "hidden" : "visible")};
    transition: opacity 0.5s ease-in-out;
    width: 100vw;
    height: 100vh;
    border: 0;
    z-index: 98;
`

const TopPanel = styled.div`
    position: relative;
    background-color: ${palette.whiteL};
    height: 60px;
    z-index: 99;
`

const MiddlePanel = styled.div`
    position: relative;
    filter: drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.051));
    background-color: ${palette.whiteL};
    margin-top: 6px;
    height: 150px;
    z-index: 99;
`

const BottomPanel = styled.div`
    position: relative;
    filter: drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.051));
    background-color: ${palette.whiteL};
    padding: 20px;
    margin-top: 6px;
    height: auto;
    z-index: 99;
`

const CategoryText = styled.h2`
    margin-top: 6px;
    margin-bottom: 6px;
    text-align: left;
    text-decoration: none;
    font-family: "SC Dream 6";
    font-size: 18px;
    color: ${palette.blackB};
`

const CategoryButton = styled.button`
    position: relative;
    background-color: transparent;
    margin-bottom: -1px;
    border: 0px solid;
    border-top: 1px solid ${palette.grayL};
    border-bottom: 1px solid ${palette.grayL};
    padding-left: 0px;
    width: 100%;
    height: 32px;
    text-align: left;
    text-decoration: none;
    font-family: "SC Dream 4";
    font-size: 15px;
    color: ${palette.grayB};
    cursor: pointer;
    z-index: 99;
`

const BackButton = styled.button`
    position: relative;

    margin-top: 7px;
    margin-right: 10px;

    width: 24px;
    height: 24px;
    border: 0;
    border-radius: 4px;
    background-color: aqua;
    overflow: hidden;

    cursor: pointer;
`

const RefreshButton = styled.button`
    position: absolute;

    top: 32px;
    right: 20px;

    width: 15px;
    height: 15px;
    border: 0;
    border-radius: 4px;
    background-color: aqua;
    overflow: hidden;

    cursor: pointer;
`

const OpenButton = styled.button`
    position: absolute;
    left: 0px;
    top: 0px;
    width: 60px;
    height: 60px;
    z-index: 99;
    transition: 0.4s ease;
    border: 0;
    border-radius: 40px;
    background-color: transparent;
    overflow: hidden;
`

const OpenTextButton = styled.button`
    position: absolute;
    background-color: transparent;
    top: 20px;
    right: 24px;

    border: 0;
    
    text-align: center;
    text-decoration: none;
    font-family: "SC Dream 4";
	font-size: 12px;
    color: rgba(172,172,172,1);

    cursor: pointer;

    z-index: 99;
`

const CloseButton = styled.button`
    position: relative;
    right: -10px;
    top: 10px;
    width: 40px;
    height: 40px;
    z-index: 99;
    transition: 0.8s ease;
    border: 0;
    border-radius: 40px;
    background-color: transparent;
    overflow: hidden;
`

const UserImage = styled.img`
    border-radius: 48px;
    background-color: ${palette.grayM};
    width: 64px;
    height: 64px;

    margin: 20px;
    margin-bottom: 10px;
`

const UserNameText = styled.h2`
    margin-top: 28px;
    margin-bottom: 0px;
    text-align: left;
    text-decoration: none;
    font-family: "SC Dream 6";
    font-size: 18px;
    color: ${palette.blackB};
`

const UserEmailText = styled.span`
    text-align: left;
    text-decoration: none;
    font-family: "SC Dream 4";
    font-size: 12px;
    color: ${palette.grayB};
`

const TextButton = styled.button`
    border: 0;
    padding: 0;
    background-color: transparent;
    width: 80px;
    text-align: center;
    font-family: "SC Dream 4";
	font-size: 12px;
    color: ${palette.grayB};

    cursor: pointer;
`

const LoginButton = styled.button`
    background-color: ${palette.blueM};
    filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.161));
    
    margin-top: 20px;
    margin-right: 10px;
    margin-bottom: 20px;

    border: 0;
    border-radius: 6px;
    width: 135px;
    height: 50px;

    font-family: "SC Dream 6";
	font-size: 12px;
    color: ${palette.whiteL};

    cursor: pointer;
`

const RegisterButton = styled.button`
    background-color: ${palette.whiteL};
    filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.161));

    margin-top: 20px;
    margin-bottom: 20px;

    border: 0;
    border-radius: 6px;
    width: 135px;
    height: 50px;

    font-family: "SC Dream 6";
	font-size: 12px;
    color: ${palette.blackB};

    cursor: pointer;
`

const LandNavigateButton = styled.button`
    border: 0;
    border-top: 1px solid #767676;
    border-bottom: 1px solid #767676;

    padding: 0;
    padding-top: 4px;
    padding-bottom: 4px;

    margin-bottom: -1px;

    background-color: transparent;
    width: 100%;
    text-align: left;
    font-family: "SC Dream 4";
    font-size: 12px;
    color: #343a40;

    cursor: pointer;
`

const LandNavigateText = styled.span`
    text-align: left;
    font-family: "SC Dream 4";
    font-size: 12px;
    color: #343a40;
`

const LandNavigateHighlightText = styled.span`
    text-align: left;
    font-family: "SC Dream 4";
    font-size: 12px;
    color: #ff3636;
`

export default Sidebar;