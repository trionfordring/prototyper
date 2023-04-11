import styled from 'styled-components';
import { useApplicationInfo } from '../context/ApplicationInfoProvider';
import { ApplicationPlayLink } from './ApplicationPlayLink';
import { ArrowRightOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { Typography } from 'antd';

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

const LinkItem = styled(Link)`
  padding-left: 15px;
  font-size: 20px;
  display: inline-block;
  color: #61dafb;
  text-decoration: none;
  transition: color 0.2s ease-out;
  &:hover {
    color: white;
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
          {applicationInfo.index ? (
            <>
              <PlayBtn>
                <ApplicationPlayLink>访问主页</ApplicationPlayLink>
              </PlayBtn>
              <LinkItem
                href={{
                  pathname: '/app/[id]/components',
                  query: {
                    id: applicationInfo.id,
                    search: applicationInfo.index.name,
                  },
                }}
              >
                主页组件 <ArrowRightOutlined />
              </LinkItem>
            </>
          ) : (
            <>
              <PlayBtn>
                <Link
                  passHref
                  legacyBehavior
                  href={{
                    pathname: '/app/[id]/components',
                    query: {
                      id: applicationInfo.id,
                      creating: true,
                    },
                  }}
                >
                  <Typography.Link>创建组件</Typography.Link>
                </Link>
              </PlayBtn>
              <LinkItem
                href={{
                  pathname: '/app/[id]/settings',
                  hash: 'info',
                  query: {
                    id: applicationInfo.id,
                  },
                }}
              >
                设置主页
              </LinkItem>
            </>
          )}
        </BtnGroup>
      </Main>
    </Box>
  );
}
