import React, { useState, useEffect } from 'react';
import NodeDrawer from '../../components/drawer/NodeDrawer';
import SectionHeader from 'src/stories/components/SectionHeader';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Banner from 'src/stories/components/Banner';
import _Typography from 'src/stories/components/Typography';
import { useNode } from 'src/services/node/node.queries';
import { useEdge } from 'src/services/edge/edge.queries';
import { makeStyles } from '@mui/styles';
import Toggle from 'src/stories/components/Toggle';
import _styles from '../../../pages/skill/index.module.scss';
import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { useRouter } from 'next/router';
import Typography from '@mui/material/Typography';

const jobContent = [
  {
    contendId: 1,
    contentsName: '[직무입문]',
    contentsLevel: '0레벨',
    description: '직무스킬(개발언어/프레임워크 등) 학습 중. 상용서비스 개발 경험X',
  },
  {
    contendId: 1,
    contentsName: '[직무초보]',
    contentsLevel: '1레벨',
    description: '상용서비스 단위모듈 수준 개발 가능. 서비스개발 리딩 시니어 필요',
  },
  {
    contendId: 2,
    contentsName: '[직무실무]',
    contentsLevel: '2레벨',
    description: '상용서비스 개발 1인분 가능한 사람(직무 동료). 소규모 서비스 독자 개발 가능',
  },
  {
    contendId: 3,
    contentsName: '[직무리더(전문가)]',
    contentsLevel: '3레벨',
    description: '상용서비스 개발 리더. 담당직무분야 N명 업무가이드 및 리딩 가능',
  },
  {
    contendId: 4,
    contentsName: '[직군리더]',
    contentsLevel: '4레벨',
    description: '다수 상용서비스 개발 리더. 수십명~수백명 수준 개발자 총괄 리더',
  },
  {
    contendId: 5,
    contentsName: '[업계유명인]',
    contentsLevel: '5레벨',
    description: '본인 오픈소스/방법론 등이 범용적 사용, 수백명이상 다수 직군 리딩',
  },
];

