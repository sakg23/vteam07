import { useNavigate } from "react-router-dom";

interface Props {
  page: string;
  text: string;
}

const AddButton = ({ page, text }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/${page}`);
  };

  return (
    <button
      type="button"
      className="btn btn-success"
      onClick={handleClick}
      style={{ padding: "10px", margin: "5px" }}
    >
      Add {text}
    </button>
  );
};

export default AddButton;
