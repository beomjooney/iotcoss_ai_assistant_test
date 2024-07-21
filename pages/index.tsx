import './index.module.scss';
import { HomeTemplate } from '../src/templates';
import { useSessionStore } from '../src/store/session';
import { useMemberInfo, useMyProfile } from '../src/services/account/account.queries';
import { useStore } from 'src/store';
import { useState } from 'react';

export function IndexPage() {
  const { memberType, memberId, name, logged, job } = useSessionStore(state => ({
    memberType: state.memberType,
    memberId: state.memberId,
    name: state.name,
    logged: state.logged,
  }));

  const { setUser } = useStore();
  const { data } = useMemberInfo(memberId, data => {
    console.log('inputData', data);
    setUser({ user: data });
  });

  const { data: myProfileData } = useMyProfile(data => {
    console.log('inputData', data);
  });
  console.log('myProfile', myProfileData?.tenant);

  // TODO 로그인 수정 변경
  return (
    <div>
      {myProfileData?.tenant?.tenantName === 'devus' || myProfileData?.tenant?.tenantName === null ? (
        <HomeTemplate
          logged={logged}
          // job={!!user?.jobGroup}
          // hasUserResumeStory={!!userResumeStory}
          // userType={userResumeStory?.type}
        />
      ) : (
        <div>test</div>
      )}
    </div>
  );
}

export default IndexPage;

IndexPage.LayoutProps = {
  darkBg: true,
  classOption: 'custom-header',
  title: '데브어스',
};
