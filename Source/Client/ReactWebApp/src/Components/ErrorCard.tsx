import type { AxiosError } from "axios";
import type { APIError } from "../Types";
import "./ErrorCard.css";

interface ErrorCardProps {
  error: AxiosError<APIError> | null;
  show: boolean;
}

const ErrorCard: React.FC<ErrorCardProps> = ({ error, show }) => {
  if (!error) return null;

  return (
    <div className={`errorCard ${show ? "show" : ""}`}>
      <p>{error.code}</p>
      <p>{error.response?.data?.detail || "An unknown error occurred"}</p>
    </div>
  );
};

export default ErrorCard;