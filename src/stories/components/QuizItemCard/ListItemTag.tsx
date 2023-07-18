interface Props {
  index?: number;
  hashtag: string;
  sizeClass?: string;
  backgroundClass?: string;
  fontClass?: string;
  marginClass?: string;
  fontSize?: string | number;
}

const ListItemtag = ({
  index,
  hashtag,
  sizeClass = 'h-5',
  backgroundClass = 'bg-blue-300',
  fontClass = 'text-blue-600',
  marginClass = '',
  fontSize = '7px',
}: Props) => {
  return (
    <div className={`${backgroundClass} ${sizeClass} ${marginClass} flex justify-center items-center pl-1`}>
      <span
        key={index}
        className={`${fontClass} text-center font-semibold`}
        style={{
          fontSize: fontSize,
        }}
      >
        {hashtag} &nbsp;
      </span>
    </div>
  );
};

export default ListItemtag;
