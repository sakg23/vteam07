import { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/css/login.css"; // adjust path if needed

interface Props {
  onSubmit: (values: { name: string; email: string; password: string; phone: string }) => void;
}

const RegisterForm = ({ onSubmit }: Props) => {
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formValues.name) newErrors.name = "Name is required";
    if (!formValues.email) newErrors.email = "Email is required";
    if (!formValues.password) newErrors.password = "Password is required";
    if (!formValues.phone) newErrors.phone = "Phone is required";
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
    <div className="login-wrapper">
      <div className="login-form-container">
        <div className="login-form-title">Register new account</div>
        <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formValues.name}
              onChange={handleChange}
            />
            {errors.name && (
              <small className="text-danger">{errors.name}</small>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
            />
            {errors.email && (
              <small className="text-danger">{errors.email}</small>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              password
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
          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              phone
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
          <button type="submit">Register</button>
        </form>
        <Link to="/login" className="register-link">
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
