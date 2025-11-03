import "./LoadingDots.css";

interface LoadingDotsProps {
  show: boolean;
}

const LoadingDots: React.FC<LoadingDotsProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

export default LoadingDots;
