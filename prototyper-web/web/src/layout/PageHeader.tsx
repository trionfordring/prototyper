import styled, { css } from 'styled-components';
import Link from 'next/link';
import { ComponentProps } from 'react';
import { useRouter } from 'next/router';

const Header = styled.div``;

const TopHeader = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 24px;
  color: white;
  background-color: #20232a;
  line-height: 60px;
  .nav {
    display: flex;
  }
`;
const TopLeft = styled.div`
  h1 {
    font-size: 24px;
    margin: 0;
    color: #61dafb;
  }
`;
const TopCenter = styled.div`
  padding: 0 48px;
  min-width: 360px;
  font-weight: 300;
`;
const TopRight = styled.div`
  min-width: 360px;
`;

export function PageHeader({
  title = 'Prototyper',
  center,
  nav = [],
}: {
  title?: React.ReactNode;
  center?: React.ReactNode;
  nav?: ({
    isActived?: (pathname: string) => boolean;
    key?: string;
    label: React.ReactNode;
  } & ComponentProps<typeof Link>)[];
}) {
  return (
    <Header>
      <TopHeader>
        <TopLeft>
          <h1>{title}</h1>
        </TopLeft>
        <TopCenter>{center}</TopCenter>
        <TopRight>
          <nav className="nav">
            {nav.map((item, idx) => (
              <NavItem {...item} key={item.key || idx}>
                {item.label}
              </NavItem>
            ))}
          </nav>
        </TopRight>
      </TopHeader>
    </Header>
  );
}

const NavLink = styled.a<{
  actived?: boolean;
}>`
  padding-left: 20px;
  padding-right: 20px;
  font-size: 18px;
  color: #ffffff;
  transition: color 0.2s ease-out;
  text-decoration: none;
  display: flex;
  position: relative;
  flex-direction: column;
  font-weight: 300;
  &:hover {
    color: #61dafb;
  }
  ${(props) => {
    if (!props.actived) return null;
    return css`
      color: #61dafb;
    `;
  }}
  .underline {
    position: absolute;
    bottom: -1px;
    height: 4px;
    background: #61dafb;
    left: 0;
    right: 0;
    z-index: 1;
  }
`;

function NavItem(
  props: ComponentProps<typeof Link> & {
    isActived?: (pathname: string) => boolean;
  }
) {
  const router = useRouter();
  const currentPath = router.pathname;
  const isActive =
    props.isActived ||
    ((pathname) =>
      typeof props.href === 'string'
        ? pathname === props.href
        : pathname === props.href.pathname);
  const actived = isActive(currentPath);

  return (
    <Link {...props} legacyBehavior passHref>
      <NavLink actived={actived}>
        <span>{props.children}</span>
        {actived ? <span className="underline"></span> : null}
      </NavLink>
    </Link>
  );
}
