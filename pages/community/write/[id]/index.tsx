import './index.module.scss';
import { CommunityWriteTemplate } from 'src/templates';
import { useSessionStore } from 'src/store/session';
import { useRouter } from 'next/router';
import { fetchCommunityPost, useGetPost } from 'src/services/community/community.queries';
import { dehydrate, UseQueryResult } from 'react-query';
import { NextPageContext } from 'next';
import { useEffect } from 'react';
const { memberId, logged } = useSessionStore.getState();

export interface CommunityPageProps {
  error: boolean;
}

export function CommunityPage({ error }: CommunityPageProps) {
  const { logged } = useSessionStore.getState();
  const router = useRouter();
  useEffect(() => {
    if (!logged || error) {
      alert('비정상적인 접근입니다.');
      router.push('/community');
    }
  }, [error]);

  let id = parseInt(router.query['id'].toString());
  const { data: postData, isLoading }: UseQueryResult<any> = useGetPost(id);
  return <>{!error && (isLoading ? <span>Loading...</span> : <CommunityWriteTemplate postData={postData} />)}</>;
}

export default CommunityPage;

CommunityPage.LayoutProps = {
  darkBg: false,
  classOption: 'custom-header',
  title: '커리어 멘토스',
};

export async function getServerSideProps({ req }) {
  console.log(req.headers.referer);
  if (!req.headers.referer) {
    return { props: { error: true } };
  }
  return { props: { error: false } };
}

// export async function getServerSideProps(ctx: NextPageContext) {
//   const { memberId, logged } = useSessionStore.getState();
//   const { query } = ctx;
//   console.log('getServerSideProps 2 : ', query);
//   // let queryClient = await fetchCommunityPost(parseInt(query.toString()));
//   console.log(logged, memberId);
//   // queryClient.setQueryData('logged', logged);
//   // return {
//   //   props: { ...query, dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))) },
//   // };
// }
