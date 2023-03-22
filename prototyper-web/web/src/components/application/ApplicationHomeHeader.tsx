import styled from 'styled-components';
import { useApplicationInfo } from '../context/ApplicationInfoProvider';
import { ApplicationPlayLink } from './ApplicationPlayLink';

const Box = styled.div`
  background-color: rgb(40, 44, 52);
  color: rgb(255, 255, 255);
`;
const Main = styled.div`
  padding-top: 80px;
  padding-bottom: 64px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  max-width: 1260px;
`;
const Title = styled.h1`
  font-size: 52px;
  color: rgb(97, 218, 251);
  text-align: center;
  margin: 0px;
  letter-spacing: 0.01em;
`;
const Description = styled.p`
  padding-top: 20px;
  font-size: 24px;
  text-align: center;
  letter-spacing: 0.01em;
  font-weight: 200;
`;
const BtnGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-top: 48px;
  flex-wrap: wrap;
`;
const PlayBtn = styled.div`
  .ant-typography {
    color: rgb(0, 0, 0);
    display: inline-block;
    background-color: rgb(97, 218, 251);
    font-size: 18px;
    padding: 10px 25px;
    white-space: nowrap;
    transition: background-color 0.2s ease-out 0s;
  }
  .ant-typography:hover {
    color: rgb(0, 0, 0);
    background-color: white;
  }
  .ant-typography:focus {
    color: rgb(0, 0, 0);
  }
`;

export function ApplicationHomeHeader() {
  const applicationInfo = useApplicationInfo();
  return (
    <Box>
      <Main>
        <Title>{applicationInfo.label || applicationInfo.name}</Title>
        <Description>{applicationInfo.description}</Description>
        <BtnGroup>
          <PlayBtn>
            <ApplicationPlayLink>访问主页</ApplicationPlayLink>
          </PlayBtn>
        </BtnGroup>
      </Main>
    </Box>
  );
}
