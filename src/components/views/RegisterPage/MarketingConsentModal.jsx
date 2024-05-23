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
                    <MainText>마케팅 동의</MainText>
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
                        <BoldText>마케팅 약관에 관한 상세 내용은 아직 기입하지 않았습니다.</BoldText>
                        <br/><br/>
                        <BoldText>마케팅 약관에 관한 상세 내용은 아직 기입하지 않았습니다.</BoldText>
                        <br/><br/>
                        <BoldText>마케팅 약관에 관한 상세 내용은 아직 기입하지 않았습니다.</BoldText>
                        <br/><br/>
                        <BoldText>마케팅 약관에 관한 상세 내용은 아직 기입하지 않았습니다.</BoldText>
                        <br/><br/>
                        <BoldText>마케팅 약관에 관한 상세 내용은 아직 기입하지 않았습니다.</BoldText>
                        <br/><br/>
                        <BoldText>마케팅 약관에 관한 상세 내용은 아직 기입하지 않았습니다.</BoldText>
                        <br/><br/>
                        <BoldText>마케팅 약관에 관한 상세 내용은 아직 기입하지 않았습니다.</BoldText>
                        <br/><br/>
                        <BoldText>마케팅 약관에 관한 상세 내용은 아직 기입하지 않았습니다.</BoldText>
                        <br/><br/>
                        <BoldText>마케팅 약관에 관한 상세 내용은 아직 기입하지 않았습니다.</BoldText>
                        <br/><br/>
                        <BoldText>마케팅 약관에 관한 상세 내용은 아직 기입하지 않았습니다.</BoldText>
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