import { HTMLAttributeAnchorTarget } from 'react';
import styles from './InfoCard.module.scss';
import Image, { StaticImageData } from 'next/image';

interface InfoCardProps {
  /**
   * The title of the card
   */
  title: string;
  /**
   * The information of the card
   */
  information: string;
  /**
   * Data to display a link of the card *(Optional)*
   */
  link?: {
    href: string;
    text: string;
    target?: HTMLAttributeAnchorTarget;
  };
  /**
   * The image of the card *(Optional)*
   */
  image?: string | StaticImageData;
  /**
   * CSS classes to be applied to the card *(Optional)*
   */
  className?: string;
}

/**
 * Dark Card component that can display a title, information and a link accompanied with an image.
 */
const InfoCard = ({
  title,
  information,
  link,
  className = '',
  image,
}: InfoCardProps) => {
  return (
    <div className={`${styles.infoCard} ${className}`}>
      <div className={styles.infoCard_container}>
        {image && (
          <div className={styles.infoCard_image}>
            <Image src={image} alt="InfoCard Image" />
          </div>
        )}
        <div className={styles.infoCard_content}>
          <span className={styles.infoCard_content_title}>{title}</span>
          <p className={styles.infoCard_content_description}>{information}</p>
          {link && (
            <a
              className={styles.infoCard_content_link}
              href={link.href}
              target={link.target}
            >
              {link.text}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
