import Image from 'next/image';
import styles from '@styles/marketing-course.module.scss';
import { useTranslation } from 'react-i18next';
import config from '@config';

const RenderPoint = () => {
  return (
    <div className={styles.pointsLayout}>
      <div className={styles.bgPoints}>
        <div className={styles.points}></div>
      </div>
    </div>
  );
};

const MarketingCard = ({
  data,
  cardNumber,
  imagePosition,
}: {
  data: any;
  cardNumber: number;
  imagePosition: string;
}) => {
  const { t, i18n } = useTranslation();
  const title = data.card[0];
  const content = data.card.slice(1);
  const image = data.image.src;
  const companyName = config.WHITELABELNAME;

  switch (cardNumber) {
    case 1:
      return (
        <div className={styles.card}>
          <h3 className={styles.title}>
            {i18n.t(`marketing.course.${title}`, {
              COMPANYNAME: companyName,
            })}
          </h3>
          <div className={styles.layout}>
            <div className="w-full h-auto flex flex-col gap-5 items-center justify-center text-white">
              {content.map((point: string, index: number) => (
                <div
                  key={index}
                  className="flex flex-row gap-5 items-center justify-center w-full h-auto"
                >
                  <RenderPoint />
                  <p
                    key={index}
                    className="w-full font-[510] leading-7 md:text-[18px]"
                  >
                    {i18n.t(`marketing.course.${point}`, {
                      COMPANYNAME: companyName,
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {imagePosition === 'bottomEnd' && (
            <div className={styles.image}>
              <Image
                src={image}
                alt="Whats app course"
                width={50}
                height={50}
                className="w-[100px] h-auto"
              />
            </div>
          )}
          {imagePosition === 'middleRight' && (
            <div className="absolute top-1/2 -translate-y-1/2 right-0 z-0">
              <Image
                src={image}
                alt="Whats app course"
                width={50}
                height={50}
                className="w-[180px] h-auto"
              />
            </div>
          )}
          {imagePosition === 'middleLeft' && (
            <div className="absolute top-1/2 -translate-y-1/2 left-0 z-0">
              <Image
                src={image}
                alt="Whats app course"
                width={50}
                height={50}
                className="w-[180px] h-auto"
              />
            </div>
          )}
        </div>
      );
    case 2:
      return (
        <div className="bg-[#191919] rounded-xl p-8 w-full relative col-span-1 md:col-span-2">
          <h3 className="font-bold text-[20px] text-white leading-9 mb-5">
            {i18n.t(`marketing.course.${title}`, {
              COMPANYNAME: companyName,
            })}
          </h3>
          <div className={styles.layout}>
            <div className="w-full h-auto flex flex-col gap-5 items-center justify-center text-white">
              {content.map((point: string, index: number) => (
                <div
                  key={index}
                  className="flex flex-row gap-5 items-center justify-center w-full"
                >
                  <RenderPoint />
                  <p
                    key={index}
                    className="w-full font-[510] text-[18px] leading-7"
                  >
                    {t(`marketing.course.${point}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-0 right-0 mr-4 mb-4 z-0">
            <Image
              src={image}
              alt="Whats app course"
              width={50}
              height={50}
              className="w-[150px] h-auto"
            />
          </div>
        </div>
      );
    case 3:
      return (
        <div className="bg-[#191919] rounded-xl p-8 w-full relative col-span-1 md:col-span-2 flex flex-row-reverse">
          <div className="w-full md:w-1/2 flex flex-col items-start justify-center">
            <h3 className="font-bold text-[24px] text-white leading-9 mb-5">
              {i18n.t(`marketing.course.${title}`, {
                COMPANYNAME: companyName,
              })}
            </h3>
            <div className={styles.layout}>
              <div className="w-full h-auto flex flex-col gap-5 text-start items-start justify-center text-white">
                {content.map((point: string, index: number) => (
                  <div
                    key={index}
                    className="flex flex-row gap-5 items-center justify-center w-full"
                  >
                    <RenderPoint />
                    <p
                      key={index}
                      className="w-full font-[510] text-[18px] leading-7"
                    >
                      {t(`marketing.course.${point}`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:w-1/2 md:flex flex-row items-center justify-center">
            <Image
              src={image}
              alt="Whats app course"
              width={50}
              height={50}
              className="w-[200px] h-auto"
            />
          </div>
          {imagePosition === 'bottomEnd' && (
            <div className="md:hidden absolute bottom-0 right-0 mr-4 mb-4 z-0">
              <Image
                src={image}
                alt="Whats app course"
                width={50}
                height={50}
                className="w-[100px] h-auto"
              />
            </div>
          )}
        </div>
      );
    case 4:
      return (
        <div className="bg-[#191919] h-fit flex flex-row items-center justify-center rounded-xl p-8 w-full relative col-span-1 md:col-span-2">
          <h3 className="font-bold text-[20px] text-white leading-9">
            {i18n.t(`marketing.course.${title}`, {
              COMPANYNAME: companyName,
            })}
          </h3>
        </div>
      );
    default:
      return <></>;
  }
};

export default MarketingCard;
