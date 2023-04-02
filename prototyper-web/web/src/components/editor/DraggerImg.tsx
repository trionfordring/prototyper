import { HOST } from '@/env';
import { ImgSizeType } from '@/types/dragger';
import { FileOutlined } from '@ant-design/icons';
import Image from 'next/image';
import styled from 'styled-components';

const getSrc = (src: string) => {
  let host = HOST;
  if (host.startsWith('//')) host = window.location.protocol + host;
  return host + src;
};

const ImgContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  .img-fit,
  .img-null {
    object-fit: contain;
    max-width: 100%;
    height: fit-content;
  }
  .img-small {
    object-fit: contain;
    & {
      width: 5em;
      max-height: 6em;
    }
  }
`;

export function DraggerImg({
  src,
  fit = 'fit',
  width = 50,
  height = 50,
}: {
  src?: string;
  width?: number;
  height?: number;
  fit?: ImgSizeType;
}) {
  if (!src) return <FileOutlined />;
  return (
    <ImgContainer>
      <Image
        alt=""
        unoptimized
        src={getSrc(src)}
        width={width}
        height={height}
        className={`img-${fit}`}
      />
    </ImgContainer>
  );
}
