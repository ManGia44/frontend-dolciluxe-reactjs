import {response} from '~/services/axios'

export const generateImage = async (promt, instance) => {
  try {
    const res = await instance.post(
      '/api/protected/generate-image',
      { message: promt },
      {
        // headers: { Authorization: `Bearer ${token}` },
      },
    );
    return res;
  } catch (err) {
    if (err.response) console.error('Server err: ', err.response.message, err.response.status);
    else console.error('Request err: ', err.message);
  }
};

export const editImage = async (imageData, instance) => { 
  try {
    const res = await response.post(
      '/api/protected/edit-image',
      imageData,
      {
        // headers: { Authorization: `Bearer ${token}` },
      },
    );
    return res;
  } catch (err) {
    if (err.response) console.error('Server err: ', err.response.message, err.response.status);
    else console.error('Request err: ', err.message);
  }
};

export const generateImage_admin = async (promt, instance) => {
  try {
    const res = await instance.post(
      '/api/protected/generate-image-admin',
      { message: promt },
      {
        // headers: { Authorization: `Bearer ${token}` },
      },
    );
    return res;
  } catch (err) {
    if (err.response) console.error('Server err: ', err.response.message, err.response.status);
    else console.error('Request err: ', err.message);
  }
};

export const uploadcloudinary = async (imageUrlString, instance) => {
  try {
    const res = await instance.post(
      '/api/protected/cloudinary', null,
      {
        params: { imageUrl: imageUrlString },
        // headers: {
        //   'Authorization': `Bearer ${token}`,
        // },
      },
    );
    console.log(res);
  } catch (err) {
    if (err.response) console.error('Server err: ', err.response.message, err.response.status);
    else console.error('Request err: ', err.message);
  }
};
