interface NumberInputProps {
    label: string;
    value: number;
    onChange: (value: string) => void;
    suffix?: string;
    step?: number;
    min?: number;
    max?: number;
    slider?: boolean;
}

export function NumberInput({
    label,
    value,
    onChange,
    suffix,
    step = 1,
    min = 0,
    max,
    slider = false
}: NumberInputProps) {
    return (
        <label className="number-input-label">
            <div className="label-row">
                <span>{label}</span>
            </div>

            <div className="input-wrapper">
                <input
                    type="number"
                    value={value === 0 ? '' : value}
                    onChange={(e) => onChange(e.target.value)}
                    step={step}
                    min={min}
                    className="number-field"
                />
                {suffix && <span className="input-suffix">{suffix}</span>}
            </div>

            {slider && (
                <input
                    type="range"
                    min={min}
                    max={max || value * 2} // Default max if not provided
                    step={step}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="range-slider"
                />
            )}
        </label>
    );
}
