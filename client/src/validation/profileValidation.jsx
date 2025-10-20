// src/validation/profileValidation.js
import * as Yup from 'yup';

export const profileValidationSchema = Yup.object({
  name: Yup.string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must be less than 50 characters'),
  email: Yup.string()
    .required('Email is required')
    .email('Invalid email address'),
  county: Yup.string()
    .required('County is required'),
  area: Yup.string()
    .required('Area/Constituency is required')
    .min(2, 'Area must be at least 2 characters')
});