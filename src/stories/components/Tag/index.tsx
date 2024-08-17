import { useState, useRef, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close'; // Importing Close icon from MUI
import { InputAdornment, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export interface TagProps {
  /** Tag의 값 */
  value: string[]; // Array of strings
  onChange: (value: string[]) => void;
  placeHolder?: string;
}

function TagRoot(props: TagProps) {
  const { value = [], onChange, placeHolder } = props;
  const [inputValue, setInputValue] = useState<string>(''); // String to store the input value
  const [tags, setTags] = useState([]); // Array to store the tags

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTags(value);
  }, [value]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      const newTags = [...tags, inputValue.trim()]; // Add new tag to the list
      setTags(newTags);
      onChange(newTags); // Notify the parent component
      setInputValue(''); // Clear the input
    }
  };

  const handleAddInput = () => {
    if (inputValue.trim() !== '') {
      const newTags = [...tags, inputValue.trim()]; // Add new tag to the list
      setTags(newTags);
      onChange(newTags); // Notify the parent component
      setInputValue(''); // Clear the input
    }
  };

  const handleDeleteTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    onChange(newTags); // Notify the parent component
  };

  return (
    <div>
      <TextField
        size="small"
        fullWidth
        onChange={handleInputChange}
        placeholder={placeHolder}
        onKeyPress={handleKeyPress}
        value={inputValue}
        name="studySubject"
        ref={inputRef}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleAddInput}>
                <AddIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <div className="tag-list tw-mt-4 tw-flex tw-flex-wrap tw-gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="tw-flex tw-items-center tw-justify-center tw-gap-1.5 tw-px-2 tw-py-2 tw-rounded tw-bg-[#6a7380] tw-text-xs tw-text-white"
          >
            {tag}
            <CloseIcon
              className="delete-icon"
              onClick={() => handleDeleteTag(index)}
              style={{ cursor: 'pointer', color: 'white', fontSize: '14px' }} // Custom styling for the icon
            />
          </span>
        ))}
      </div>
    </div>
  );
}

export default TagRoot;
