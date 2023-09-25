import './index.module.scss';
import { HomeTemplate } from '../src/templates';
import { useSessionStore } from '../src/store/session';
import { useMemberInfo } from '../src/services/account/account.queries';
import { useStore } from 'src/store';
import { useMentor } from '../src/services/mentors/mentors.queries';

export function IndexPage() {
  const { memberType, memberId, name, logged } = useSessionStore(state => ({
    memberType: state.memberType,
    memberId: state.memberId,
    name: state.name,
    logged: state.logged,
  }));

  const { setUser, setHasResumeStory } = useStore();
  useMemberInfo(memberId, data => setUser({ user: data }));
  // TODO 멘티용 API 따로 생기면 셋팅 필요
  // 홈 화면에 성장스토리 여부에 따라 버튼 명칭 달라져서 로그인 시 호출
  const { data: userResumeStory } = useMentor(logged ? memberId : null);
  console.log('login', logged);
  // console.log(userResumeStory);
  // console.log(`memberType: ${memberType}, memberId: ${memberId}, name: ${name}, logged: ${logged}`);

  // return <HomeTemplate logged={logged} userType={userResumeStory?.type} />;
  // return <HomeTemplate logged={logged} hasUserResumeStory={!!userResumeStory} userType={userResumeStory?.type} />;
  return <HomeTemplate logged={logged} hasUserResumeStory={!!userResumeStory} userType={userResumeStory?.type} />;
}

export default IndexPage;

IndexPage.LayoutProps = {
  darkBg: true,
  classOption: 'custom-header',
  title: '커리어 멘토스',
};
