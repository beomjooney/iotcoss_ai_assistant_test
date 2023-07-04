import { SProf } from './Styles';
import { Chip } from '@mui/material';

import React, { useCallback, useMemo } from 'react';
import dagre from 'dagre';
import QueryNode from './QueryNode';

import IconButton from '@mui/material/IconButton';
import Clear from '@mui/icons-material/Clear';
import Stack from '@mui/material/Stack';

import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import { ArticleCard } from '../../stories/components';
import ReactFlow, { addEdge, ConnectionLineType, useNodesState, useEdgesState } from 'react-flow-renderer';
import _Chip from 'src/stories/components/Chip';
import { RecommendContent } from 'src/models/recommend';
import { ArticleEnum } from '../../config/types';
// import ReactFlow, { useNodesState, useEdgesState, addEdge } from 'react-flow-renderer';
import Carousel from 'react-elastic-carousel';
import { makeStyles } from '@mui/styles';

const styles = {
  chipItem: {
    '& .MuiChip-label': {
      borderRadius: '10px',
      fontSize: '15px',
      fontWeight: '700',
      paddingLeft: '11px',
      paddingRight: '11px',
    },
  },
  gridItem: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    p: 1,
    border: '1px solid 	#E8E8E8',
    mt: 1,
    borderRadius: 2,
  },
};

const initialNodes = [
  {
    id: 'input',
    type: 'input',
    data: {
      label: 'Input',
    },
    // position: { x: 0, y: 80 },
    sourcePosition: 'right',
    // targetPosition: 'left',
  },
  {
    id: 'Git',
    data: {
      label: '1. Git : 몰루',
      // position: { x: 0, y: 80 },
      sourcePosition: 'right',
      targetPosition: 'left',
    },
  },
  {
    id: 'BackEnd',
    data: {
      label: '2. BackEnd : 몰루',
      // position: { x: 0, y: 80 },
      sourcePosition: 'right',
      targetPosition: 'left',
    },
  },
  {
    id: 'Spring',
    data: {
      label: '3. Spring : 몰루',
      // position: { x: 0, y: 80 },
      sourcePosition: 'right',
      targetPosition: 'left',
    },
  },
  {
    id: 'output',
    type: 'output',
    data: {
      label: 'Node 4',
    },
    // sourcePosition: 'right',
    targetPosition: 'left',
    // position: { x: 500, y: 80 },
  },
];

const initialEdges = [
  {
    id: 'e2',
    source: 'input',
    target: 'Git',
    animated: true,
    // label: 'edge label',
  },
  {
    id: 'e3',
    source: 'Git',
    target: 'output',
    animated: true,
    // label: 'edge label',
  },
  {
    id: 'e5',
    source: 'input',
    target: 'BackEnd',
    animated: true,
    // label: 'edge label',
  },
  {
    id: 'e6',
    source: 'BackEnd',
    target: 'output',
    animated: true,
    // label: 'edge label',
  },
  {
    id: 'e7',
    source: 'input',
    target: 'Spring',
    animated: true,
    // label: 'edge label',
  },
  {
    id: 'e8',
    source: 'Spring',
    target: 'output',
    animated: true,
    // label: 'edge label',
  },
];

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 200;
const nodeHeight = 50;

