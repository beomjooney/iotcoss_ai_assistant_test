import './index.module.scss';
import { HomeTemplate } from '../src/templates';
import { useSessionStore } from '../src/store/session';
// import { useMemberInfo } from '../src/services/account/account.queries';
import { useStore } from 'src/store';
import { useMentor } from '../src/services/mentors/mentors.queries';
import { useState } from 'react';

export function IndexPage() {
  const { memberType, memberId, name, logged, job } = useSessionStore(state => ({
    memberType: state.memberType,
    memberId: state.memberId,
    name: state.name,
    logged: state.logged,
    job: state.job,
  }));
  // const { setUser, setHasResumeStory, user } = useStore();
  // const { data } = useMemberInfo(memberId, data => {
  //   console.log('inputData', data);
  //   setUser({ user: data });
  // });

  // TODO 로그인 수정 변경
  // console.log(user, data, user.jobGroup, !!user?.jobGroup);
  // 홈 화면에 추가 입력 로그인 시 호출
  // const { data: userResumeStory } = useMentor(logged ? memberId : null);
  // console.log(userResumeStory, data, !!userResumeStory);
  // console.log(`memberType: ${memberType}, memberId: ${memberId}, name: ${name}, logged: ${logged}`);

  // return <HomeTemplate logged={logged} userType={userResumeStory?.type} />;
  // return <HomeTemplate logged={logged} hasUserResumeStory={!!userResumeStory} userType={userResumeStory?.type} />;
  return (
    <HomeTemplate
      logged={logged}
      // job={!!user?.jobGroup}
      // hasUserResumeStory={!!userResumeStory}
      // userType={userResumeStory?.type}
    />
  );
}

export default IndexPage;

IndexPage.LayoutProps = {
  darkBg: true,
  classOption: 'custom-header',
  title: '데브어스',
};
