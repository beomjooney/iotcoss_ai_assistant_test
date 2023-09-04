import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

interface BoardListItemType {
  id: number;
  name: string;
  boardType?: string;
  status: 'ACTIVE' | 'DEACTIVATED';
  layoutType: 'LIST' | 'IMAGE_TEXT' | 'IMAGE';
  enableHashtag: boolean;
  enableReply: boolean;
  index: number;
  articleCnt?: number;
}

export default function SecondTabs({ tabs }: { tabs: BoardListItemType[]; setArticleParams?: any }) {
  // const params = new URLSearchParams(location.search);

  // const boardId = Number(params.get('boardId')) ?? 0;

  //   useEffect(() => {
  //     const tabElements = document.getElementsByClassName('MuiTab-root');

  //     for (var i = 0; i < tabElements.length; i++) {
  //       tabElements[i].classList.add('dark:text-neutral-200');
  //       if (i < tabElements.length - 1) {
  //         const span = tabElements[i].getElementsByTagName('span');

  //         for (var j = 0; j < span.length; j++) {
  //           span[j].style.borderRightWidth = '1px';
  //           span[j].style.height = '20px';
  //           span[j].style.top = '15px';
  //           span[j].style.borderRightColor = '#6D6D6D';
  //         }
  //       }
  //     }
  //   });

  return (
    <TabContext value="test">
      {/* original display : flex justify-between items-center */}
      <Box
        className="px-0 mt-0"
        // sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <TabList
          //   className="border-b"
          variant="scrollable"
          onChange={handleChange}
          aria-label="lab API tabs example"
          TabIndicatorProps={{
            style: {
              color: '#2D94DE',
              backgroundColor: '#2D94DE',
              height: 3,
            },
          }}
        >
          {tabs?.map(tab => {
            return (
              <Tab
                // id="tab"
                label={tab.name}
                value={tab.id.toString()}
                key={tab.id}
                className="tw-text-black tw-font-bold tw-text-base"
              />
            );
          })}
        </TabList>
        {/* <div className="w-full flex justify-end pr-3 mb-2"> */}
        {/* <CustomFilterListBox /> */}
        {/* </div> */}
      </Box>
    </TabContext>
  );
}
