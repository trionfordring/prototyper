import Head from 'next/head';
import { useAuthChecker } from '@/hooks/useAuthChecker';
import { Avatar, Card, InputNumber, List, Typography } from 'antd';
import { FullPageCenter } from '@/components/gizmo/FullPageCenter';
import { MeSmallInfo } from '@/components/me/MeSmallInfo';
import Link from 'next/link';
import { IndexLayout } from '@/layout/IndexLayout';
import { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import { PageMain } from '@/layout/PageMain';
import { HomeTitle } from '@/components/home/HomeTitle';

export default function Home() {
  useAuthChecker();
  return (
    <IndexLayout>
      <Head>
        <title>Prototyper</title>
      </Head>
      <PageMain>
        <HomeTitle />
      </PageMain>
    </IndexLayout>
  );
}
