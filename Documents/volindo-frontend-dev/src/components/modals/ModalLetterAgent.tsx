import Image from 'next/image';
import IconCloseBlack from '@icons/close-black.svg';
import { useTranslation } from 'react-i18next';
import { Form, Schema, Input } from 'rsuite';
import { useState, forwardRef } from 'react';
import AgentService from '@services/AgentService';

const { StringType } = Schema.Types;

const Textarea = forwardRef<HTMLTextAreaElement>((props, ref) => (
  <Input {...props} as="textarea" ref={ref} rows={4} />
));

const ModalLetterAgent = ({
  open,
  onClose,
  emailAgent,
  launchPopup,
}: {
  open: boolean;
  onClose: () => void;
  emailAgent: string;
  launchPopup: (message: string, type: 'info' | 'loading') => void;
}) => {
  if (!open) return null;

  const { t } = useTranslation();
  //Data states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  //Form Validator state
  const [formError, setFormError] = useState<Record<string, any>>({});

  // Validation model
  const modelValidation = Schema.Model({
    name: StringType()
      .isRequired(t('valid.required') || '')
      .maxLength(100, t('agent.editSections.errors.full_name') || ''),
    phone_number: StringType().isRequired(t('valid.required') || ''),
    email: StringType()
      .isRequired(t('valid.required') || '')
      .isEmail(t('valid.email') || ''),
    message: StringType()
      .isRequired(t('valid.required') || '')
      .maxLength(1000, t('agent.letter.errorMessage') || ''),
  });

  const sendLetter = () => {
    launchPopup(t('agent.letter.sending') || '', 'loading');
    AgentService.sendLetterToAgent(emailAgent, name, email, phone, message)
      .then(res => {
        if (!res.status) {
          launchPopup(t('agent.letter.success') || '', 'info');
        } else {
          launchPopup(t('agent.letter.errorSend') || '', 'info');
          console.error(res);
        }
      })
      .catch(err => {
        launchPopup(t('agent.letter.errorSend') || '', 'info');
        console.error(err);
      });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-[#23262F]/[.8] flex justify-center items-center z-50">
        <div className="relative rounded-[16px] bg-black shadow-[0px_64px_64px_-48px_rgba(15,15,15,0.08)] w-full h-full md:h-fit md:w-fit md:px-8 lg:px-16 text-white">
          <button
            className="absolute  top-0 right-0  md:-top-5 md:-right-6"
            onClick={onClose}
          >
            <Image className=" " alt="icon" src={IconCloseBlack} />
          </button>
          <div className="flex justify-center flex-col items-center h-full overflow-hidden overflow-y-scroll scrollbar-hide">
            <h1 className="font-[760] text-center text-4xl text-white mt-11 mb-7">
              {t('agent.letter.title')}
            </h1>
            <Form
              model={modelValidation}
              onCheck={setFormError}
              style={{ width: '25vw', maxWidth: '22rem', minWidth: '18rem' }}
            >
              <Form.Control
                className={
                  'bg-[#ffffff38] rounded-3xl py-4 px-4 text-white text-base outline-none mb-3'
                }
                style={{ border: 'none', width: '100%' }}
                placeholder={t('agent.letter.name')}
                type="text"
                name="name"
                value={name}
                onChange={v => setName(v)}
                errorMessage={formError.name}
              />
              <Form.Control
                className={
                  'bg-[#ffffff38] rounded-3xl py-4 px-4 text-white text-base outline-none mb-3'
                }
                style={{ border: 'none', width: '100%' }}
                placeholder={t('agent.phone_number')}
                type="number"
                name="phone"
                value={phone}
                onChange={v => setPhone(v)}
                errorMessage={formError.phone}
              />
              <Form.Control
                className={
                  'bg-[#ffffff38] rounded-3xl py-4 px-4 text-white text-base outline-none mb-3'
                }
                style={{ border: 'none', width: '100%' }}
                placeholder={t('agent.email')}
                type="text"
                name="email"
                value={email}
                onChange={v => setEmail(v)}
                errorMessage={formError.email}
              />
              <Form.Control
                className={`bg-[#ffffff38] rounded-3xl py-4 px-4 text-white text-base outline-none w-full`}
                accepter={Textarea}
                placeholder={t('agent.letter.message')}
                name="message"
                value={message}
                onChange={v => setMessage(v)}
                errorMessage={formError.message}
                style={{ width: '100%', border: 'none' }}
              />
              <button
                disabled={
                  !name ||
                  !phone ||
                  !email ||
                  !message ||
                  Object.keys(formError).length != 0
                }
                onClick={sendLetter}
                className={
                  'ttext-white mt-24 mb-11 mx-auto w-full h-[59px] font-[760] flex items-center justify-center rounded-full bg-[var(--primary-background)]'
                }
              >
                {t('common.send')}
              </button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalLetterAgent;
