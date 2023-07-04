import { SProf } from './Styles';
import Chip from 'src/stories/components/Chip';
import styles from './index.module.scss';
import classNames from 'classnames/bind';

//Import Icons
import React from 'react';
import IconButton from '@mui/material/IconButton';
import Clear from '@mui/icons-material/Clear';
import Stack from '@mui/material/Stack';

import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import { useRouter } from 'next/router';

function SkillLevelPage(probs) {
  switch (probs.name) {
    case 1:
      return (
        <Chip chipColor="primary" variant="filled" radius={4} className="mr-2 mt-1">
          {probs.name} 레벨
        </Chip>
      );
    case 2:
      return (
        <Chip chipColor="design" variant="filled" radius={4} className="mr-2 mt-1">
          {probs.name} 레벨
        </Chip>
      );
    case 3:
      return (
        <Chip chipColor="gray" variant="filled" radius={4} className="mr-2 mt-1">
          {probs.name} 레벨
        </Chip>
      );
    case 4:
      return (
        <Chip chipColor="black" variant="filled" radius={4} className="mr-2 mt-1">
          {probs.name} 레벨
        </Chip>
      );
    default:
      return (
        <Chip chipColor="design" variant="filled" radius={4} className="mr-2 mt-1">
          {probs.name} 레벨
        </Chip>
      );
  }
}

const cx = classNames.bind(styles);
const Profile = props => {
  const router = useRouter();
  return (
    <SProf style={{ width: 'calc(50vw)' }}>
      {props?.profile ? (
        <div>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={0}>
            <div></div>
            <div>
              <IconButton
                onClick={() => props.onBackPress()}
                color="primary"
                aria-label="upload picture"
                component="label"
              >
                <Clear />
              </IconButton>
            </div>
          </Stack>

          <div
            style={{
              height: '3%',
              margin: '10px 0px',
              background: 'var(--bit-bg-dent,#ffffff)',
              border: '1px solid #ededed',
              textAlign: 'center',
              lineHeight: '49px',
              // border: '1pxsolidvar(--bit-border-color-lightest,#ededed)',
              borderRadius: '10px',
            }}
          >
            [{props?.profile.level}레벨] {props?.profile.description}
          </div>
          <section className="section mt-3">
            <div className="section-heading">
              <h5>직무설명</h5>
              <div className="section-heading-line-left"></div>
              <Typography sx={{ textAlign: 'left' }} variant="body1">
                {props?.profile.description}
                <br />
              </Typography>
            </div>
          </section>
          <section className="section mt-3">
            <div className="section-heading">
              <h5>직무 필요 역량</h5>
              <div className="section-heading-line-left"></div>
            </div>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={3} columns={10}>
                {props?.profile?.capabilities.map((item, index) => {
                  return (
                    <Grid xs={5} key={index}>
                      <Box sx={{ minWidth: 150 }}>
                        <Card variant="outlined" sx={{ borderRadius: 1 }}>
                          <CardContent>
                            <Stack direction="row" spacing={1}>
                              <Typography
                                variant="h6"
                                sx={{ fontSize: 14, textAlign: 'left' }}
                                color="text.black"
                                gutterBottom
                              >
                                {item.capabilityName}
                              </Typography>
                              <Chip chipColor="design" variant="outlined" radius={4}>
                                필수 - {item.levelCount} 순위
                              </Chip>
                            </Stack>
                            <SkillLevelPage name={item.capabilityLevels[0].capabilityLevel}></SkillLevelPage>
                            {/* {item.capabilityLevels.map(levels => {
                              return <SkillLevelPage name={levels.capabilityLevel[0]}></SkillLevelPage>;
                            })} */}

                            {/* <Typography sx={{ mb: 1.5, textAlign: 'left' }} color="text.secondary">
                      adjective
                    </Typography> */}
                            <Typography sx={{ textAlign: 'left' }} variant="body2">
                              <br />
                              {item.description}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </section>
          <a href="#" onClick={() => router.push('/skill')}>
            <div className={cx('banner', 'mt-4')}>
              <div className={cx('banner-text')}>
                스킬/경험 소개 보러 가기
                <img
                  src="assets/images/icons/fluent-emoji_clapping-hands.svg"
                  alt="clap-icon"
                  className={cx('clap-icon')}
                />
              </div>
              <img src="assets/images/banner/seminar_bg.png" alt="background" />
            </div>
          </a>
        </div>
      ) : (
        <section
          className="hero-section ptb-100 background-img full-screen"
          style={
            {
              // background: "url('assets/img/app-hero-bg.jpg')no-repeat center center / cover",
            }
          }
        >
          <div className="container">
            <div className="row align-items-center justify-content-center">
              <div className="col-md-9 col-lg-7">
                <div className="error-content text-center text-white">
                  <div className="notfound-404">
                    <h1 className="text-white">404</h1>
                  </div>
                  <h3 className="text-white">콘텐츠 준비중입니다.</h3>
                  <div>양질의 콘텐츠로 찾아뵙겠습니다.</div>
                  <div>감사합니다.</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        // <></>
      )}
    </SProf>
  );
};

export default Profile;
