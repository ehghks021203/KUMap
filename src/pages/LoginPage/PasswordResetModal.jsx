import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import axios from 'axios';
import palette from '../../constants/styles';

function PasswordResetModal({ className, onClose, visible }) {
    const [errMsg, setErrMsg] = useState("");
    const [email, setEmail] = useState("");
    const onChangeEmail = useCallback(async (e) => {
        const currEmail = e.target.value;
        setEmail(currEmail);
    }, []);

    // 이메일 유효성 검사
    const validateEmail = (email) => {
        return email
            .toLowerCase()
            .match(/([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/);
    }
    const isEmailValid = validateEmail(email);

    const handleSendEmail = useCallback(() => {
        if (!isEmailValid) { 
            setErrMsg("이메일 형식이 올바르지 않습니다.");
        } else {
            axios.post(`${process.env.REACT_APP_API_URL}/reset_password`, {
                "email": email
            }).then(function (response) {
                console.log(response.data.result)
                if (response.data.result === "success") {
                    alert("이메일이 확인되었습니다. 메일로 임시비밀번호 발송하였습니다");
                    //onClose?.();
                }
            }).catch(function(error) {
                if (error.response) {
                    alert("이메일을 다시 확인해주세요");
                }
            });
        }
    });

    const handleClose = () => {
        //onClose?.();
    };

    return (
        <>
            <ModalOverlay visible={visible} />
            <ModalWrapper className={className} tapIndex="-1" visible={visible}>
                <ModalInner tapIndex="0" className="modal-inner">
                    <MainText>비밀번호 재설정</MainText>
                    <CloseBtn onClick={handleClose}>닫기</CloseBtn>
                    <EmailInputBox 
                        placeholder="E-mail 주소 입력" 
                        onChange={onChangeEmail} 
                        value={email}
                    />
                    <ErrorMessage>{errMsg}</ErrorMessage>
                    <SendEmailButton onClick={handleSendEmail}>메일 전송하기</SendEmailButton>
                </ModalInner>
            </ModalWrapper>
        </>
    )
}

PasswordResetModal.propTypes = {
    visible: PropTypes.bool,
}

const ModalWrapper = styled.div`
    box-sizing: border-box;
    display: ${(props) => (props.visible ? "block" : "none")};
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    overflow: auto:
    outline: 0;
`

const ModalOverlay = styled.div`
    box-sizing: border-box;
    display: ${(props) => (props.visible ? "block" : "none")};
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 999;
`

const ModalInner = styled.div`
    box-sizing: border-box;
    position: relative;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.5);
    background-color: #ffffff;
    border-radius: 5px;
    min-width: 300px;
    max-width: 450px;
    height: auto;
    max-height: 701px; 
    top: 50%;
    transform: translateY(-50%);
    margin: 0 auto;
    padding: 40px;
`

const CloseBtn = styled.div`
    position: absolute;
    top: 2%;
    right: 0%;
    
    width: 40px;
    height: 40px;
    margin: 32px;

    font-family: "SC Dream 6";
    text-align: center;
	font-size: 15px;
    color: ${palette.blackB};

    cursor: pointer;
`

const MainText = styled.h1`
    position: relative;
    margin-top: 0px;

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
		border: 2px solid ${palette.blackM};
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

const SendEmailButton = styled.button`
    position: relative;
    box-sizing: border-box;
    margin-top: 24px;
    border: none;
    background: ${palette.blackL};

    text-align: center;
    font-family: "SC Dream 6";
    font-size: 18px;
    color: ${palette.whiteL};

    border-radius: 10px;
    width: 100%;
    height: 48px;

    &:hover {
        background: ${palette.blackM};
        cursor: pointer;
    }
`

export default PasswordResetModal