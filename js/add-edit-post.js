import postApi from './api/postApi';
import { initPostForm, toast } from './utils';

function removeUnusedFields(formValues) {
  const payload = { ...formValues };
  // imageSource = 'picsum' -->  remove image
  // imageSource = 'upload' -->  remove imageUrl
  if (payload.imageSource === 'upload') {
    delete payload.imageUrl;
  } else {
    delete payload.image;
  }

  // finally remove imageSource
  delete payload.imageSource;

  // remove id if it's add mode
  if (!payload.id) delete payload.id;

  return payload;
}

function jsonToFormData(jsonObject) {
  const formData = new FormData();

  for (const key in jsonObject) {
    formData.set(key, jsonObject[key]);
  }

  return formData;
}

async function handlePostFormSubmit(formValues) {
  // console.log('submit from parent', { formValues, payload });
  try {
    const payload = removeUnusedFields(formValues);
    const formData = jsonToFormData(payload);
    // check add/edit mode
    // S1: based on search params (check id)
    // S2: check id in formValues
    // call API

    // let savePost = null;
    // if (formValues.id) {
    //   savePost = await postApi.update(formValues);
    // } else {
    //   savePost = await postApi.add(formValues);
    // }

    const savePost = formValues.id
      ? await postApi.updateFormData(formData)
      : await postApi.addFormData(formData);

    // show success message
    toast.success('Save post successfully! ');

    // redirect to detail page
    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${savePost.id}`);
    }, 2000);
    console.log('redirect to', savePost.id);
  } catch (error) {
    console.log('failed to save post', error);
    toast.error(`Error ${error.message}`);
  }
}

// MAIN
(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');

    const defaultValues = postId
      ? await postApi.getById(postId)
      : {
          title: '',
          description: '',
          author: '',
          imageUrl: '',
        };

    console.log('id:', postId);
    console.log('mode: ', postId ? 'edit' : 'add');
    console.log('defaultValues: ', defaultValues);

    initPostForm({
      formId: 'postForm',
      defaultValues,
      onSubmit: handlePostFormSubmit,
    });
  } catch (error) {
    console.log('failed to fetch post details: ', error);
  }
})();
