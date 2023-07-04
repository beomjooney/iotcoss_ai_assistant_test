import styles from './index.module.scss';
import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { NodeCard, Textfield, Typography } from '../index';
import { TextareaAutosize } from '@mui/base';
import GrowthStoryCard from '../GrowthStoryCard';
import { useForm } from 'react-hook-form';

export interface ResumeStoryProps {
  title?: string;
  titleValue?: string;
  jobStoryList?: any[];
  handleAddClick?: (chapterNo: number) => void;
  removeButton?: (chapterNo: number, index: number) => void;
  isCloseButton?: boolean;
  chapterNo: number;
  onChangeValue?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, chapterNo: number) => void;
  description?: string;
  isView?: boolean;
  startedAtDate?: string;
  finishedAtDate?: string;
  period?: string;
  isEdit?: any;
  startedAtYear?: any;
  startedAtMonth?: any;
  finishedAtYear?: any;
  finishedAtMonth?: any;
}

const cx = classNames.bind(styles);

function ResumeStory({
  title,
  titleValue,
  jobStoryList,
  handleAddClick,
  removeButton,
  isCloseButton = true,
  chapterNo,
  onChangeValue,
  description,
  isView = false,
  isEdit = false,
  startedAtDate,
  finishedAtDate,
  period,
  startedAtYear,
  startedAtMonth,
  finishedAtYear,
  finishedAtMonth,
}: ResumeStoryProps) {
  const [isDate, setIsDate] = useState<boolean>(isEdit);
  const [isDateFocus, setDateIsFocus] = useState<boolean>(false);

  const {
    register,
    getValues,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  return (
    <div className={cx('resume-story')}>
      <div className={cx('resume-story__title')}>
        <Typography type="B1" tag="div" weight="bold" extendClass={cx('title-gap')}>
          {title}
        </Typography>
        {isView ? (
          titleValue
        ) : (
          <Textfield
            placeholder="제목을 입력해 주세요."
            name="title"
            onChange={event => onChangeValue(event, chapterNo)}
            width={160}
            defaultValue={(isEdit && titleValue) || ''}
          />
        )}
      </div>
      <div className={cx(`resume-story__${isView ? 'job--group' : 'write--group'}`)}>
        <div className={cx('job-content', 'text-left')}>
          {isView ? (
            description
          ) : (
            <>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={5}
                placeholder="멘토님의 빛나는 도전과 멋진 경험을 3줄의 문장으로 압축하여 소개해주세요."
                style={{
                  width: 160,
                  // height: 87,
                  height: 120,
                  // borderBottom: 0,
                  borderRadius: '5px',
                  padding: 12,
                  resize: 'none',
                  fontSize: 12,
                }}
                className={cx('line-gray')}
                name="description"
                onChange={event => onChangeValue(event, chapterNo)}
                defaultValue={(isEdit && description) || ''}
              />
            </>
          )}
        </div>
        <div className={cx(startedAtDate && finishedAtDate ? 'job-content' : 'job-content-date')}>
          {startedAtDate && finishedAtDate ? (
            <>
              {startedAtDate} ~ {finishedAtDate}
              <hr />
              {period}
            </>
          ) : (
            <>
              {isDate ? (
                <div
                  className={cx('job-date-content', isDateFocus ? 'line-primary' : 'line-gray')}
                  style={{
                    width: 160,
                    height: 120,
                    // borderBottom: 0,
                    borderRadius: '5px',
                    // padding: 12,
                    resize: 'none',
                    fontSize: 12,
                  }}
                  onBlur={() => setDateIsFocus(false)}
                  onClick={() => setDateIsFocus(true)}
                  // ref={textInputRef}
                >
                  <div className={cx('job-date')}>
                    <div className={cx('date-group')}>
                      <Textfield
                        maxLength={4}
                        isUnderline
                        required
                        name="startedAtYear"
                        isTextCenter={true}
                        defaultValue={(isEdit && String(startedAtYear)) || ''}
                        {...register('startedAtYear', {
                          required: true,
                          minLength: {
                            value: 4,
                            message: '년도 4자리를 입력해 주세요.',
                          },
                          pattern: {
                            value: /^(19|20)\d{2}$/,
                            message: '올바른 시작 년도를 입력해 주세요.',
                          },
                          onChange: event => onChangeValue(event, chapterNo),
                        })}
                      />
                      년
                    </div>
                    <div className={cx('date-group')}>
                      <Textfield
                        maxLength={2}
                        isUnderline
                        required
                        name="startedAtMonth"
                        isTextCenter={true}
                        defaultValue={(isEdit && String(startedAtMonth)) || ''}
                        {...register('startedAtMonth', {
                          required: true,
                          pattern: {
                            value: /^([1-9]|1[012])$/,
                            message: '올바른 시작월을 입력해 주세요.',
                          },
                          onChange: event => onChangeValue(event, chapterNo),
                        })}
                      />
                      월 부터
                    </div>
                  </div>
                  <div className={cx('job-date')}>
                    <div className={cx('date-group')}>
                      <Textfield
                        maxLength={4}
                        isUnderline
                        // required
                        name="finishedAtYear"
                        isTextCenter={true}
                        defaultValue={(isEdit && String(finishedAtYear)) || ''}
                        {...register('finishedAtYear', {
                          required: true,
                          minLength: {
                            value: 4,
                            message: '년도 4자리를 입력해 주세요.',
                          },
                          pattern: {
                            value: /^(19|20)\d{2}$/,
                            message: '올바른 종료 년도를 입력해 주세요.',
                          },
                          validate: value => {
                            return value >= getValues('startedAtYear') || '시작연도 보다 작을 수 없습니다.';
                          },
                          onChange: event => onChangeValue(event, chapterNo),
                        })}
                      />
                      년
                    </div>
                    <div className={cx('date-group')}>
                      <Textfield
                        maxLength={2}
                        isUnderline
                        // required
                        name="finishedAtMonth"
                        isTextCenter={true}
                        defaultValue={(isEdit && String(finishedAtMonth)) || ''}
                        {...register('finishedAtMonth', {
                          required: true,
                          pattern: {
                            value: /^([1-9]|1[012])$/,
                            message: '올바른 종료월을 입력해 주세요.',
                          },
                          validate: value => {
                            if (getValues('startedAtYear') === getValues('finishedAtYear')) {
                              if (Number(value) < Number(getValues('startedAtMonth'))) {
                                return '시작월 보다 작을 수 없습니다.';
                              }
                            }
                            return '';
                          },
                          onChange: event => onChangeValue(event, chapterNo),
                        })}
                      />
                      월 까지
                    </div>
                  </div>
                  {errors.startedAtYear && <div style={{ color: 'red' }}>{errors.startedAtYear.message}</div>}
                  {errors.startedAtMonth && <div style={{ color: 'red' }}>{errors.startedAtMonth.message}</div>}
                  {errors.finishedAtYear && <div style={{ color: 'red' }}>{errors.finishedAtYear.message}</div>}
                  {errors.finishedAtMonth && <div style={{ color: 'red' }}>{errors.finishedAtMonth.message}</div>}
                  {!errors.startedAtYear &&
                    !errors.startedAtMonth &&
                    !errors.finishedAtYear &&
                    !errors.finishedAtMonth &&
                    period && <div className={cx('job-result-date')}>{period}</div>}
                </div>
              ) : (
                <TextareaAutosize
                  aria-label="minimum height"
                  minRows={5}
                  placeholder="도전 기간을 입력해주세요. 연도와 월만 입력하시면, 기간은 자동 산출 됩니다."
                  style={{
                    width: 160,
                    // height: 87,
                    height: 120,
                    // borderBottom: 0,
                    borderRadius: '5px',
                    padding: 12,
                    resize: 'none',
                    fontSize: 12,
                  }}
                  // disabled={true}
                  className={cx('line-gray')}
                  name="description"
                  onClick={() => setIsDate(true)}
                />
              )}
            </>
          )}
          {/*<TextareaAutosize*/}
          {/*  aria-label="minimum height"*/}
          {/*  minRows={5}*/}
          {/*  placeholder="도전 기간을 입력해주세요. 예) 202210"*/}
          {/*  style={{*/}
          {/*    width: 160,*/}
          {/*    height: 87,*/}
          {/*    border: '1px solid #B0B7C1',*/}
          {/*    borderBottom: 0,*/}
          {/*    borderRadius: '5px 5px 0 0',*/}
          {/*    padding: 12,*/}
          {/*    resize: 'none',*/}
          {/*    fontSize: 12,*/}
          {/*  }}*/}
          {/*  name="date"*/}
          {/*/>*/}
          {/*<Button type="button" color="lite-gray" className={cx('button-radius')}>*/}
          {/*  저장하기*/}
          {/*</Button>*/}
        </div>
        {jobStoryList?.map((item, index) => {
          return (
            <div className={cx('job-node')} key={`jobs-${index}`}>
              <div className={cx('job-info-none__border')}>
                <NodeCard
                  index={index}
                  title={`레벨 ${item.level}`}
                  content={item.description}
                  jobCode={isView || isEdit ? item.nodeJobGroup : item.jobGroup}
                  size="large"
                  isCloseButton={isCloseButton}
                  removeButton={removeButton}
                  chapterNo={chapterNo}
                />
              </div>
            </div>
          );
        })}
        {!isView && (
          <div className={cx('job-node', 'job-info__border')}>
            <GrowthStoryCard message="수행 직무/레벨 추가" onClick={() => handleAddClick(chapterNo)} />
            {/*<div className={cx('job-info')}>*/}
            {/*  <GrowthStoryCard message="수행 직무/레벨 추가" onClick={() => handleAddClick(chapterNo)} />*/}
            {/*</div>*/}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(ResumeStory);
