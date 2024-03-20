import { FC } from 'react';
import Image from 'next/image';
import VolindoLogo from '@icons/logo.svg';
import whitelabellogo from '@icons/whitelabellogo.png';
import ArrowLeft from '@icons/arrow-left-white.svg';
import PostSlider from './PostSlider';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const PostsOnMobile: FC<{
  open: boolean;
  onBack: () => void;
  postsUUIDs: string[];
  agentName?: string;
  agentPhoto?: string;
  clickWantDetails?: () => void;
  privateProfile?: boolean;
  onEditPost?: (_description: string, _country: string, _city: string) => void;
  onDeleteImage?: (_index: number, _deletePost: boolean) => void;
  onActionPostGetUUID?: (_uuid: string) => void;
}> = ({
  open,
  onBack,
  postsUUIDs,
  agentName = '',
  agentPhoto = '',
  clickWantDetails = () => {},
  privateProfile = false,
  onEditPost = () => {},
  onDeleteImage = () => {},
  onActionPostGetUUID = () => {},
}) => {
  const { t } = useTranslation();

  if (!open) return null;
  const logoWhiteLabel =
    window.location.host.includes('dashboard.volindo.com') ||
    window.location.host.includes('dashboard.dev.volindo.com')
      ? VolindoLogo
      : whitelabellogo;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black"></div>
      {/* CONTENT INSIDE DIV RELATIVE */}
      <div className="relative h-full w-full overflow-y-auto scroll-smooth">
        {/* HEADER */}
        <section className="sticky top-0 bg-black z-50">
          <div className="flex justify-between items-center px-4 py-3">
            <button
              className="text-white text-sm font-medium flex items-center gap-2"
              onClick={onBack}
            >
              <Image src={ArrowLeft} height={10} alt="Arrow" />
              <span className="pb-[0.125rem]"> {t('suppliers.back')}</span>
            </button>
            <Link href="/">
              <Image src={logoWhiteLabel} height={24} alt="Volindo Logo" />
            </Link>
          </div>
        </section>
        {/* POST CARDS LIST*/}
        <section className="mb-8">
          {postsUUIDs
            ? postsUUIDs.map(uuid => (
                <PostSlider
                  key={uuid}
                  uuid={uuid}
                  agentName={agentName}
                  agentPhoto={agentPhoto}
                  clickWantDetails={clickWantDetails}
                  privateProfile={privateProfile}
                  onEditPost={(description, country, city) => {
                    onActionPostGetUUID(uuid);
                    onEditPost(description, country, city);
                  }}
                  onDeleteImage={(imageIndex, deletePost) => {
                    onActionPostGetUUID(uuid);
                    onDeleteImage(imageIndex, deletePost);
                  }}
                />
              ))
            : null}
        </section>
      </div>
    </div>
  );
};

export default PostsOnMobile;