const style = {
  title: {
    borderRadius: '10px',
  },
  title1: {
    paddingBottom: '50',
  },
  center: {
    width: '100%',
    textAlign: 'center',
  },
};
/* eslint-disable-next-line */
interface ListPageProps {}
export function NavigationTemplate(props: ListPageProps) {
  // router 정보
  const router = useRouter();
  const { id, groupId } = router.query;
  const [pathId, setPathId] = useState('');
  const [nodeId, setNodeId] = useState('');
  const [value, setValue] = useState([]);
  const [valueLevel, setValueLevel] = useState([]);
  const [error, setError] = useState('');
  const [nodes, setNodes] = useState([]);
  const [flag, setFlag] = useState(true);
  //checkbox
  const [checkedList, setCheckedList] = useState([]);
  const [itemsChecked, setItemsChecked] = useState(true);

  const [checkedLevelList, setCheckedLevelList] = useState([]);
  const [itemsLevelChecked, setItemsLevelChecked] = useState(true);

  useEffect(() => {
    if (nodeData) {
      setValue(checkedList);
      setFlag(true);
      const filteredNodes = filterNodes(checkedList, valueLevel, nodeData.data);
      setNodes([...filteredNodes]);
    }
  }, [checkedList]);

  useEffect(() => {
    if (nodeData) {
      setValueLevel(checkedLevelList);
      setFlag(true);
      const filteredNodes = filterNodes(value, checkedLevelList, nodeData.data);
      setNodes([...filteredNodes]);
    }
  }, [checkedLevelList]);

  //checkbox event
  const handleCheckboxClick = e => {
    const { value, checked } = e.target;
    const valueCheckName = value;
    if (checked) {
      setCheckedList(checkedList.filter(item => item != valueCheckName));
    } else {
      setCheckedList([...checkedList, valueCheckName]); //*1 해줘야 number로 들어가서 type 호환이 됨.
    }
  };

  const handleCheckboxLevelClick = e => {
    const { value, checked } = e.target;
    const valueCheckName = value;
    if (checked) {
      setCheckedLevelList(checkedLevelList.filter(item => item != valueCheckName));
    } else {
      setCheckedLevelList([...checkedLevelList, valueCheckName]); //*1 해줘야 number로 들어가서 type 호환이 됨.
    }
  };

  const selectItem = e => {
    const { checked } = e.target;
    const collection = [];

    if (!checked) {
      for (const item of filterOptions(nodeData.data)) {
        collection.push(item.value);
      }
    }
    setCheckedList(collection);
    setItemsChecked(checked);
  };

  const selectLevelItem = e => {
    const { checked } = e.target;
    const collectionLevel = [];

    if (!checked) {
      for (const item of filterLevelOptions(nodeData.data)) {
        collectionLevel.push(item.value);
      }
    }
    setCheckedLevelList(collectionLevel);
    setItemsLevelChecked(checked);
  };

  const [nodeDarwerState, setNodeDarwerState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const [edgeDarwerState, setEdgeDarwerState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const onClickCloseDrawer = (edge, open, pathIds) => {
    setEdgeDarwerState({ ...edgeDarwerState, [edge]: false });
  };

  const onClickCloseNodeDrawer = (node, open) => {
    setNodeDarwerState({ ...nodeDarwerState, [node]: false });
  };

  const onClickNodeDrawer = (node, open, nodeId, exposeDetail) => {
    setNodeId(nodeId);
    if (exposeDetail) setNodeDarwerState({ ...nodeDarwerState, [node]: open });
  };

  const onClickEdgeDrawer = (edge, open, pathIds, exposeDetail) => {
    setPathId(pathIds);
    if (exposeDetail) setEdgeDarwerState({ ...edgeDarwerState, [edge]: open });
  };

  const { isLoading: nodeLoading, data: nodeData } = useNode();
  const { isLoading: edgeLoading, data: edgeData } = useEdge();
  const setPathEdge = edge => {
    return edge;
  };

  const filterOptions = nodes => {
    const options = nodes.map(node => {
      return { label: node.data.group, value: node.data.group };
    });
    return options.filter((option, index) => {
      return (
        options.findIndex(i => {
          return option.value === i.value;
        }) === index
      );
    });
  };

  const filterLevelOptions = nodes => {
    const options = nodes.map(node => {
      return { label: node.data.level, value: node.data.level };
    });
    return options.filter((option, index) => {
      return (
        options.findIndex(i => {
          return option.value === i.value;
        }) === index
      );
    });
  };

  const filterNodes = (selected, selectedGroup1, nodes) => {
    const group = nodes?.filter(node => {
      return !selected?.find(select => select === node.data.group);
    });

    const group1 = nodes?.filter(node => {
      return !selectedGroup1?.find(select => select === node.data.level);
    });

    return group.filter(it => group1.includes(it));
  };

  useEffect(() => {
    console.log(flag);
  }, [flag]);

  useEffect(() => {
    if (nodeData) {
      if (id) {
        switch (id) {
          case '0100':
            setCheckedList(['디자인', '개발', '엔지니어링']);
            break;
          case '0200':
            setCheckedList(['기획', '개발', '엔지니어링']);
            break;
          case '0300':
            setCheckedList(['기획', '디자인', '엔지니어링']);
            break;
          case '0400':
            setCheckedList(['기획', '디자인', '개발']);
            break;
        }
        setNodes(filterNodes(value, valueLevel, nodeData.data));
      } else {
        setCheckedList([]);
        setNodes(filterNodes(value, valueLevel, nodeData.data));
      }
      // console.log('parameter', id);
    }
  }, [nodeData]);

  const card = <React.Fragment></React.Fragment>;

  const useStyles = makeStyles({
    root: {
      '& .MuiGrid2-root': {
        padding: '5px',
      },
      '& .MuiCheckbox-root': {
        color: 'black',
      },
      '& .MuiGrid-root>.MuiGrid-item': {
        paddingTop: 0,
      },
      color: '#000',
    },
  });

  const cx = classNames.bind(styles);
  const classes = useStyles();
  const boxWidth = 110;
  return (
    <div>
      <section className="hero-section  hero-section-3">
        <Banner title="커리어네비게이션" subTitle="커맨네비" imageName="top_banner_navi.svg" />
      </section>
      <div className="section-heading text-center pt-100">
        <SectionHeader title="커리어멘토스의 성장맵" subTitle="GROWTH MAP" />
      </div>
      <article>
        <div style={{ paddingLeft: '0px', paddingRight: '0px' }}>
          <div className="row justify-content-center">
            <div className="section-heading">
              <section>
                {nodeLoading || edgeLoading ? (
                  <div>Loading...</div>
                ) : (
                  <div>
                    <div className={cx('seminar-container')}>
                      <div className={cx('container')}>
                        <article>
                          <div className={cx('filter-area', 'top-filter', 'pt-3')}>
                            <div className={cx('seminar-button__group')}>
                              <_Typography type="B1" bold>
                                직군
                              </_Typography>
                              <Box width={boxWidth}>
                                <Toggle
                                  className={cx('box-width')}
                                  label="직군 전체"
                                  name="mentoring"
                                  value="ALL"
                                  variant="small"
                                  isActive
                                  checked={itemsChecked}
                                  type="checkBox"
                                  onClick={selectItem.bind(this)}
                                />
                              </Box>

                              {filterOptions(nodeData.data).map(item => {
                                return (
                                  <Box width={boxWidth} key={item.value}>
                                    <Toggle
                                      className={cx('box-width')}
                                      label={item.value}
                                      name={item.value}
                                      value={item.value}
                                      variant="small"
                                      type="checkBox"
                                      checked={!checkedList.includes(item.value)}
                                      isActive
                                      onChange={handleCheckboxClick}
                                    />
                                  </Box>
                                );
                              })}
                            </div>
                            <div className={cx('seminar-button__group')}>
                              <_Typography type="B1" bold>
                                레벨
                              </_Typography>
                              <Box width={boxWidth}>
                                <Toggle
                                  className={cx('box-width')}
                                  label="레벨 전체"
                                  name="mentoring"
                                  value="ALL"
                                  variant="small"
                                  isActive
                                  checked={itemsLevelChecked}
                                  type="checkBox"
                                  onClick={selectLevelItem.bind(this)}
                                />
                              </Box>

                              {filterLevelOptions(nodeData.data).map(item => {
                                return (
                                  <Box width={boxWidth} key={item.value}>
                                    <Toggle
                                      className={cx('box-width')}
                                      label={item.label}
                                      name={item.value}
                                      value={item.value}
                                      variant="small"
                                      type="checkBox"
                                      checked={!checkedLevelList.includes(item.value)}
                                      isActive
                                      onChange={handleCheckboxLevelClick}
                                    />
                                  </Box>
                                );
                              })}
                            </div>
                          </div>
                        </article>
                      </div>
                    </div>
                    <div className={_styles.TabsNode}>
                      <div style={{ ...style.title1 }}>
                        <NodeDrawer
                          drawerState={nodeDarwerState}
                          nodeId={nodeId}
                          onClick={onClickCloseNodeDrawer}
                          onClickClose={() => onClickNodeDrawer('right', false, '', '')}
                        />
                        <div
                          style={{
                            height: '3%',
                            margin: '-20px 32px 40px 6px',
                            background: 'var(--bit-bg-dent,#ffffff)',
                            border: '1px solid #ededed',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            lineHeight: '49px',
                            // border: '1pxsolidvar(--bit-border-color-lightest,#ededed)',
                            borderRadius: '10px',
                          }}
                        >
                          - 상세기능은 23년 상반기 오픈 예정. 성장노드(필요역량/채용추천 제공),
                          성장엣지(필요스킬/필요경험/추천콘텐츠/추천서비스 제공)
                        </div>

                        <Typography component="h6"></Typography>
                        <Box
                          sx={{
                            flexGrow: 0,
                            marginLeft: '10px',
                            marginRight: '30px',
                            marginTop: '0px',
                            marginBottom: '-23px',
                          }}
                        >
                          <Grid container direction="row" spacing={1} columns={12}>
                            {jobContent.map((item, index) => {
                              return (
                                <Grid xs={2} key={index}>
                                  <Box
                                    sx={{
                                      borderRadius: 2,
                                      minWidth: 155,
                                      height: 160,
                                      color: 'white',
                                      background: ' linear-gradient(to bottom,  #f2f2f5 0%, white 100%);',
                                    }}
                                  >
                                    <CardContent>
                                      <Box sx={{ mb: 0, textAlign: 'center', fontWeight: 'bold', color: 'gray' }}>
                                        {item.contentsName}
                                      </Box>
                                      <Box
                                        sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: 19, color: 'black' }}
                                      >
                                        {item.contentsLevel}
                                      </Box>
                                      <Typography
                                        className="mt-3"
                                        sx={{ mt: 5, textAlign: 'center', color: 'gray' }}
                                        variant="body2"
                                      >
                                        {item.description}
                                      </Typography>
                                    </CardContent>
                                  </Box>
                                </Grid>
                              );
                            })}

                            <Grid xs={2}>
                              <Box sx={{ minWidth: 155 }}>
                                <Card>{card}</Card>
                              </Box>
                            </Grid>
                            <Grid xs={2}>
                              <Box sx={{ minWidth: 155 }}>
                                <Card>{card}</Card>
                              </Box>
                            </Grid>
                            <Grid xs={2}>
                              <Box sx={{ minWidth: 155 }}>
                                <Card>{card}</Card>
                              </Box>
                            </Grid>
                            <Grid xs={2}>
                              <Box sx={{ minWidth: 275 }}>
                                <Card>{card}</Card>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      </div>
                      &nbsp;
                      <div style={{ ...style.title }}></div>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
export default NavigationTemplate;
