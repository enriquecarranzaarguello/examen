import { TextareaHTMLAttributes, useRef } from 'react';

const TextArea = (
  props: Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'ref' | 'onInput'>
) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleResize = () => {
    if (ref.current) {
      ref.current.style.height = '';
      ref.current.style.height = ref.current.scrollHeight + 'px';
    }
  };

  return <textarea {...props} ref={ref} onInput={handleResize} />;
};

export default TextArea;
