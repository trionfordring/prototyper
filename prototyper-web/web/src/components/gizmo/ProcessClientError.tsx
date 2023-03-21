import { Alert, List } from 'antd';
import { ClientError } from 'graphql-request';
import { GraphQLError } from 'graphql-request/dist/types';
import { useEffect } from 'react';
import styled from 'styled-components';

const ErrDesc = styled.div`
  overflow: auto;
  max-height: 400px;
`;
const MyAlert = styled(Alert)`
  margin-bottom: 8px;
  padding: 5px;
`;

function processGraphQLError(err: GraphQLError) {
  const name = (err.extensions?.error as any)?.name || err.name;
  switch (name) {
    case 'ValidationError':
      return '校验未通过';
    case 'UnauthorizedError':
      return '权限不足';
    default:
      return err.message;
  }
}

export function ProcessClientError({ err }: { err: ClientError | Error }) {
  useEffect(() => {
    console.error(err);
  }, [err]);
  if (err instanceof ClientError) {
    const errs = err.response.errors || [err.response.error];
    return (
      <MyAlert
        type="error"
        description={
          <ErrDesc>
            <List
              itemLayout="horizontal"
              size="small"
              dataSource={errs}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta description={processGraphQLError(item)} />
                </List.Item>
              )}
            ></List>
          </ErrDesc>
        }
      ></MyAlert>
    );
  } else {
    return <MyAlert type="error" description={err.message} showIcon></MyAlert>;
  }
}
