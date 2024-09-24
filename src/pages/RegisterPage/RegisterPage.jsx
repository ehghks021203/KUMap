import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from "styled-components";
import palette from '../../constants/styles';

import TermOfUseModal from "./TermOfUseModal";
import MarketingModal from "./MarketingConsentModal";

import { ReactComponent as PwShow } from "../../assets/images/icons/eye_password_show.svg";
import { ReactComponent as PwHide } from "../../assets/images/icons/eye_password_hide.svg";



function RegisterPage() {
    const navigate = useNavigate();

    const [name, setName] = useState("")
    const [nickname, setNickname] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [errMsg, setErrMsg] = useState("");

    // 유효성 검사 함수
    const validateName = (name) => {
        return name
            .toLowerCase()
            .match(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|].{1,8}$/)
    }

    const validateEmail = (email) => {
        return email
            .toLowerCase()
            .match(/([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/);
    }

    const validatePassword = (password) => {
        return password
            .toLowerCase()
            .match(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{10,25}$/)
    }

    // 유효성 검사
    const isNameValid = validateName(name);
    const isNicknameValid = validateName(nickname);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    // 중복 체크 변수
    const [isDupNickname, setIsDupNickname] = useState(true);
    const [dupNicknameMsg, setDupNicknameMsg] = useState("");
    const [isDupEmail, setIsDupEmail] = useState(true);
    const [dupEmailMsg, setDupEmailMsg] = useState("");

    // 비밀번호 보이기
    const [pwOpt, setPwOpt] = useState(false);
    const [pwInputType, setPwInputType] = useState({
        type: "password",
        autoComplete: "current-password",
    });

    // Caps Lock 켜져있는지 확인하는 변수
    const [capsLockFlag, setCapsLockFlag] = useState(false);

    // 체크박스 변수
    const [allCheck, setAllCheck] = useState("")
    const [ageCheck, setAgeCheck] = useState("")
    const [useCheck, setUseCheck] = useState("")
    const [marketingCheck, setMarketingCheck] = useState("")

    // 약관 모달창 변수
    const [touModalOpen, setTOUModalOpen] = useState(false);
    const [mcModalOpen, setMCModalOpen] = useState(false);


    // 이름
    const onChangeName = useCallback((e) => {
        const currName = e.target.value;
        setErrMsg("");
        setName(currName);
    }, []);

    // 닉네임
    const onChangeNickname = useCallback((e) => {
        const currNickname = e.target.value;
        setErrMsg("");
        setIsDupNickname(true);
        setDupNicknameMsg("");
        setNickname(currNickname);
    }, []);

    //이메일 
    const onChangeEmail = useCallback(async (e) => {
        const currEmail = e.target.value;
        setErrMsg("");
        setIsDupEmail(true);
        setDupEmailMsg("");
        setEmail(currEmail);
    }, []);

    //비밀번호
    const onChangePassword = useCallback((e) => {
        const currPassword = e.target.value;
        setErrMsg("");
        setPassword(currPassword);
    }, []);

    //비밀번호 확인
    const onChangePasswordCheck = useCallback((e) => {
        const currPasswordCheck = e.target.value;
        setErrMsg("");
        setPasswordCheck(currPasswordCheck);
    }, []);

    // 비밀번호 보이기
    useEffect(() => {
        if (pwOpt === false) {
            setPwInputType({
                type: "password",
                autoComplete: "current-password",
            });
        } else {
            setPwInputType({
                type: "text",
                autoComplete: "off",
            });
        }
    }, [pwOpt]);

    // Caps Lock 체크 및 엔터 시 로그인
    const onKeyDownFunc = (e) => {
        let capsLock = e.getModifierState("CapsLock");
        setCapsLockFlag(capsLock);
        if (e.key == "Enter") {
            handleRegister();
        }
    };

    // 전체동의 체크박스 이벤트
    const allBtnEvent = () => {
        if (allCheck === false) {
            setAllCheck(true);
            setAgeCheck(true);
            setUseCheck(true);
            setMarketingCheck(true);
        } else {
            setAllCheck(false);
            setAgeCheck(false);
            setUseCheck(false);
            setMarketingCheck(false);
        }
    };

    // 만 14세 이상입니다 체크박스 이벤트
    const ageBtnEvent = () => {
        if (ageCheck === false) {
            setAgeCheck(true);
        } else {
            setAgeCheck(false);
        }
    };

    // 이용약관 체크박스 이벤트
    const useBtnEvent = () => {
        if (useCheck === false) {
            setUseCheck(true);
        } else {
            setUseCheck(false);
        }
    };

    // 마케팅 동의 체크박스 이벤트
    const marketingBtnEvent = () => {
        if (marketingCheck === false) {
            setMarketingCheck(true);
        } else {
            setMarketingCheck(false);
        }
    };

    useEffect(() => {
        if (ageCheck === true && useCheck === true && marketingCheck === true) {
            setAllCheck(true);
        } else {
            setAllCheck(false);
        }
    }, [ageCheck, useCheck, marketingCheck])

    // 약관 모달창 클릭 이벤트
    const handlerTOUModalClick = () => {
        setTOUModalOpen(true);
    };

    const handlerMCModalClick = () => {
        setMCModalOpen(true);
    }
    

    const handlerNicknameDupCheck = useCallback(() => {
        if (nickname === "") {
            setIsDupNickname(true);
            setDupNicknameMsg("닉네임을 입력해주세요.");
        } else if (!isNicknameValid) {
            setIsDupNickname(true);
            setDupNicknameMsg("닉네임을 1글자 이상 9글자 미만으로 입력해주세요.");
        } else {
            axios.post(`${process.env.REACT_APP_API_URL}/dup_check`, {
                "nickname": nickname
            }).then(function(response) {
                setIsDupNickname(false);
                setDupNicknameMsg("사용 가능한 닉네임입니다.");
            }).catch(function(error) {
                if (error.response) {
                    setIsDupNickname(true);
                    setDupNicknameMsg("사용 불가능한 닉네임입니다.");
                }
            });
        }
    }, [nickname, isNicknameValid]);

    const handlerEmailDupCheck = useCallback(() => {
        if (email === "") {
            setIsDupEmail(true);
            setDupEmailMsg("이메일을 입력해주세요.");
        } else if (!isEmailValid) {
            setIsDupEmail(true);
            setDupEmailMsg("이메일 형식이 올바르지 않습니다.");
        } else {
            axios.post(`${process.env.REACT_APP_API_URL}/dup_check`, {
                "email": email
            }).then(function(response) {
                setIsDupEmail(false);
                setDupEmailMsg("사용 가능한 이메일입니다.");
            }).catch(function(error) {
                if (error.response) {
                    setIsDupEmail(true);
                    setDupEmailMsg("사용 불가능한 이메일입니다.");
                }
            });
        }
    }, [email, isEmailValid]);

    const handleRegister = useCallback(() => {
        if (!isNameValid) {
            setErrMsg("이름이 올바르지 않습니다.");
            return;
        } else if (isDupNickname) {
            setErrMsg("닉네임 중복확인을 해주세요.");
            return;
        } else if (isDupEmail) {
            setErrMsg("이메일 중복확인을 해주세요.");
            return;
        } else if (!isPasswordValid) {
            setErrMsg("비밀번호는 영문, 숫자, 특수기호 조합으로 10자리 이상 입력해주세요.");
        } else if (passwordCheck !== password) {
            setErrMsg("입력하신 비밀번호가 일치하지 않습니다.");
        } else if (ageCheck !== true || useCheck !== true) {
            setErrMsg("약관에 동의해주세요.");
        } else {
            const confirmed = window.confirm("입력하신 정보로 회원가입 하시겠습니까?");
            if (confirmed) {
                axios.post(`${process.env.REACT_APP_API_URL}/register`, {
                    'name': name,
                    'nickname': nickname,
                    'email': email,
                    'password': password
                }).then(function (response) {
                    alert("회원가입이 완료되었습니다.");
                }).catch(function (error) {
                    alert("회원가입 도중 문제가 발생했습니다. 다시 시도해주세요.");
                });
                navigate("/");
            }
        }
    }, [name, nickname, email, password, passwordCheck, isNameValid, isPasswordValid, ageCheck, useCheck, navigate]);



    return (
        <>
            {touModalOpen && (
                <TermOfUseModal 
                    visible={touModalOpen} 
                    onClose={() => setTOUModalOpen(false)}
                />
            )}
            {mcModalOpen && (
                <MarketingModal 
                    visible={mcModalOpen} 
                    onClose={() => setMCModalOpen(false)}
                />
            )}
            <RegisterContainer>
                <RegisterTemplate>
                    <MainText>일반회원 가입</MainText>
                    <ErrorMessage>{errMsg}</ErrorMessage>
                    <InputBox 
                        type="text" 
                        name="name" 
                        placeholder="이름" 
                        onChange={onChangeName} 
                        value={name}
                        onKeyDown={(e) => onKeyDownFunc(e)}
                        style={{marginBottom:"5px"}}
                    />
                    <InputBox 
                        type="text" 
                        name="nickname" 
                        placeholder="닉네임" 
                        onChange={onChangeNickname} 
                        value={nickname} 
                        onKeyDown={(e) => onKeyDownFunc(e)}
                        style={{paddingRight:"60px"}}
                    /><DupCheckBtn onClick={() => handlerNicknameDupCheck()}>중복 확인</DupCheckBtn>
                    <ErrorMessage style={isDupNickname ? {color:palette.redM} : {color:palette.blueM}}>{dupNicknameMsg}</ErrorMessage>
                    <InputBox 
                        type="text" 
                        name="email" 
                        placeholder="이메일" 
                        onChange={onChangeEmail} 
                        value={email} 
                        onKeyDown={(e) => onKeyDownFunc(e)}
                        style={{paddingRight:"60px"}}
                    /><DupCheckBtn onClick={() => handlerEmailDupCheck()}>중복 확인</DupCheckBtn>
                    <ErrorMessage style={isDupEmail ? {color:palette.redM} : {color:palette.blueM}}>{dupEmailMsg}</ErrorMessage>
                    <PasswordInputBox 
                        type={pwInputType.type}
                        name="password" 
                        placeholder="비밀번호" 
                        onChange={onChangePassword} 
                        value={password} 
                        onKeyDown={(e) => onKeyDownFunc(e)}
                        autoComplete={pwInputType.autoComplete}
                    /><ShowPwBtn onClick={() => setPwOpt(!pwOpt)}>{pwOpt ? <PwShow/> : <PwHide/>}</ShowPwBtn>
                    <ErrorMessage>{capsLockFlag && "Caps Lock이 켜져 있습니다."}</ErrorMessage>
                    <PasswordInputBox 
                        type={pwInputType.type}
                        name="password-check" 
                        placeholder="비밀번호 확인" 
                        onChange={onChangePasswordCheck} 
                        value={passwordCheck} 
                        onKeyDown={(e) => onKeyDownFunc(e)}
                        autoComplete={pwInputType.autoComplete}
                    />
                    <TermsForm>
                        <TermsTitleText>
                            약관에 동의해주세요.
                        </TermsTitleText>
                        <hr></hr>
                        <div>
                            <div>
                                <input 
                                    type="checkbox" 
                                    id="all-check" 
                                    checked={allCheck} 
                                    onChange={allBtnEvent} 
                                />
                                <TermsCheckboxText for="all-check">전체동의</TermsCheckboxText>
                            </div>
                            <div>
                                <input 
                                    type="checkbox" 
                                    id="check1" 
                                    checked={ageCheck} 
                                    onChange={ageBtnEvent} 
                                />
                                <TermsCheckboxText for="check1">만 14세 이상입니다. <span>[필수]</span></TermsCheckboxText>
                            </div>
                            <div>
                                <input 
                                    type="checkbox" 
                                    id="check2" 
                                    checked={useCheck} 
                                    onChange={useBtnEvent} 
                                />
                                <TermsCheckboxText for="check2">이용약관 <span>[필수]</span><TermSummaryButton onClick={handlerTOUModalClick}>내용 보기</TermSummaryButton></TermsCheckboxText>
                            </div>
                            <div>
                                <input 
                                    type="checkbox" 
                                    id="check3" 
                                    checked={marketingCheck} 
                                    onChange={marketingBtnEvent} 
                                />
                                <TermsCheckboxText for="check3">마케팅 동의 <span>[선택]</span><TermSummaryButton onClick={handlerMCModalClick}>내용 보기</TermSummaryButton></TermsCheckboxText>
                            </div>
                        </div>
                        
                    </TermsForm>
                    <RegisterBtn onClick={handleRegister}>회원가입</RegisterBtn>
                </RegisterTemplate>
            </RegisterContainer>
        </>
    );
}

const RegisterContainer = styled.div`
    margin: auto;
    margin-top: 80px;

    min-width: 300px;
    max-width: 426px;
    height: 100vh;
`

const RegisterTemplate = styled.div`
    box-sizing: border-box;
    background: ${palette.whiteL};
    filter: drop-shadow(0px 3px 10px rgba(0, 0, 0, 0.2));
    border-radius: 10px;

    margin: 10px;
    padding: 40px;

    min-width: 300px;
    max-width: 426px;
    height: auto;
`

const MainText = styled.h1`
    position: relative;

	text-align: left;
    font-family: "SC Dream 6";
	font-size: 24px;
	color: ${palette.blackB};
`

const InputBox = styled.input`
    position: relative;
    margin-top: 10px;
    box-sizing: border-box;

    background: ${palette.whiteL};

    padding-left: 20px;
    padding-right: 20px;
    text-align: left;
	font-size: 18px;
    color: ${palette.blackB};

    border: 2px solid ${palette.grayL};
    border-radius: 20px;
    width: 100%;
	height: 48px;

    &::placeholder {
        color: ${palette.grayL};
        font-family: "SC Dream 4";
    }

    &:focus {
        outline: none;
		border: 2px solid ${palette.blueM};
	}
`

const PasswordInputBox = styled.input`
    position: relative;
    margin-top: 10px;
    box-sizing: border-box;

    background: ${palette.whiteL};

    padding-left: 20px;
    padding-right: 42px;
    text-align: left;

    font-size: 18px;
    color: ${palette.blackB};

    border: 2px solid ${palette.grayL};
    border-radius: 20px;
    width: 100%;
    height: 48px;

    &::placeholder {
        color: ${palette.grayL};
        font-family: "SC Dream 4";
    }

    &:focus {
        outline: none;
		border: 2px solid ${palette.blueM};
	}
`

const DupCheckBtn = styled.button`
    position: absolute;
    box-sizing: border-box;
	margin-top: 16px;
    margin-left: -50px;
    border: none;
    border-radius: 10px 15px 15px 10px;
    padding: 4px;
    padding-left: 8px;
    padding-right:8px;
    background: ${palette.blueM};

	width: 42px;
	height: 36px;

    text-align: center;
    font-family: "SC Dream 6";
	font-size: 10px;
    color: ${palette.whiteL};

    &:hover {
        background: ${palette.blueB};
        cursor: pointer;
    }
`

const ShowPwBtn = styled.button`
    position: absolute;
    box-sizing: border-box;
	margin-top: 18px;
    margin-left: -40px;
    border: none;
    padding: 4px;
    background: transparent;

	width: 32px;
	height: 32px;

    &:hover {
        cursor: pointer;
    }
`

const ErrorMessage = styled.span`
    position: relative;
    display: block;
    margin-top: 5px;
    padding-left: 15px;
    padding-right: 15px;

    text-align: left;
    font-family: "SC Dream 4";
    font-size: 12px;
    color: ${palette.redM};
`

const RegisterBtn = styled.button`
    position: relative;
    box-sizing: border-box;
	margin-top: 24px;
    border: none;
    background: ${palette.blueM};
    
    text-align: center;
    font-family: "SC Dream 6";
	font-size: 18px;
    color: ${palette.whiteL};

    border-radius: 10px;
	width: 100%;
	height: 48px;

    &:hover {
        background: ${palette.blueB};
        cursor: pointer;
    }
`

const TermSummaryButton = styled.button`
    border: 0;
    background-color: transparent;

    position: absolute;
    right: -4%;
    width: 90px;

    text-align: center;
    text-decoration: underline;
    font-family: "SC Dream 4";
	font-size: 12px;
    color: ${palette.grayM};

    cursor: pointer;
`

const TermsForm = styled.div`
    position: relative;
    margin-top: 38px;
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
    font-family: "SC Dream 4";
	font-size: 12px;
    color: ${palette.grayM};
`

const TermsTitleText = styled.label`
    margin-bottom: 30px;
    font-family: "SC Dream 4";
	font-size: 16px;
    color: ${palette.blackB};
`

const TermsCheckboxText = styled.label`
    margin-left: 5px;
    width: 100%;
`

export default RegisterPage;
