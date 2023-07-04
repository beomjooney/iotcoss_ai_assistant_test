import React, { useState, useCallback, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { makeStyles } from '@mui/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Chip from 'src/stories/components/Chip';
import { useSkills } from 'src/services/skill/skill.queries';
import { useExperiences } from 'src/services/experiences/experiences.queries';
import Typography from 'src/stories/components/Typography';
import Toggle from 'src/stories/components/Toggle';
import styles from './index.module.scss';
import classNames from 'classnames/bind';

const useStyles = makeStyles({
  tabs: {
    '& .MuiTabs-indicator': {
      backgroundColor: 'orange',
      height: 0,
    },
    '& .MuiTab-root.Mui-selected': {
      border: '1px solid',
      background: '#3d6afe',
      color: 'white',
    },
    '& .MuiTab-root': {
      border: '1px solid',
      marginRight: '10px',
      borderRadius: '5px',
    },
  },
  root: {
    '& .MuiGrid-root': {
      padding: '5px',
      width: '500px !important',
    },
    '& .MuiCheckbox-root': {
      color: 'black',
    },
    '& .MuiGrid-root>.MuiGrid-item': {
      paddingTop: 0,
    },
    '& .MuiGrid-root>.MuiGrid-container': {
      width: '500px !important',
    },
    color: '#000',
    marginBottom: '-15px',
    '&$checked': {
      color: '#000',
    },
  },
});

export default function SessionList() {
  const [value, setValue] = useState([]);
  const [error, setError] = useState('');
  const [valueLevel, setValueLevel] = useState([]);
  const [activeTab, setActiveTab] = useState('스킬');
  const [tabIndex, setTabIndex] = useState(0);
  const [tabs, setTabs] = useState([]);
  const [datas, setDatas] = useState([]);
  const [allData, setAlldata] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [checkedList, setCheckedList] = useState([]);
  const [itemsChecked, setItemsChecked] = useState(true);
  const [checkedLevelList, setCheckedLevelList] = useState([]);
  const [itemsLevelChecked, setItemsLevelChecked] = useState(true);

  useEffect(() => {
    if (allData) {
      setValue(checkedList);
      localStorage.setItem('selected-group-skill', JSON.stringify(checkedList));
      const filteredNodes = filterNodes(checkedList, valueLevel, getCurrentList());
      setDatas([...filteredNodes]);
    }
  }, [checkedList]);

  useEffect(() => {
    if (allData) {
      setValueLevel(checkedLevelList);
      localStorage.setItem('selected-level-skill', JSON.stringify(checkedLevelList));
      const filteredNodes = filterNodes(value, checkedLevelList, getCurrentList());
      setDatas([...filteredNodes]);
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
    console.log('handleCheckboxLevelClick : ', e);
    const { value, checked } = e.target;
    const valueCheckName = value;
    if (checked) {
      setCheckedLevelList(checkedLevelList.filter(item => item != valueCheckName));
    } else {
      setCheckedLevelList([...checkedLevelList, valueCheckName * 1]); //*1 해줘야 number로 들어가서 type 호환이 됨.
    }
  };

  const selectItem = e => {
    const { checked } = e.target;
    const collection = [];

    if (!checked) {
      for (const item of filterOptionsCategoryName(allData)) {
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
      // for (const category of filterOptions(nodeData.data)) {
      for (const item of filterOptionsType(allData)) {
        collectionLevel.push(item.value);
      }
      // }
    }
    setCheckedLevelList(collectionLevel);
    setItemsLevelChecked(checked);
  };

  function renameKey(obj, oldKey, newKey, name) {
    if (name === '') {
      obj[newKey] = obj[oldKey];
      delete obj[oldKey];
    } else {
      obj[newKey] = obj[oldKey];
      delete obj[oldKey];
      obj['categoryName'] = name;
    }
  }

  let tmpTab = [];
  let mergeData = [];

  function SkillSelectPage(probs) {
    switch (probs.name) {
      case '개발':
        return (
          <Chip chipColor="develop" variant="outlined" radius={4} className="mr-2">
            {probs.name}
          </Chip>
        );
      case '디자인':
        return (
          <Chip chipColor="design" variant="outlined" radius={4} className="mr-2">
            {probs.name}
          </Chip>
        );
      case '기획':
        return (
          <Chip chipColor="plan" variant="outlined" radius={4} className="mr-2">
            {probs.name}
          </Chip>
        );
      default:
        return (
          <Chip chipColor="engineering" variant="outlined" radius={4} className="mr-2">
            {probs.name}
          </Chip>
        );
    }
  }

  function SkillLevelPage(probs) {
    switch (probs.name) {
      default:
        return (
          <Chip chipColor="primary" variant="filled" radius={4} className="mr-2 mt-1">
            {probs.name} 레벨
          </Chip>
        );
    }
  }

  function SkillTearPage(probs) {
    switch (probs.name) {
      case 1:
        return <img src="/assets/images/skill/falling2.png" alt="이미지" />;
      case 2:
        return <img src="/assets/images/skill/falling1.png" alt="이미지" />;
      case 3:
        return <img src="/assets/images/skill/unchange.png" alt="이미지" />;
      case 4:
        return <img src="/assets/images/skill/rasing1.png" alt="이미지" />;
      case 5:
        return <img src="/assets/images/skill/rasing2.png" alt="이미지" />;
      default:
        return <img src="/assets/images/skill/unchange.png" alt="이미지" />;
    }
  }

  const onSuccess = useCallback(data => {
    if (Object.keys(data[0])[0] == 'skillId') {
      data.forEach(obj => renameKey(obj, 'skillId', 'id', '스킬'));
      data.forEach(obj => renameKey(obj, 'skillName', 'name', ''));
    } else {
      data.forEach(obj => renameKey(obj, 'experienceId', 'id', '경험'));
      data.forEach(obj => renameKey(obj, 'experienceName', 'name', ''));
    }
    const updatedJson = JSON.stringify(data);
    mergeData.push(...data);
    data.forEach(function (value, index, array) {
      tmpTab.push(value.categoryName);
    });

    let tmpMergeData = new Set(mergeData);
    let tmpSet = new Set(tmpTab);

    setTabs([...tmpSet]);
    setDatas([...tmpMergeData]);
    setAlldata([...tmpMergeData]);
  }, []);

  const onError = useCallback(err => {
    console.log('Error', err);
  }, []);

  const { isLoading: skillLoading, data: skillData } = useSkills(onSuccess, onError);
  const { isLoading: experienceLoading, data: experienceData } = useExperiences(onSuccess, onError);

  const handleTabAll = () => {
    setActiveTab('ALL');
  };

  // data 를 더 fetch 해야 할 경우 사용되는 함수.
  // setHasMore 초기값이 flase 이기 때문에 불리지 않는다.
  const fetchMoreData = () => {
    if (datas.length >= 500) {
      setHasMore(false);
      return;
    }

    setTimeout(() => {
      setDatas([...datas.concat(Array.from({ length: 20 }))]);
    }, 500);
  };

  const getCurrentList = () => {
    const tmpArray = [];
    allData.forEach(function (value, index, array) {
      if (value.categoryName === activeTab) {
        tmpArray.push(value);
      }
    });
    return [...tmpArray];
  };

  useEffect(() => {
    setDatas(filterNodes([], [], getCurrentList()));
  }, [activeTab]);

  const filterOptionsType = items => {
    const arr = [];
    items.map(item => {
      arr.push(...item.relatedLevels);
    });

    const options2 = arr.map(item => {
      return { label: item + ' 레벨', value: item };
    });

    return options2.filter((option, index) => {
      return (
        options2.findIndex(i => {
          return option.value === i.value;
        }) === index
      );
    });
  };

  const filterOptionsCategoryName = items => {
    const arr = [];
    items.map(item => {
      arr.push(...item.relatedJobGroupNames);
    });

    const options2 = arr.map(item => {
      return { label: item, value: item };
    });

    return options2.filter((option, index) => {
      return (
        options2.findIndex(i => {
          return option.value === i.value;
        }) === index
      );
    });
  };

  const filterNodes = (selected1, selectedGroup1, nodes) => {
    const group = nodes?.filter(node => {
      let jobGroupArr = [];
      filterOptionsCategoryName(allData).map(node => {
        jobGroupArr.push(node.label);
      });
      let difference = jobGroupArr.filter(x => !selected1.includes(x));
      if (selected1.length == 0) {
        return node;
      } else {
        return difference.some(el => node.relatedJobGroupNames.includes(el));
      }
    });

    const group1 = nodes?.filter(node => {
      let jobLevelArr = [];
      filterOptionsType(allData).map(node => {
        jobLevelArr.push(node.value);
      });

      let difference = jobLevelArr.filter(x => !selectedGroup1.includes(x));
      if (selectedGroup1.length == 0) {
        return node;
      } else {
        return difference.some(el => node.relatedLevels.includes(el));
      }
    });
    return group.filter(it => group1.includes(it));
  };
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue([]);
    setValueLevel([]);
    setTabIndex(newValue);
  };

  const cx = classNames.bind(styles);
  const classes = useStyles();
  const boxWidth = 95;
  return (
    <div>
      {experienceLoading ? (
        <div className={styles.Center}>Loading...</div>
      ) : (
        <div className={styles.TabsSkill}>
          <div className={cx('seminar-container')}>
            <div className={cx('container')}>
              <article>
                <div className={cx('filter-area', 'top-filter', 'pt-3')}>
                  <div className={cx('seminar-button__group')}>
                    <Typography type="B1" bold>
                      직군
                    </Typography>
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

                    {filterOptionsCategoryName(allData).map(item => {
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
                    <Typography type="B1" bold>
                      레벨
                    </Typography>
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

                    {filterOptionsType(allData).map(item => {
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
          <Divider sx={{ mt: 2, mb: 4, bgcolor: 'secondary.gray' }} component="div" />

          <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <Tabs className={classes.tabs} value={tabIndex} onChange={handleChange} centered>
              {/* <Tab label="ALL" onClick={handleTabAll} /> */}
              <Tab label="스킬" onClick={() => setActiveTab('스킬')} />;
              <Tab label="경험" onClick={() => setActiveTab('경험')} />;
            </Tabs>
            <div className="mt-5" />
          </Box>
          <InfiniteScroll
            dataLength={datas.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={<div style={{ textAlign: 'center' }}>{/* <b>Yay! You have seen it all</b> */}</div>}
          >
            {datas.map((value, index) => {
              if (value?.categoryName == activeTab) {
                return (
                  <List key={value.id} sx={{ padding: 0, width: '100%', bgcolor: 'background.paper' }}>
                    <ListItem alignItems="center">
                      <ListItemAvatar sx={{ width: '8%' }}>
                        <Avatar
                          variant="rounded"
                          sx={{ width: 50, height: 50 }}
                          alt="Remy Sharp"
                          src={`${process.env['NEXT_PUBLIC_GENERAL_IMAGE_URL']}/images/${value?.imageUrl}`}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        sx={{ width: '25%' }}
                        primary={<div style={{ color: 'black', fontWeight: '600' }}>{value.name}</div>}
                      />
                      <ListItemText
                        sx={{ width: '8%' }}
                        primary={
                          <React.Fragment>
                            <SkillTearPage key={index} name={value.trendLevel}></SkillTearPage>
                          </React.Fragment>
                        }
                      />
                      <ListItemText
                        sx={{ width: '68%', marginRight: '20px' }}
                        // primary={value.description}
                        secondary={<React.Fragment>{value.description}</React.Fragment>}
                      />

                      <ListItemText
                        sx={{ width: '25%' }}
                        primary={
                          <React.Fragment>
                            {value.relatedJobGroupNames.map((item, index) => {
                              return <SkillSelectPage key={index} name={item}></SkillSelectPage>;
                            })}
                          </React.Fragment>
                        }
                        secondary={
                          <React.Fragment>
                            {value.relatedLevels.map((item, index) => {
                              return <SkillLevelPage key={index} name={item}></SkillLevelPage>;
                            })}
                          </React.Fragment>
                        }
                      />
                    </ListItem>

                    <Divider component="li" />
                  </List>
                );
              }
            })}
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
}
