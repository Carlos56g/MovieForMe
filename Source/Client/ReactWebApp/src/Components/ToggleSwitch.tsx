import "./ToggleSwitch.css";

interface ToggleSwitchProps {
    label: string;
    checked: boolean;
    onChange: () => void;
    disabled?: boolean;
  }
  
  const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, checked, onChange, disabled = false }) => {
    return (
      <div className={`checkBoxDiv ${disabled ? "disableInput" : "enabledInput"}`}>
        <label className='switch'>
          {label}
          <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
          />
          <span className='slider'></span>
        </label>
      </div>
    );
  };
  
  export default ToggleSwitch;
  