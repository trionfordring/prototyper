import { BasicPackageType } from '@/remote/package-gql';
import { Card, Checkbox, CheckboxProps } from 'antd';
import { ResourceTypeTag } from './ResourceLine';
import styled from 'styled-components';

const Line = styled.div`
  display: flex;
`;

export function DependenciesCheckbox({
  pkg,
  small,
  ...props
}: CheckboxProps & {
  pkg: BasicPackageType;
  small?: boolean;
}) {
  return (
    <Card className="hover-shadow" size={small ? 'small' : 'default'}>
      <Line>
        <Checkbox {...props}>
          <ResourceTypeTag type={pkg.type} />
          <span>
            {pkg.name} @ {pkg.version}
          </span>
        </Checkbox>
      </Line>
    </Card>
  );
}
