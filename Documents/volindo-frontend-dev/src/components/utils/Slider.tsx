import {
  InputHTMLAttributes,
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

const Slider = (
  props: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'ref' | 'min' | 'max' | 'onChange'
  > & {
    min: number;
    max: number;
    colorProgress: string;
    colorTrack: string;
    labelTooltip?: string;
    classNameWrapper?: string;
    classNameTooltip?: string;
    value?: number;
    onChange?: (value: number) => void;
  }
) => {
  const {
    min,
    max,
    colorProgress,
    colorTrack,
    labelTooltip = '',
    className = '',
    classNameWrapper = '',
    classNameTooltip = '',
    value = min,
    onChange,
    ...rest
  } = props;
  const refSlider = useRef<HTMLInputElement>(null);
  const refTooltip = useRef<HTMLDivElement>(null);
  const refWrapper = useRef<HTMLDivElement>(null);
  const [currentValue, setCurrentValue] = useState(value);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const valueOnSlider = parseInt(e.target.value);
    setCurrentValue(valueOnSlider);
    if (onChange) {
      onChange(valueOnSlider);
    }
  };

  useEffect(() => {
    if (refSlider.current && refTooltip.current && refWrapper.current) {
      const progress = ((currentValue - min) / (max - min)) * 100;

      const wrapperWidth = refWrapper.current.offsetWidth;
      const tooltipWidth = refTooltip.current.offsetWidth;
      const offset = (progress * tooltipWidth) / 100;
      const offsetPercentage = (offset * 100) / wrapperWidth;
      //Progress bar update
      refSlider.current.style.background = `linear-gradient(to right, ${colorProgress} ${progress}%, ${colorTrack} ${progress}%)`;
      //Tooltip translation
      refTooltip.current.style.left = `${progress - offsetPercentage}%`;
    }
  }, [colorProgress, colorTrack, currentValue, max, min]);

  useEffect(() => {
    if (value < min) {
      setCurrentValue(min);
    } else if (value > max) {
      setCurrentValue(max);
    } else {
      setCurrentValue(value || min);
    }
  }, [value, min, max]);

  return (
    <div
      className={`customSlider__wrapper ${classNameWrapper}`}
      ref={refWrapper}
    >
      <div
        className={`customSlider__tooltip ${classNameTooltip}`}
        ref={refTooltip}
      >
        {labelTooltip}
        {currentValue}
      </div>
      <input
        ref={refSlider}
        className={`customSlider ${className}`}
        type="range"
        value={currentValue}
        min={min}
        max={max}
        onChange={handleChange}
        {...rest}
      />
    </div>
  );
};

export default Slider;
