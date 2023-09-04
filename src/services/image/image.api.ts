import { axiosGeneralAPI } from '../index';

// 이미지 업로드
export const postImage = async file => {
  console.log('image', file);
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await axiosGeneralAPI().post('/upload/images', formData, {
    headers: { 'content-type': 'multipart/form-data' },
  });

  console.log(data);

  return data?.imageKey;
};
