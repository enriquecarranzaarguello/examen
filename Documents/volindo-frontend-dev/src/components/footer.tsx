import styles from '@styles/footer.module.scss';

export const Footer = () => {
  return (
    <>
      <footer className="footer-container my-[20px] z-10">
        <div className="w-full flex justify-center items-center">
          <span className="text-center text-white/[.55] text-xs my-2">
            {process.env.WHITELABELNAME} © - All rights reserved
          </span>
        </div>
      </footer>
    </>
  );
};

export default Footer;
