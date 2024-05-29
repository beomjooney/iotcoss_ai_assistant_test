import { axiosGeneralAPI } from '../index';

// 이미지 업로드
export const postImage = async file => {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await axiosGeneralAPI().post('/api/v1/upload/image', formData, {
    headers: { 'content-type': 'multipart/form-data' },
  });
  return data?.imageUrl;
};
