import { SEO } from '@components';
import { GetServerSidePropsContext } from 'next';
import nextI18nextConfig from 'next-i18next.config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import userDef from '@icons/userDefaultIMG.svg';
import { NextPageWithLayout, PostItemGrid, ProfileType } from '@typing/types';
import { useTranslation } from 'react-i18next';
import houseIcon from '@icons/homeIcon.svg';
import phoneIcon from '@icons/phoneProfileIcon.svg';
import emailIcon from '@icons/emailProfileIcon.svg';
import commentIcon from '@icons/langIcon.svg';
import globeIcon from '@icons/globeIcon.svg';
import birdVolindo from '@icons/birdVolindo.svg';
import instagramIcon from '@icons/instagramIcon.svg';
import whatsAppIcon from '@icons/whatsappIcon.svg';
import facebookIcon from '@icons/facebookIcon.svg';
import AgentService from '@services/AgentService';
import { PostsOnDesktop, PostsOnMobile } from 'src/components/profile';
import ModalLetterAgent from 'src/components/modals/ModalLetterAgent';
import InfoPopup from 'src/components/popups/InfoPopup';
import { getLayout } from '@layouts/MainPublicLayout';

export const getServerSideProps = async ({
  locale,
  query,
}: GetServerSidePropsContext) => {
  const { email, fullname } = query;

  if (typeof email === 'string' && typeof fullname === 'string') {
    const response = await AgentService.isCorrectPublicProfile(email, fullname);
    if (response === undefined || response.status) {
      return {
        //If not 200 redirect to login page
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
  } else {
    return {
      //If params void or not string redirect to login page
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // At this point we have a valid email and fullname
  return {
    props: {
      ...(await serverSideTranslations(
        locale || 'en',
        ['common'],
        nextI18nextConfig
      )),
    },
  };
};

const AgentPublicProfile: NextPageWithLayout = () => {
  const router = useRouter();
  const { email } = router.query;
  // Data of public profile
  const [profile, setProfile] = useState<ProfileType>({
    full_name: '',
    photo: '',
    address: '',
    city: '',
    state_province: '',
    country: '',
    zip_code: '',
    phone_country_code: '',
    phone_number: '',
    birthday: '',
    web_site: '',
    url_facebook: '',
    url_instagram: '',
    url_whatsapp: '',
    languages: [],
    area_specialize: [],
    type_specialize: [],
    description: '',
  });
  // Data of posts
  const [agent_id, setAgent_id] = useState<string>();
  const [posts, setPosts] = useState<PostItemGrid[]>([]);
  // Translation
  const { t } = useTranslation();
  // Aux states
  const [openPosts, setOpenPosts] = useState(false);
  const [postsUUIDsMobile, setPostsUUIDsMobile] = useState<string[]>([]);
  const [selectedDesktopPost, setSelectedDesktopPost] = useState('');
  const [postsUUIDs, setPostsUUIDs] = useState<string[]>([]);
  const [openLetterAgent, setOpenLetterAgent] = useState(false);
  // State for window size
  const [windowSize, setWindowSize] = useState(0);
  // Popup state
  const [openPopup, setOpenPopup] = useState(false);
  const [popupTitle, setpopupTitle] = useState('');
  const [popupType, setpopupType] = useState<'info' | 'loading' | 'confirm'>(
    'info'
  );

  const unShiftPosts = (uuid: string) => {
    const copyPosts = [...postsUUIDs];
    const index = copyPosts.findIndex(item => item === uuid);
    if (index !== -1) {
      copyPosts.splice(index, 1);
    }
    copyPosts.unshift(uuid);
    setPostsUUIDsMobile(copyPosts);
  };

  useEffect(() => {
    if (typeof email === 'string')
      AgentService.getAgentPublicProfile(email).then(res => {
        if (!res.status) {
          const resProfile: ProfileType = {
            full_name: res.full_name_account,
            photo: res.photo || '',
            address: res.address_full,
            city: res.address_city,
            state_province: res.address_state_province,
            country: res.address_country,
            zip_code: res.address_zip_code,
            phone_country_code: res.phone_country_code,
            phone_number: res.phone_number,
            birthday: res.birthday,
            web_site: res.web_site,
            url_facebook: res.url_facebook,
            url_instagram: res.url_instagram,
            url_whatsapp: res.url_whatsapp,
            languages: res.languages,
            area_specialize: res.area_specialize,
            type_specialize: res.type_specialize,
            description: res.description,
          };
          setProfile(resProfile);
          setAgent_id(res.agent_id);
        }
      });
  }, [email]);

  useEffect(() => {
    if (agent_id !== undefined)
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
          } else {
            setPosts([]);
          }
        })
        .catch(ex => {
          console.error(ex);
          setPosts([]);
          setPostsUUIDs([]);
        });
  }, [agent_id]);

  useEffect(() => {
    setWindowSize(window.innerWidth);
    const handleResize = () => setWindowSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!profile.full_name) return <SEO title={'Perfil Público'} />;

  return (
    <>
      <SEO title={profile?.full_name} />
      {windowSize < 1024 ? (
        <PostsOnMobile
          open={openPosts}
          onBack={() => {
            setOpenPosts(false);
            setSelectedDesktopPost('');
          }}
          postsUUIDs={postsUUIDsMobile}
          agentName={profile?.full_name}
          agentPhoto={profile?.photo || ''}
          clickWantDetails={() => {
            setOpenPosts(false);
            setOpenLetterAgent(true);
          }}
        />
      ) : (
        <PostsOnDesktop
          open={openPosts}
          onClose={() => {
            setOpenPosts(false);
            setSelectedDesktopPost('');
          }}
          agentName={profile?.full_name}
          agentPhoto={profile?.photo || ''}
          uuid={selectedDesktopPost}
          clickWantDetails={() => {
            setOpenPosts(false);
            setOpenLetterAgent(true);
          }}
        />
      )}
      <ModalLetterAgent
        open={openLetterAgent}
        onClose={() => setOpenLetterAgent(false)}
        launchPopup={(message, type) => {
          setpopupTitle(message);
          setpopupType(type);
          setOpenPopup(true);
        }}
        emailAgent={typeof email === 'string' ? email : ''}
      />
      <InfoPopup
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        onClickButton={() => setOpenPopup(false)}
        title={popupTitle}
        type={popupType}
      />
      <div className="w-full h-full flex justify-center">
        <div className="lg:grid lg:grid-cols-5 w-[100%] items-center mx-4 md:mx-16 lg:mx-8 xl:mx-28 lg:flex-row lg:gap-16 lg:items-start ">
          <div className="w-[100%] lg:col-span-2">
            {/* AGENT PRESENTATION */}
            <section>
              <div className="flex gap-9 justify-center">
                {profile !== undefined && profile.photo ? (
                  <img
                    src={profile.photo}
                    className="w-[120px] h-[120px] rounded-full"
                    alt={`${profile.full_name} Photo`}
                  />
                ) : (
                  <Image
                    src={userDef}
                    width={100}
                    height={100}
                    alt={'agent photo'}
                  />
                )}
              </div>
              <h1 className="text-white font-bold text-4xl text-center my-3">
                {profile?.full_name}
              </h1>
              <div className="flex flex-wrap gap-3 justify-center">
                {profile?.type_specialize.map(type => (
                  <span
                    key={type}
                    className="px-3 py-[0.438rem] flex justify-center bg-[#ffffff1a] rounded-3xl text-[0.9375rem] text-white"
                  >
                    {t(`agent.typeAgent.${type}`)}
                  </span>
                ))}
              </div>
              <p className="my-4 px-5 text-base text-white text-center leading-[1.625rem]">
                {profile?.description || ''}
              </p>
              <div className="flex m-2 mb-6 justify-evenly">
                <Image
                  src={instagramIcon}
                  width={24}
                  height={24}
                  alt="Instagram"
                  className="cursor-pointer transition-all hover:translate-y-[-0.125rem] hover:scale-105"
                  onClick={() => {
                    window.open(
                      profile?.url_instagram || 'https://www.instagram.com/',
                      '_blank'
                    );
                  }}
                />
                <Image
                  src={whatsAppIcon}
                  width={24}
                  height={24}
                  alt="WhatsApp"
                  className="cursor-pointer transition-all hover:translate-y-[-0.125rem] hover:scale-105"
                  onClick={() => {
                    window.open(
                      profile?.url_whatsapp || 'https://wa.me/',
                      '_blank'
                    );
                  }}
                />
                <Image
                  src={facebookIcon}
                  height={24}
                  alt="Facebook"
                  className="cursor-pointer transition-all hover:translate-y-[-0.125rem] hover:scale-105"
                  onClick={() => {
                    window.open(
                      profile?.url_facebook || 'https://www.facebook.com/',
                      '_blank'
                    );
                  }}
                />
              </div>
              <hr className="border-[#2e2e2e]" />
            </section>
            {/* MORE DATA */}
            <section className="my-4 px-2 flex flex-col gap-2">
              <div className="flex justify-start items-center gap-3 ">
                <Image src={houseIcon} height={24} alt="Home Icon" />
                <span className="text-[#FCFCFD] text-sm font-normal ">
                  {profile?.address
                    ? `${profile.address}, ${profile.zip_code} ${profile.state_province}, ${profile.city}, ${profile.country}`
                    : '-'}
                </span>
              </div>
              <div className="flex justify-start items-center gap-3 ">
                <Image src={phoneIcon} height={24} alt="Phone Icon" />
                <span className="text-[#FCFCFD] text-sm font-normal">
                  {profile?.phone_country_code} {profile?.phone_number || '-'}
                </span>
              </div>
              <div className="flex justify-start items-center gap-3 ">
                <Image src={emailIcon} height={24} alt="Email Icon" />
                <span className="text-[#FCFCFD] text-sm font-normal">
                  {email}
                </span>
              </div>
              <div className="flex justify-start items-center gap-3 ">
                <Image src={commentIcon} height={23} alt="Email Icon" />
                {profile?.languages ? (
                  <span className="text-[#FCFCFD] text-sm font-normal">
                    {profile?.languages
                      .map(lang => t(`languages.${lang}`))
                      .join(', ') || '-'}
                  </span>
                ) : null}
              </div>
              <div className="flex justify-start items-center gap-3 ">
                <Image src={globeIcon} height={24} alt="Phone Icon" />
                <a
                  target="_blank"
                  href={profile?.web_site || ''}
                  className="text-[#FCFCFD] text-sm font-normal cursor-pointer"
                >
                  {profile?.web_site
                    ?.replaceAll('http://', '')
                    .replaceAll('https://', '')}
                </a>
              </div>
              <button
                className="border-2 border-white py-3 rounded-full text-white text-lg flex gap-2 items-center justify-center mt-8 lg:mt-3"
                onClick={() => setOpenLetterAgent(true)}
              >
                <Image src={birdVolindo} height={24} alt="Volindo Bird Icon" />
                {t('agent.message')}
              </button>
            </section>
          </div>
          <section className="my-4 lg:col-span-3">
            <h1 className="font-medium text-lg mb-2 text-white">
              {t('agent.recentTrips')}
            </h1>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {posts.length !== 0
                ? posts.map(post => (
                    <div
                      key={post.uuid}
                      className="relative overflow-hidden cursor-pointer"
                      onClick={() => {
                        unShiftPosts(post.uuid);
                        setSelectedDesktopPost(post.uuid);
                        setOpenPosts(true);
                      }}
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
          </section>
        </div>
      </div>
    </>
  );
};

AgentPublicProfile.getLayout = getLayout;

export default AgentPublicProfile;
