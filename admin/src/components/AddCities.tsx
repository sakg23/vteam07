import { useState } from "react";
interface Props {
  onSubmit: (values: { name: string; region: string }) => void;
}
const AddCities = ({ onSubmit }: Props) => {
  const [formValues, setFormValues] = useState({
    name: "",
    region: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formValues.name) newErrors.name = "Name is required";
    if (!formValues.region) newErrors.region = "Region is required";

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});
    onSubmit(formValues);
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          City name
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          value={formValues.name}
          onChange={handleChange}
        />
        {errors.name && <small className="text-danger">{errors.name}</small>}
      </div>
      <div className="mb-3">
        <label htmlFor="region" className="form-label">
          Region
        </label>
        <input
          type="text"
          className="form-control"
          id="region"
          name="region"
          value={formValues.region}
          onChange={handleChange}
        />
        {errors.region && (
          <small className="text-danger">{errors.region}</small>
        )}
      </div>

      <button type="submit" className="btn btn-primary">
        Add
      </button>
    </form>
  );
};

export default AddCities;