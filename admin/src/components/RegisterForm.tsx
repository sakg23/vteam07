import { useState } from "react";

interface Props {
  onSubmit: (values: { name: string; email: string; password: string, phone:string }) => void;
}

const RegisterForm = ({ onSubmit }: Props) => {
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    phone:""
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formValues.name) newErrors.name = "Name is required";
    if (!formValues.email) newErrors.email = "Email is required";
    if (!formValues.password) newErrors.password = "Password is required";
    if (!formValues.phone) newErrors.phone = "phone is required";

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
    onSubmit(formValues); // Anropa `onSubmit` med formvÃ¤rdena
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Name
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
        <label htmlFor="email" className="form-label">
          Email address
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          value={formValues.email}
          onChange={handleChange}
        />
        {errors.email && <small className="text-danger">{errors.email}</small>}
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          id="password"
          name="password"
          value={formValues.password}
          onChange={handleChange}
        />
        {errors.password && (
          <small className="text-danger">{errors.password}</small>
        )}
      </div>
        <div className="mb-3">
        <label htmlFor="phone" className="form-label">
          Phone
        </label>
        <input
          type="text"
          className="form-control"
          id="phone"
          name="phone"
          value={formValues.phone}
          onChange={handleChange}
        />
        {errors.phone && (
          <small className="text-danger">{errors.phone}</small>
        )}
      </div>
      <button type="submit" className="btn btn-primary">
        Registera
      </button>
    </form>
  );
};

export default RegisterForm;