import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useSessionStore } from '../../store/session';
import ChatbotModal from 'src/stories/components/ChatBot';
import ProfessorExpModal from 'src/stories/components/ProfessorExp';
import { useColorPresets } from 'src/utils/use-theme-color';
import { useColorPresetName } from 'src/utils/use-theme-color';
import { usePresets } from 'src/utils/color-presets';
import { setCookie } from 'cookies-next';
/** date picker */
import React from 'react';

const cx = classNames.bind(styles);
export interface BlogProps {
  logged: boolean;
  tenantName: string;
}

export function BlogTemplate({ logged = false, tenantName = '' }: BlogProps) {
  const router = useRouter();
  const { token } = useSessionStore.getState();
  const COLOR_PRESETS = usePresets();
  const { setColorPresetName } = useColorPresetName();
  const { setColorPresets } = useColorPresets();
  const [isClient, setIsClient] = useState(false); // 클라이언트 사이드에서만 렌어링하도록 상태 추가

  // useEffect(() => {
  //   // URL 쿼리 파라미터에서 accessToken 추출
  //   const { authStore } = router.query;

  //   if (authStore) {
  //     // 인코딩된 JSON 문자열을 디코딩하고 파싱
  //     const parsedAuthStore = JSON.parse(decodeURIComponent(authStore));
  //     console.log('AuthStore:', parsedAuthStore);
  //     localStorage.setItem('auth-store', parsedAuthStore);

  //     const json = JSON.parse(parsedAuthStore);
  //     console.log(json?.state?.token);

  //     setCookie('access_token', json?.state?.token);
  //     localStorage.setItem('accessToken', json?.state?.token);
  //   } else {
  //     console.log('No access token found in query parameters.');
  //   }
  // }, [router.query]);
  //   if (authStore) {
  //     console.log('AccessToken:', accessToken);
  //     console.log('authStore:', authStore);
  //     setCookie('access_token', accessToken);

  //     // 인코딩된 JSON 문자열을 디코딩하고 파싱
  //     const parsedAuthStore = JSON.parse(decodeURIComponent(authStore));
  //     console.log('AuthStore:', parsedAuthStore);
  //     localStorage.setItem('auth-store', parsedAuthStore);

  //     // 필요한 로직 수행 예: 서버에 토큰 전송하여 사용자 정보 가져오기
  //     // fetchUserData(accessToken);
  //   } else {
  //     console.log('No access token found in query parameters.');
  //   }
  // }, [router.query]);

  useEffect(() => {
    setIsClient(true); // 클라이언트 사이드에서 상태를 true로 설정
    if (!COLOR_PRESETS || COLOR_PRESETS.length === 0) return;

    const preset = COLOR_PRESETS.find(preset => preset.name === tenantName) || COLOR_PRESETS[0];
    setColorPresetName(preset.name);
    setColorPresets(preset.colors);
  }, []);

  const [modalIsProfessor, setModalIsProfessor] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState();
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer sk-proj-EQRpCFUOrWX31G6qtbfuT3BlbkFJbpINIqMxynuo438hg4yP`,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: question }],
          temperature: 0.5,
          // max_tokens: 200,
        }),
      });

      setQuestion('');

      const responseData = await response.json();
      console.log('responseData', responseData);
      setAnswer(responseData.choices[0].message.content.trim()); // Assuming the API returns the response in this format

      const element = document.createElement('a');
      const file = new Blob([responseData.choices[0].message.content.trim()], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = 'response.txt';
      document.body.appendChild(element);
      element.click();
    } catch (error) {
      console.error('Error fetching API:', error);
      setResponse('Failed to fetch response from the API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cx('career-main')}>
      <div className={cx('iframe-container')}>
        <section
          className={cx(
            'top-banner',
            'hero-section',
            'hero-section-3',
            'tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center',
          )}
        >
          <iframe
            src="https://maxkim-j.github.io/posts/runtime-integration-micro-frontends/"
            title="YouTube video player"
            allowFullScreen
            width="90%"
            height="800px"
            scrolling="yes"
            style={{ overflow: 'scroll' }}
          ></iframe>
        </section>
      </div>
      <div className={cx('career-main')}>
        <section
          className={cx(
            'top-banner',
            'hero-section',
            'hero-section-3',
            'tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center',
          )}
        >
          <fieldset className="tw-p-4 tw-rounded-lg tw-text-center tw-w-[800px]">
            <legend className="sr-only">댓글쓰기 폼</legend>

            <div className="mb-4">
              <div className="mb-2">
                <label htmlFor="name" className="tw-sr-only">
                  이름
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="tw-text-white tw-w-full tw-p-2 tw-border tw-border-gray-300 tw-rounded-lg"
                  placeholder="Name"
                  tabIndex={1}
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  비밀번호
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="tw-w-full tw-p-2 tw-border tw-border-gray-300 tw-rounded-lg"
                  placeholder="Password"
                  tabIndex={2}
                />
              </div>
            </div>

            {/* <div>{answer}</div> */}

            <div className="mb-4">
              <div className="flex items-center">
                <input type="checkbox" name="secret" id="secret" className="mr-2" tabIndex={4} />
                <label htmlFor="secret" className="text-gray-700">
                  <span className="inline-block w-4 h-4 mr-2 tw-border tw-border-gray-300 tw-rounded tw-bg-white"></span>
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="comment" className="sr-only">
                내용
              </label>
              <textarea
                name="comment"
                id="comment"
                className="tw-w-full tw-p-2 tw-border tw-border-gray-300 tw-rounded-lg"
                placeholder="여러분의 소중한 댓글을 입력해주세요"
                tabIndex={3}
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                className="tw-w-full tw-p-2 tw-bg-blue-500 tw-text-white tw-rounded-lg"
                onClick={handleSubmit}
                tabIndex={5}
              >
                Send
              </button>
            </div>
          </fieldset>
        </section>
      </div>
    </div>
  );
}

export default BlogTemplate;
