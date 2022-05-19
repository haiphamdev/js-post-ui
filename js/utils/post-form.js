import { randomNumber, setBackgroundImage, setFieldValue, setTextContent } from './common';
import * as yup from 'yup';

function setFormValues(form, formValues) {
  setFieldValue(form, '[name="title"]', formValues?.title);
  setFieldValue(form, '[name="author"]', formValues?.author);
  setFieldValue(form, '[name="description"]', formValues?.description);

  setFieldValue(form, '[name="imageUrl"]', formValues?.imageUrl); // hidden field
  setBackgroundImage(document, '#postHeroImage', formValues?.imageUrl);
}

function getFormValues(form) {
  const formValues = {};

  // S1: query each input and add to values object
  // ['title', 'author', 'description', 'imageUrl'].forEach((name) => {
  //   const field = form.querySelector(`[name="${name}"]`);
  //   if (field) formValues[name] = field.value;
  // });

  // S2: using form data
  const data = new FormData(form);
  for (const [key, value] of data) {
    formValues[key] = value;
  }

  return formValues;
}

function getTitleError(form) {
  const titleElement = form.querySelector('[name="title"]');
  if (!titleElement) return;

  // required
  if (titleElement.validity.valueMissing) return 'Please enter title.';

  // at least two words
  if (titleElement.value.split(' ').filter((x) => !!x && x.length >= 3).length < 2)
    return 'Please enter at least two words of 3 characters';

  return '';
}

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title'),
    author: yup
      .string()
      .required('Please enter author')
      .test(
        'at-least-two-words',
        'Please enter at least two words',
        (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
      ),
    description: yup.string(),
    imageUrl: yup
      .string()
      .required('Please random a background image')
      .url('Please enter a valid URL'),
  });
}

function setFieldError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`);
  if (element) {
    element.setCustomValidity(error);
    setTextContent(element.parentElement, '.invalid-feedback', error);
  }
}

async function validatedPostForm(form, formValues) {
  // get errors
  // const errors = {
  //   title: getTitleError(form),
  // };

  // // set errors
  // for (const key in errors) {
  //   const element = form.querySelector(`[name="${key}"]`);
  //   if (element) {
  //     element.setCustomValidity(errors[key]);
  //     setTextContent(element.parentElement, '.invalid-feedback', errors[key]);
  //   }
  // }

  try {
    // reset previous errors
    ['title', 'author', 'imageUrl'].forEach((name) => setFieldError(form, name, ''));

    // start validating
    const schema = getPostSchema();
    await schema.validate(formValues, { abortEarly: false });
  } catch (error) {
    // console.log(error.name);
    // console.log(error.inner);

    const errorLog = {};

    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        const name = validationError.path;

        // ignore if the field is already logged
        if (errorLog[name]) continue;

        // set field error and mark as logged
        setFieldError(form, name, validationError.message);
        errorLog[name] = true;
      }
    }
  }

  // add was-validated class to form element
  const isValid = form.checkValidity();
  if (!isValid) form.classList.add('was-validated');
  return isValid;
}

function showLoading(form) {
  const button = form.querySelector('[name="submit"]');
  if (button) {
    button.disabled = true;
    button.textContent = 'Saving...';
  }
}

function hideLoading(form) {
  const button = form.querySelector('[name="submit"]');
  if (button) {
    button.disabled = false;
    button.textContent = 'Saving';
  }
}

function initRandomImage(form) {
  const randomButton = document.getElementById('postChangeImage');
  if (!randomButton) return;

  randomButton.addEventListener('click', (e) => {
    const imageUrl = `https://picsum.photos/id/${randomNumber(1000)}/1368/400`;

    // set imageUrl input + background
    setFieldValue(form, '[name="imageUrl"]', imageUrl); // hidden field
    setBackgroundImage(document, '#postHeroImage', imageUrl);
  });
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId);
  if (!form) return;

  let submitting = false;
  setFormValues(form, defaultValues);

  // init events
  initRandomImage(form);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Prevent other submission
    if (submitting) return;

    showLoading(form);
    submitting = true;

    // get form values
    const formValues = getFormValues(form);
    formValues.id = defaultValues.id;

    // validation
    // if valid trigger submit callback
    // otherwise, show validation errors
    const isValid = await validatedPostForm(form, formValues);
    if (isValid) await onSubmit?.(formValues);

    // always hide loading no matter from is valid or not
    hideLoading(form);
    submitting = false;
  });
}
