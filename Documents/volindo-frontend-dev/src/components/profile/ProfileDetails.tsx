import { FC, useEffect, useState } from 'react';
import houseIcon from '@icons/homeIcon.svg';
import phoneIcon from '@icons/phoneProfileIcon.svg';
import emailIcon from '@icons/emailProfileIcon.svg';
import commentIcon from '@icons/langIcon.svg';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { PostItemGrid, ProfileType } from '@typing/types';
import cloudUpload from '@icons/cloudUpload.svg';
import AgentService from '@services/AgentService';

const ProfileDetails: FC<{
  profile: ProfileType;
  email: string;
  agent_id: string;
  uploadPost: () => void;
  renderTimestap?: number;
  setPostsUUIDs: (_postsUUIDs: Array<string>) => void;
  onClickImage: (_value: string) => void;
}> = ({
  profile,
  email,
  uploadPost,
  agent_id,
  renderTimestap = 1,
  setPostsUUIDs,
  onClickImage,
}) => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<PostItemGrid[]>([]);

  useEffect(() => {
    AgentService.getSimplePostsByAgentId(agent_id)
      .then(res => {
        if (!res.status) {
          // Order results by timestamp
          res.sort((a: PostItemGrid, b: PostItemGrid) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return dateB.getTime() - dateA.getTime();
          });

          setPosts(res);
          setPostsUUIDs(res.map((post: { uuid: string }) => post?.uuid));
        } else setPosts([]);
      })
      .catch(ex => {
        console.error(ex);
        setPosts([]);
        setPostsUUIDs([]);
      });
  }, [renderTimestap]);

  return (
    <section data-testid="profile-about-section" className="mt-8 text-white">
      {/* ABOUT ME */}
      <article>
        <h1 className="font-medium text-lg">{t('agent.about')}</h1>
        <p className="text-[#ffffffb2] my-1">{profile.description}</p>
        <div className="my-4 grid grid-cols-3">
          {/* GRID DATA */}
          <div className="text-[#ffffffb2] self-start">
            <div className="flex items-center gap-2">
              <Image src={houseIcon} height={24} alt="Home Icon" />
              {t('agent.live')}
            </div>
          </div>

          <span className="col-span-2 mb-4">
            {profile.address
              ? `${profile.address}, ${profile.zip_code} ${profile.state_province}, ${profile.city}, ${profile.country}`
              : '-'}
          </span>

          <div className="text-[#ffffffb2] self-start">
            <div className="flex items-center gap-2">
              <Image src={phoneIcon} height={24} alt="Phone Icon" />
              <span className="mb-[0.125rem]">{t('agent.phone')}</span>
            </div>
          </div>

          <span className="col-span-2 mb-4">
            {profile.phone_country_code} {profile.phone_number || '-'}
          </span>

          <div className="text-[#ffffffb2] self-start">
            <div className="flex items-center gap-2">
              <Image src={emailIcon} height={24} alt="Email Icon" />
              <span data-testid="profile-user-email" className="mb-[0.125rem]">
                {t('agent.email')}
              </span>
            </div>
          </div>

          <span className="col-span-2 mb-4">{email}</span>
          <div className="text-[#ffffffb2] self-start">
            <div className="flex items-center gap-2">
              <Image src={commentIcon} height={23} alt="Email Icon" />
              <span className="mb-1">{t('agent.speak')}</span>
            </div>
          </div>

          <span className="col-span-2 mb-4">
            {profile.languages.map(lang => t(`languages.${lang}`)).join(', ') ||
              '-'}
          </span>
        </div>
      </article>
      {/* TRIPS SPECIALIZE */}
      <article>
        {profile.type_specialize.length !== 0 ? (
          <h1 className="font-medium text-lg mb-2">{t('agent.special')}</h1>
        ) : null}
        <div className="flex flex-wrap gap-3">
          {profile.type_specialize.map(type => (
            <span
              key={type}
              className="px-7 py-[0.438rem] flex justify-center bg-[#ffffff1a] rounded-3xl"
            >
              {t(`agent.typeAgent.${type}`)}
            </span>
          ))}
        </div>
      </article>
      {/* IMAGES/VIDEOS */}

      <article className="my-4">
        <h1 className="font-medium text-lg mb-2">{t('agent.recentTrips')}</h1>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          <button
            className="border-2 border-[#777e90] border-dashed text-[#777e90] font-semibold w-full aspect-square"
            onClick={uploadPost}
          >
            <Image
              src={cloudUpload}
              alt="cloud"
              className="mx-auto my-2 block"
            />
            <span>{t('agent.post')}</span>
          </button>
          {posts.length !== 0
            ? posts.map(post => (
                <div
                  key={post.uuid}
                  className="relative overflow-hidden cursor-pointer"
                  onClick={() => onClickImage(post.uuid)}
                >
                  <img
                    src={post.image}
                    alt={post.uuid}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 hover:opacity-25 transition-opacity"></div>
                </div>
              ))
            : null}
        </div>
      </article>
    </section>
  );
};

export default ProfileDetails;
