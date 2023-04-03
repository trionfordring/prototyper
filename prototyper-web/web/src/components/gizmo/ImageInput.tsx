import { HOST } from '@/env';
import { useUncontrolledState } from '@/hooks/useUncontrolledState';
import { authorization } from '@/remote';
import { ID } from '@/types/api';
import { ResourceUrl } from '@/types/resourcePackage';
import { UploadOutlined } from '@ant-design/icons';
import { Upload, message } from 'antd';
import ImgCrop from 'antd-img-crop';
import type { RcFile } from 'antd/es/upload';
import { noop } from 'lodash';

const beforeUpload = (file: RcFile) => {
  const isImage = file.type.startsWith('image');
  if (!isImage) {
    message.error('只能上传图片文件!');
  }
  return isImage;
};

export function ImageInput({
  value,
  onChange = noop,
  defaultValue,
}: {
  value?: ID;
  onChange?: (v: ID) => void;
  defaultValue?: ID;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [id, setId] = useUncontrolledState(value, onChange, defaultValue);

  return (
    <ImgCrop beforeCrop={beforeUpload}>
      <Upload
        name="files"
        action={`${HOST}/api/upload`}
        method="POST"
        headers={{
          Authorization: authorization,
        }}
        listType="picture-card"
        maxCount={1}
        accept="image/*"
        beforeUpload={beforeUpload}
        onChange={({ file }) => {
          if (file.status === 'done' && Array.isArray(file.response)) {
            const fileInfo: ResourceUrl = file.response[0];
            setId(fileInfo.id);
          }
        }}
      >
        <UploadOutlined /> 上传图片
      </Upload>
    </ImgCrop>
  );
}
