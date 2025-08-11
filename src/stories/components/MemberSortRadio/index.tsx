import React from 'react';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

export interface MemberSortRadioProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const sortOptions = [
  { value: '0100', label: '가나다순' },
  { value: '0200', label: '가입최신순' },
  { value: '0201', label: '가입오래된순' },
];

function MemberSortRadio({ value, onChange, className }: MemberSortRadioProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className={`tw-flex tw-items-center tw-gap-2 ${className || ''}`}>
      <span className="tw-text-sm tw-text-gray-600 tw-font-medium">정렬:</span>
      <FormControl component="fieldset">
        <RadioGroup
          row
          aria-label="member-sort"
          name="member-sort"
          value={value}
          onChange={handleChange}
          sx={{
            '& .MuiFormControlLabel-root': {
              marginRight: 1,
              marginLeft: 0,
            },
            '& .MuiRadio-root': {
              padding: '4px 8px',
              '&.Mui-checked': {
                color: '#3b82f6', // blue-500
              },
            },
            '& .MuiFormControlLabel-label': {
              fontSize: '0.875rem', // text-sm
              color: '#6b7280', // gray-500
              fontWeight: 500,
            },
            '& .MuiFormControlLabel-root.Mui-checked .MuiFormControlLabel-label': {
              color: '#1f2937', // gray-800
              fontWeight: 600,
            },
          }}
        >
          {sortOptions.map(option => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio size="small" />}
              label={option.label}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </div>
  );
}

export default MemberSortRadio;
