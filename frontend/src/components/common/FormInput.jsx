/**
 * @param {string} type 
 * @param {string} value
 * @param {Function} onChange
 * @param {string} placeholder
 * @param {boolean} disabled
 * @param {string} label
 * @returns {JSX.Element}
 */
function FormInput({ type, value, onChange, placeholder, disabled, label }) {
    return (
        <div className="form-group">
            {label && <div className="form-label">{label}:</div>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required
            />
        </div>
    );
}

export default FormInput; 