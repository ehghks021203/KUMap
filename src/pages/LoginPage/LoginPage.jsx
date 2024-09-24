import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from "styled-components";
import PasswordResetModal from './PasswordResetModal';
import palette from '../../constants/styles';

import { ReactComponent as PwShow } from "../../assets/images/icons/eye_password_show.svg";
import { ReactComponent as PwHide } from "../../assets/images/icons/eye_password_hide.svg";

function LoginPage() {
    const [pwModalOpen, setPwModalOpen] = useState(false);

    const onClickModalBtn = () => {
        setPwModalOpen(true);
    };


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errMsg, setErrMsg] = useState("");

    // 비밀번호 보이기
    const [pwOpt, setPwOpt] = useState(false);
    const [pwInputType, setPwInputType] = useState({
        type: "password",
        autoComplete: "current-password",
    });

    // Caps Lock 켜져있는지 확인하는 변수
    const [capsLockFlag, setCapsLockFlag] = useState(false);


    const navigate = useNavigate();

    // 이메일 
    const onChangeEmail = useCallback(async (e) => {
        const currEmail = e.target.value;
        setErrMsg("");
        setEmail(currEmail);
    }, []);

    // 비밀번호
    const onChangePassword = useCallback((e) => {
        const currPassword = e.target.value;
        setErrMsg("");
        setPassword(currPassword);
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
            handleLogin();
        }
    };

    const handleLogin = useCallback(() => {
        if (email === "") {
            setErrMsg("이메일을 입력해주세요.");
            return;
        } else if (password === "") {
            setErrMsg("비밀번호를 입력해주세요.");
        } else {
            axios.post(`${process.env.REACT_APP_API_URL}/login`, {
                "email": email,
                "password": password
            }).then(function (response) {
                // 로컬 저장소에 엑세스 토큰과 리프레쉬 토큰 저장
                localStorage.setItem("access_token", response.data.access_token);
                localStorage.setItem("refresh_token", response.data.refresh_token);
                navigate("/");
            })
            .catch(function (error) {
                if (error.response) {
                    setErrMsg("이메일 또는 비밀번호를 잘못 입력했습니다.");
                }
            });
        }
    }, [email, password, navigate]);


    return (
        <>
            {pwModalOpen && (<PasswordResetModal visible={pwModalOpen} onClose={() => setPwModalOpen(false)} />)}
            <LoginContainer>
                <LoginTemplate>
                    <div>
                        <MainText>일반회원 로그인</MainText>
                    </div>
                    <ErrorMessage>{errMsg}</ErrorMessage>
                    <EmailInputBox 
                        type="text" 
                        name="email" 
                        placeholder="이메일" 
                        onChange={onChangeEmail} 
                        value={email} 
                        onKeyDown={(e) => onKeyDownFunc(e)}
                    />
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
                    <LoginBtn onClick={handleLogin}>로그인</LoginBtn>   
                    <TextButtonContainer>
                        <div style={{ width: 91 }}>
                            <TextButton onClick={onClickModalBtn}>비밀번호 찾기</TextButton>
                        </div>
                        <DivLine/>
                        <div style={{ width: 91 }}>
                            <TextButton onClick={() => navigate("/register")}>회원가입</TextButton>
                        </div>
                    </TextButtonContainer>
                </LoginTemplate>
            </LoginContainer>
        </>
    );
}

const LoginContainer = styled.div`
    margin: auto;
    margin-top: 120px;

    min-width: 300px;
    max-width: 426px;
    height: 100vh;
`

const LoginTemplate = styled.div`
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

const EmailInputBox = styled.input`
    position: relative;
    margin-top: 5px;
    box-sizing: border-box;

    background: ${palette.whiteL};

    padding-left: 20px;
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

const LoginBtn = styled.button`
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

const TextButtonContainer = styled.div`
    box-sizing: border-box;    
    margin-top: 17px;
    display:flex;
    margin: 0 auto; 
    width: 100%;
    height: 40px;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
`

const TextButton = styled.button`
    border: 0;
    background-color: transparent;
    width: 90px;
    text-align: center;
    font-family: "SC Dream 4";
	font-size: 12px;
    color: ${palette.grayM};

    cursor: pointer;
`

const DivLine = styled.hr`
    margin: 0;
    margin-top: 3px;

    border : 1px solid ${palette.grayM};
    height : 13px;
`

export default LoginPage;
