// src/components/profile/ProfileForm.js
import { useFormik } from 'formik';
import { profileValidationSchema } from '@/validation/profileValidation';
import { kenyanCounties } from '@/data/kenyanCounties';

export function ProfileForm({ initialData, onSave, onCancel, isSubmitting }) {
  const formik = useFormik({
    initialValues: initialData,
    validationSchema: profileValidationSchema,
    onSubmit: async (values) => {
      await onSave(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {/* Full Name */}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">Full Name</label>
        <input
          id="name"
          name="name"
          type="text"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
            formik.touched.name && formik.errors.name 
              ? 'border-destructive' 
              : 'border-input'
          }`}
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.name && formik.errors.name && (
          <div className="text-destructive text-sm">{formik.errors.name}</div>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
            formik.touched.email && formik.errors.email 
              ? 'border-destructive' 
              : 'border-input'
          }`}
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.email && formik.errors.email && (
          <div className="text-destructive text-sm">{formik.errors.email}</div>
        )}
      </div>

      {/* Location Fields */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* County */}
        <div className="space-y-2">
          <label htmlFor="county" className="text-sm font-medium">County</label>
          <select
            id="county"
            name="county"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              formik.touched.county && formik.errors.county 
                ? 'border-destructive' 
                : 'border-input'
            }`}
            value={formik.values.county}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Select a county</option>
            {kenyanCounties.map((county) => (
              <option key={county} value={county}>
                {county}
              </option>
            ))}
          </select>
          {formik.touched.county && formik.errors.county && (
            <div className="text-destructive text-sm">{formik.errors.county}</div>
          )}
        </div>

        {/* Area/Constituency */}
        <div className="space-y-2">
          <label htmlFor="area" className="text-sm font-medium">Area/Constituency</label>
          <input
            id="area"
            name="area"
            type="text"
            placeholder="e.g., Westlands, Kilimani"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
              formik.touched.area && formik.errors.area 
                ? 'border-destructive' 
                : 'border-input'
            }`}
            value={formik.values.area}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.area && formik.errors.area && (
            <div className="text-destructive text-sm">{formik.errors.area}</div>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 border border-input bg-background rounded-lg hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}