const getLayoutedElements = (nodes, edges, direction = 'LR') => {
  const isVertical = direction === 'TB';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach(node => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach(node => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isVertical ? 'top' : 'left';
    node.sourcePosition = isVertical ? 'bottom' : 'right';

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges);

const EdgeInfo = props => {
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const onConnect = useCallback(
    params => setEdges(eds => addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)),
    [],
  );

  const onLayout = useCallback(
    direction => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, direction);

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges],
  );

  function SkillTearPage(probs) {
    switch (probs.name) {
      case '급하락':
        return <img src="/assets/images/skill/falling2.png" alt="profile"></img>;
      case '하락':
        return <img src="/assets/images/skill/falling1.png" alt="profile"></img>;
      case '일반':
        return <img src="/assets/images/skill/unchange.png" alt="profile"></img>;
      case '상승':
        return <img src="/assets/images/skill/rasing1.png" alt="profile"></img>;
      case '급상승':
        return <img src="/assets/images/skill/rasing2.png" alt="profile"></img>;
      default:
        return <img src="/assets/images/skill/unchange.png" alt="profile"></img>;
    }
  }

  function SkillSelectPage(probs) {
    switch (probs.name) {
      case 1:
        return (
          <_Chip chipColor="primary" variant="outlined" radius={4}>
            추천
          </_Chip>
        );
      case 2:
        return (
          <_Chip chipColor="design" variant="outlined" radius={4}>
            필수
          </_Chip>
        );
      case 3:
        return (
          <_Chip chipColor="gray" variant="outlined" radius={4}>
            선택
          </_Chip>
        );
      default:
        return <_Chip chipColor="design" variant="outlined" radius={4} />;
    }
  }

  function SkillUsePage(probs) {
    switch (probs.name) {
      case 1:
        return <img src="/assets/images/skill/0.png" alt="profile"></img>;
      case 2:
        return <img src="/assets/images/skill/25.png" alt="profile"></img>;
      case 3:
        return <img src="/assets/images/skill/75.png" alt="profile"></img>;
      default:
        return <img src="/assets/images/skill/0.png" alt="profile"></img>;
    }
  }
  const handleDragStart = e => e.preventDefault();

  const card = (
    <React.Fragment>
      <CardContent>
        <Typography sx={{ fontSize: 14, textAlign: 'center' }} color="text.secondary" gutterBottom>
          Word of the Day
        </Typography>
        <Typography sx={{ textAlign: 'center' }} variant="h5" component="div">
          asdfd
        </Typography>
        <Divider sx={{ borderColor: 'black' }} component="div" />
        <Typography sx={{ mb: 1.5, textAlign: 'center' }} color="text.secondary">
          adjective
        </Typography>
        <Typography sx={{ textAlign: 'center' }} variant="body2">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography>
      </CardContent>
    </React.Fragment>
  );

  return (
    <SProf style={{ width: 'calc(50vw)' }}>
      {props?.profile ? (
        <div>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={0}>
            <div>
              <h5 style={{ marginBottom: '0px' }}>Edge 정보</h5>
              <div className="section-heading-line-left"></div>
            </div>
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
          {/* <div
        style={{
          height: '11%',
          margin: '10px 0px',
          background: 'var(--bit-bg-dent,#ffffff)',
          border: '1px solid #ededed',
          // border: '1pxsolidvar(--bit-border-color-lightest,#ededed)',
          borderRadius: '10px',
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          attributionPosition="bottom-right"
          // connectionLineType={ConnectionLineType.SmoothStep}
        />
      </div> */}
          <section className="section mt-5 mb-5">
            <Grid spacing={2.5} container direction="row" justifyContent="space-evenly" alignItems="center">
              {props.profile?.growthEdgePath.map(item => (
                <Grid key={item.pathOrder} xs={4}>
                  <Box key={item.pathOrder} component={Grid} boxShadow={5} sx={{ borderRadius: '5px' }}>
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <Chip sx={styles.chipItem} color="primary" variant="outlined" label={item.pathOrder} />
                        <div className="ml-3 font-weight-bold">{item.growthEdgePathName}</div>
                      </Typography>
                      <Typography variant="body2" color="text.secondary" className="mt-4 mb-3">
                        {item.description}
                      </Typography>
                      <div className="mt-2 font-weight-bold h7">필요 스킬</div>
                      {item.skills.map(skill => (
                        <Box key={skill.skillId} component="div" sx={styles.gridItem}>
                          {/* {skill.name} */}
                          <Box sx={{ width: '35%' }}>
                            <div className="font-weight-bold small">{skill.skillName}</div>
                          </Box>
                          <SkillSelectPage name={skill.trendLevel}></SkillSelectPage>
                          <SkillTearPage name={skill.activeLevel}></SkillTearPage>
                          <SkillUsePage name={skill.edgeRecommendType}></SkillUsePage>
                        </Box>
                      ))}
                      <div className="mt-3 font-weight-bold h7">필요 경험</div>
                      {item.experiences.map(experience => (
                        <Box key={experience.experienceId} component="div" sx={styles.gridItem}>
                          {/* {skill.name} */}
                          <Box sx={{ width: '35%' }}>
                            <div className="font-weight-bold small">{experience.experienceName}</div>
                          </Box>
                          <SkillSelectPage name={experience.trendLevel}></SkillSelectPage>
                          <SkillTearPage name={experience.activeLevel}></SkillTearPage>
                          <SkillUsePage name={experience.edgeRecommendType}></SkillUsePage>
                        </Box>
                      ))}
                    </CardContent>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </section>
          <section className="section mt-3">
            <div className="section-heading">
              <h5>추천 콘텐츠</h5>
              <div className="section-heading-line-left"></div>
            </div>

            <Carousel itemPadding={[5, 0]} itemsToShow={2} isRTL>
              {props?.profile?.recommendContents ? (
                props.profile?.recommendContents.map((item, index) => {
                  return <ArticleCard uiType={item.contentsType} key={index} content={item} mdSize="col-md-12" />;
                })
              ) : (
                <></>
              )}
            </Carousel>
          </section>
          <section className="section mt-3">
            <div className="section-heading">
              <h5>추천 사이트</h5>
              <div className="section-heading-line-left"></div>
            </div>
            <Carousel itemPadding={[5, 0]} itemsToShow={2} showEmptySlots className="mb-5" isRTL>
              {props?.profile?.recommendContents ? (
                props.profile?.recommendService.map((item, index) => {
                  return <ArticleCard uiType={item.contentsType} key={index} content={item} mdSize="col-md-12" />;
                })
              ) : (
                <></>
              )}
            </Carousel>
            <div>&nbsp;</div>
          </section>
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

export default EdgeInfo;
