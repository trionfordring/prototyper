import { Button, Space } from 'antd';
import Link from 'next/link';
import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import Typed from 'typed.js';

const TitleBox = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: row;
  position: relative;
  width: 1200px;
  margin: 0 auto;
  margin-top: 120px;

  .lighter {
    font-weight: 300;
  }
`;
const Left = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 55%;
`;
const Title = styled.h1`
  display: flex;
  flex-direction: row;
  position: relative;
  flex-shrink: 0;
  box-sizing: border-box;
  flex-wrap: wrap;
  justify-content: flex-start;
  font-size: 50px;
  font-weight: 600;
  line-height: 58px;
  letter-spacing: -0.1rem;
  gap: 18px;
  margin-bottom: 24px;
`;
const NewLine = styled.div`
  width: 100%;
`;
const TitleImg = styled.img`
  object-fit: contain;
  object-position: center;
  height: 100%;
  width: 100%;
  min-height: 20px;
  min-width: 20px;
  overflow: hidden;
  margin-left: 12px;
`;
const PointerImg = styled(TitleImg)`
  max-width: 44px;
`;

const BoxImg = styled(TitleImg)`
  max-width: 136px;
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  flex-shrink: 0;
  box-sizing: border-box;
  line-height: 28px;
  height: auto;
  text-align: left;
  font-size: 18px;
  max-width: 500px;
  margin-right: auto;
  color: rgba(0, 0, 0, 1);
  margin-top: 10px;
  > div {
    display: inline-flex;
  }
  .prefix {
    margin-right: 0.5em;
  }
`;
const Actions = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  flex-shrink: 0;
  box-sizing: border-box;
  margin-top: 20px;
  .btn {
    min-width: 10em;
    height: 50px;
    line-height: 38px;
  }
  .market {
    background-color: black;
    color: white;
  }
  .market:hover {
    color: #61dafb;
  }
`;
const Right = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  flex-shrink: 0;
  box-sizing: border-box;
  min-height: 200px;
  min-width: 20px;
  width: 46%;
`;
const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  position: absolute;
`;

const TITLE_TIPS = ['网页界面', '页面组件', '可视化图表', 'CMS应用', '...'];

export function HomeTitle() {
  const typedEl = useRef<HTMLElement>();
  useEffect(() => {
    const typed = new Typed(typedEl.current, {
      strings: TITLE_TIPS,
      typeSpeed: 150,
    });

    return () => {
      typed.destroy();
    };
  }, []);
  return (
    <TitleBox>
      <Left>
        <Title>
          <div>
            <span className="lighter">Prototyper 低代码平台</span>
          </div>
          <div>
            <PointerImg width={44} src="/home/pointer.png" />
          </div>
          <span>用拖拽的方式</span>
          <div>
            <BoxImg width={136} src="/home/box.svg" />
          </div>
          <NewLine>
            <span>快速构建你的</span>
            <span className="build-type" ref={typedEl}></span>
          </NewLine>
        </Title>
        <Content>
          <div>使用拖拽组件和模型驱动的逻辑来创建网页。</div>
          <br />
          <div>
            <div className="prefix">Q:</div>
            <div>和其他低代码平台有什么区别呢?</div>
          </div>
          <div>
            <div className="prefix">A:</div>
            <div>
              更加自由，更加灵活！
              <br />
              复用组件，递归组件，循环组件，完全地控制DOM。
            </div>
          </div>
        </Content>
        <Actions>
          <Space size="large">
            <Link passHref legacyBehavior href="/applications">
              <Button className="btn market" size="large">
                查看应用市场
              </Button>
            </Link>
            <Link passHref legacyBehavior href="/me/apps/create">
              <Button className="btn create" size="large">
                创建应用
              </Button>
            </Link>
          </Space>
        </Actions>
      </Left>
      <Right>
        <Video src="/home/desc.mp4" autoPlay muted playsInline loop />
      </Right>
    </TitleBox>
  );
}
