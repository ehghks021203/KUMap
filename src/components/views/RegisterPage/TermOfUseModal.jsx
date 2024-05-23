import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import palette from '../../../lib/styles/colorPalette';

function Modal({ className, onClose, visible, children }) {
    const handleClose = () => {
        onClose?.();
    };
    return (
        <>
            <ModalOverlay visible={visible} />
            <ModalWrapper className={className} tapIndex="-1" visible={visible}>
                <ModalInner tapIndex="0" className="modal-inner">
                    <MainText>이용 약관</MainText>
                    <CloseBtn onClick={handleClose}>
                        닫기
                    </CloseBtn>
                    <Content>
                        저희 서비스는 투명하고 공정한 토지 거래 및 투자시장을 목표로 토지 시장 참여자들이 
                        토지 가격에 실질적으로 접근하는데 필요한 각종의 정보를 제공하는 서비스입니다. 
                        저희는 언제나 좀 더 나은 방향으로 운영 원칙을 제정하고 개선해 나가고자 합니다. 
                        저희 서비스의 이용약관과 개인정보보호정책에 관한 좋은 의견이 있으시면 언제든지 
                        ehghks021203@gmail.com으로 보내주시기 바랍니다.
                        <br/><br/>
                        해당 내용은 디스코 서비스 이용 약관을 참고한 것으로, 수정이 필요합니다.
                        <br/><br/>
                        <BoldText>제1장 총칙</BoldText>
                        <br/><br/>
                        <BoldText>제1조 (목적)</BoldText>
                        <br/>
                        본 약관은 HCL 연구팀(이하 "회사"라 함)이 운영하는 인터넷 사이트 및 모바일 
                        어플리케이션(이하 "토지가격예측 서비스"라 함)에서 제공하는 제반 서비스의 이용과 
                        관련하여 회사와 이용자 및 이용자간의 권리, 의무 및 책임사항, 기타 필요한 사항을 
                        규정함을 목적으로 합니다.
                        <br/><br/>
                        <BoldText>제2조 (정의)</BoldText>
                        <br/>
                        1. 토지가격예측 서비스: 회사가 컴퓨터 등 정보통신설비를 이용하여 제공하는 서비스를 
                        말하며, 아울러 인터넷 사이트 및 모바일 어플리케이션을 운영하는 주체의 의미로도 사용합니다.
                        <br/>
                        2. 이용자: 토지가격예측 서비스에 접속하여 본 약관에 따라 회사가 제공하는 서비스를 받는 회원 
                        및 비회원을 말합니다.
                        <br/>
                        3. 회원: 회사에 개인정보를 제공하여 회원등록을 한 자로서, 디스코의 정보를 지속적으로 제공받으며, 
                        회사가 제공하는 디스코의 서비스를 계속적으로 이용할 수 있는 자를 말합니다. 회사는 서비스의 원활한 
                        제공을 위해 회원의 등급을 회사 내부의 규정에 따라 나눌 수 있습니다.
                        <br/>
                        4. 비회원: 회원으로 가입하지 않고 회사가 제공하는 서비스를 이용하는 자를 말합니다.
                        <br/>
                        5. 아이디(ID): 회원의 식별과 서비스 이용을 위하여 회원이 설정하고 회사가 승인한 문자나 숫자의 
                        조합을 말합니다. 
                        <br/>
                        6. 비밀번호: 회원의 동일성 확인과 회원정보의 보호를 위하여 회원이 설정하고 회사가 승인한 문자나 
                        숫자의 조합을 말합니다. 
                        <br/>
                        7. 서비스: 구현되는 단말기(PC, TV, 휴대형 단말기 등의 각종 유무선 장치를 포함)와 상관없이 회원이 
                        이용할 수 있는 토지가격예측의 서비스를 의미합니다.
                    </Content>
                </ModalInner>
            </ModalWrapper>
        </>
    )
}

Modal.propTypes = {
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
    padding-bottom: 60px;
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

const Content = styled.div`
    margin-top: 12px;
    padding-right: 6px;
    width: auto;
    height: 400px;
    overflow-y: auto;

    text-align: left;
    font-family: "SC Dream 4";
    font-size: 15px;
    color: rgba(25,25,25,1);

    &::-webkit-scrollbar {
        width: 10px;
    }

    &::-webkit-scrollbar-thumb {
        height: 30%;
        background: ${palette.blueM};
        border-radius: 10px;
    }

    &::-webkit-scrollbar-track {
        border-radius: 5px;
        background: ${palette.blueVL};
    }
`

const BoldText = styled.span`
    font-family: "SC Dream 6";
    font-size: 15px;
    color: rgba(25,25,25,1);
`

export default Modal