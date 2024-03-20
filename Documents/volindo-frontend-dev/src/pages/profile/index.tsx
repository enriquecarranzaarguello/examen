import { useEffect, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '@pages/api/auth/[...nextauth]';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import nextI18nextConfig from 'next-i18next.config';
import { ModalEditProfile, SEO, UploaderModal } from '@components';
import Image from 'next/image';
import userDef from '@icons/userDefaultIMG.svg';
import editPencil from '@icons/editPencil.svg';
import instagramIcon from '@icons/instagramIcon.svg';
import whatsAppIcon from '@icons/whatsappIcon.svg';
import facebookIcon from '@icons/facebookIcon.svg';
import globeIcon from '@icons/globeIcon.svg';
import checkIcon from '@icons/check.svg';
import shareIcon from '@icons/shareIcon.svg';
import { useTranslation } from 'react-i18next';
import {
  PostsOnDesktop,
  PostsOnMobile,
  ProfileDetails,
  ProfileTab,
  Wallet,
} from 'src/components/profile';
import { setProfile, useAppDispatch, useAppSelector } from '@context';
import { NextPageWithLayout, UploadedFilesType } from '@typing/types';
import { FileType } from 'rsuite/esm/Uploader';
import AgentService from '@services/AgentService';
import UploadPostModal from 'src/components/modals/UploadPostModal';
import ModalShareProfile from 'src/components/modals/ModalShareProfile';
import InfoPopup from 'src/components/popups/InfoPopup';
import ModalEditPost from 'src/components/modals/ModalEditPost';
import axios from 'axios';
import { getLayout } from '@layouts/MainLayout';

export const getServerSideProps = async ({
  locale,
  req,
  res,
}: GetServerSidePropsContext) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(
        locale || 'en',
        ['common'],
        nextI18nextConfig
      )),
      session,
    },
  };
};

const AgentProfile: NextPageWithLayout = () => {
  //Translation
  const { t } = useTranslation();
  //State Modal Opening
  const [openModalEditProfile, setOpenModalProfile] = useState(false);
  const [openUploaderModal, setOpenUploaderModal] = useState(false);
  const [openUploadPostModal, setOpenUploadPostModal] = useState(false);
  const [openShareProfileModal, setOpenShareProfileModal] = useState(false);
  const [openEditPostModal, setOpenEditPostModal] = useState(false);
  //State for Toggles
  const [isOnDetails, setIsOnDetails] = useState(true);
  // State for window size
  const [windowSize, setWindowSize] = useState(0);
  //Agent Data
  const profile = useAppSelector(state => state.agent.profile);
  const email = useAppSelector(state => state.agent.email);
  const agent_id = useAppSelector(state => state.agent.agent_id);
  const [descriptionPost, setDescriptionPost] = useState('');
  const [countryPost, setCountryPost] = useState('');
  const [cityPost, setCityPost] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesType>({});
  const [uploadedFilesPost, setUploadedFilesPost] = useState<UploadedFilesType>(
    {}
  );
  //Redux dispatcher
  const dispatch = useAppDispatch();
  // Aux timestap
  const [renderTimestap, setRenderTimestap] = useState(new Date().getTime());
  // Aux states
  const [openPosts, setOpenPosts] = useState(false);
  const [postsUUIDsMobile, setPostsUUIDsMobile] = useState<string[]>([]);
  const [selectedDesktopPost, setSelectedDesktopPost] = useState('');
  const [postsUUIDs, setPostsUUIDs] = useState<string[]>([]);
  // Popup state
  const [openPopup, setOpenPopup] = useState(false);
  const [popupTitle, setpopupTitle] = useState('');
  const [popupType, setpopupType] = useState<'info' | 'loading' | 'confirm'>(
    'info'
  );
  const [popupTextButton, setpopupTextButton] = useState('Ok');
  const [popupInfoText, setpopupInfoText] = useState('');
  // Aux function launch popUp
  const launchPopup = (type: 'info' | 'loading', title: string) => {
    setpopupType(type);
    setpopupTitle(title);
    setOpenPopup(true);
  };
  // Aux delete index Image
  const [indexDeleteImage, setIndexDeleteImage] = useState(0);
  const isValidSubscription = useAppSelector(
    state => state.agent.agent_is_subscribed
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

  const handleFileChange = (key: string, files: FileType[]) => {
    setUploadedFiles(prevState => ({
      ...prevState,
      [key]: files,
    }));
  };

  const handleFileChangePost = (key: string, files: FileType[]) => {
    setUploadedFilesPost(prevState => ({
      ...prevState,
      [key]: files,
    }));
  };

  const handleUploadProfilePhoto = () => {
    setOpenUploaderModal(false);
    launchPopup('loading', t('agent.uploadPhoto'));
    const profilePhoto = uploadedFiles.profilePhoto[0].blobFile;
    if (profilePhoto !== undefined) {
      setTimeout(() => {
        AgentService.uploadProfilePhoto(agent_id, profilePhoto)
          .then(res => {
            if (res.status) {
              launchPopup('info', t('agent.photoEx'));
              return;
            }
            var timestamp = new Date().getTime();
            dispatch(
              setProfile({
                ...profile,
                photo: `${res.photo}?timestamp=${timestamp}`,
              })
            );
            launchPopup('info', t('agent.photoSucc'));
            setUploadedFiles({});
          })
          .catch(ex => {
            console.error(ex);
            launchPopup('info', t('agent.photoEx'));
          });
      }, 1000);
    }
  };

  const handleUploadPost = () => {
    setOpenUploadPostModal(false);
    launchPopup('loading', t('agent.posts.uploading'));
    setTimeout(() => {
      AgentService.uploadPost(
        agent_id,
        uploadedFilesPost.photosPost,
        descriptionPost,
        cityPost,
        countryPost
      )
        .then(async (res: any) => {
          if (
            res.status === 500 ||
            res.status === 422 ||
            res == 'ERR_NETWORK' ||
            !res.presigned_urls
          ) {
            launchPopup('info', t('agent.posts.error'));
            return;
          }

          // TODO: It can be improved with a Promise.all() but, before doing
          // the async fetch, we need to implement in backend queues or something
          // to protect the critical section on dynamoDB (the url List).
          let uploadedFiles = 0;
          for (let i = 0; i < res.presigned_urls.length; i++) {
            setpopupInfoText(
              `${t('agent.posts.uploading_image')} ${i + 1}/${
                res.presigned_urls.length
              }...`
            );
            const file = uploadedFilesPost.photosPost[i];
            try {
              const response = await axios.put(
                res.presigned_urls[i],
                file.blobFile,
                {
                  headers: {
                    'Content-Type': file.blobFile?.type,
                  },
                }
              );
              if (response.status === 200) uploadedFiles++;
            } catch (error) {
              setpopupInfoText('');
              console.error('Error On Upload Image:', error);
            }
          }

          setpopupInfoText('');
          if (uploadedFiles !== uploadedFilesPost.photosPost.length)
            launchPopup('info', t('agent.posts.error'));
          else {
            launchPopup('info', t('agent.posts.success'));
            setUploadedFilesPost({});
            setDescriptionPost('');
            setCountryPost('');
            setCityPost('');
            setTimeout(() => {
              setRenderTimestap(new Date().getTime());
            }, 1000);
          }
        })
        .catch(ex => {
          setpopupInfoText('');
          console.error(ex);
          launchPopup('info', t('agent.posts.error'));
        });
    }, 1000);
  };

  const submitDeleteImage = () => {
    launchPopup('loading', t('agent.posts.deleting'));
    AgentService.deleteImageByUUIDAndIndex(
      selectedDesktopPost,
      indexDeleteImage
    )
      .then(res => {
        if (!res.status) {
          //All good
          if (res.message === 'Image from post was deleted successfully')
            launchPopup('info', t('agent.posts.successDelete'));
          else launchPopup('info', t('agent.posts.successDeleteAll'));
          // Re-render the images with timestap
          setRenderTimestap(new Date().getTime());
        } else {
          launchPopup('info', t('agent.posts.errorDelete'));
        }
      })
      .catch(err => {
        console.error(err);
        launchPopup('info', t('agent.posts.errorDelete'));
      })
      .finally(() => {
        // Cleaning the popup and indexImage
        setpopupTextButton('Ok');
        setpopupType('info');
        setpopupInfoText('');
        setIndexDeleteImage(0);
      });
  };

  const handleOpenEditPost = (
    description: string,
    country: string,
    city: string
  ) => {
    setDescriptionPost(description);
    setCountryPost(country);
    setCityPost(city);
    setOpenPosts(false);
    setOpenEditPostModal(true);
  };

  const handleConfirmDeleteImagePost = (
    imageIndex: number,
    deletePost: boolean
  ) => {
    setpopupType('confirm');
    setpopupTitle(t('agent.posts.confirmDeleteImage') || '');
    setpopupTextButton(t('agent.posts.sure') || '');
    if (deletePost) setpopupInfoText(t('agent.posts.warningDeletePost') || '');
    setIndexDeleteImage(imageIndex);
    setOpenPosts(false);
    setOpenPopup(true);
  };

  useEffect(() => {
    setWindowSize(window.innerWidth);
    const handleResize = () => setWindowSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (openModalEditProfile) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => document.body.classList.remove('no-scroll');
  }, [openModalEditProfile]);

  return (
    <>
      <SEO title={isOnDetails ? t('agent.profile') : t('agent.wallet')} />

      <InfoPopup
        open={openPopup}
        onClose={() => {
          setpopupTextButton('Ok');
          setpopupType('info');
          setpopupInfoText('');
          setOpenPopup(false);
          setIndexDeleteImage(0);
        }}
        onClickButton={
          popupType === 'confirm'
            ? () => submitDeleteImage()
            : () => {
                setOpenPopup(false);
              }
        }
        title={popupTitle}
        textButton={popupTextButton}
        type={popupType}
        info={popupInfoText}
      />

      <ModalEditProfile
        open={openModalEditProfile}
        onClose={() => setOpenModalProfile(false)}
        launchPopup={launchPopup}
      />

      <ModalEditPost
        open={openEditPostModal}
        close={() => setOpenEditPostModal(false)}
        uuid={selectedDesktopPost}
        description={descriptionPost}
        onChangeDescription={setDescriptionPost}
        country={countryPost}
        onChangeCountry={v => {
          setCountryPost(v);
        }}
        city={cityPost}
        onChangeCity={v => {
          setCityPost(v);
        }}
        launchPopup={launchPopup}
      />

      <ModalShareProfile
        open={openShareProfileModal}
        onClose={() => setOpenShareProfileModal(false)}
      />
      <UploaderModal
        isOpen={openUploaderModal}
        close={() => setOpenUploaderModal(false)}
        currentUploaderKey="profilePhoto"
        fileList={uploadedFiles['profilePhoto'] || []}
        handleFileUpload={handleFileChange}
        fileType="Images"
        singleFile={true}
        callbackAndClose={handleUploadProfilePhoto}
      />
      <UploadPostModal
        isOpen={openUploadPostModal}
        close={() => setOpenUploadPostModal(false)}
        currentUploaderKey="photosPost"
        fileList={uploadedFilesPost['photosPost'] || []}
        handleFileUpload={handleFileChangePost}
        callbackAndClose={handleUploadPost}
        description={descriptionPost}
        onChangeDescription={v => {
          setDescriptionPost(v);
        }}
        country={countryPost}
        onChangeCountry={v => {
          setCountryPost(v);
        }}
        city={cityPost}
        onChangeCity={v => {
          setCityPost(v);
        }}
      />
      {windowSize < 1024 ? (
        <PostsOnMobile
          open={openPosts}
          onBack={() => {
            setOpenPosts(false);
          }}
          postsUUIDs={postsUUIDsMobile}
          agentName={profile?.full_name}
          agentPhoto={profile?.photo || ''}
          privateProfile={true}
          onEditPost={handleOpenEditPost}
          onDeleteImage={handleConfirmDeleteImagePost}
          onActionPostGetUUID={uuid => setSelectedDesktopPost(uuid)}
        />
      ) : (
        <PostsOnDesktop
          open={openPosts}
          onClose={() => {
            setOpenPosts(false);
          }}
          agentName={profile?.full_name}
          agentPhoto={profile?.photo || ''}
          uuid={selectedDesktopPost}
          privateProfile={true}
          onEditPost={handleOpenEditPost}
          onDeleteImage={handleConfirmDeleteImagePost}
        />
      )}
      <div className="w-full h-auto flex justify-center relative ">
        <div className="relative flex w-[100%] items-center flex-col mx-4 md:mx-16 lg:mx-8 xl:mx-40 lg:flex-row lg:gap-16 lg:items-start lg:mt-5">
          {/* PROFILE CARD */}
          <section
            data-testid="profile-personal-info"
            className="profile-image w-[100%] h-fit max-w-[358px] bg-white/10 rounded-3xl flex justify-center items-center flex-col p-4 gap-3 mb-5"
          >
            {profile.photo ? (
              <div
                className={`${
                  isValidSubscription
                    ? 'border-whiteLabelColor'
                    : 'border-red-600'
                } border-[6px] rounded-full`}
              >
                <img
                  src={profile.photo}
                  className="w-[150px] h-[150px] rounded-full"
                />
              </div>
            ) : (
              <div
                className={`${
                  isValidSubscription
                    ? 'border-whiteLabelColor'
                    : 'border-red-600'
                } border-[6px] rounded-full`}
              >
                <Image
                  src={userDef}
                  width={120}
                  height={120}
                  alt={'agent photo'}
                />
              </div>
            )}
            <button
              className="flex gap-2 cursor-pointer p-2"
              onClick={() => setOpenUploaderModal(true)}
            >
              <Image
                src={editPencil}
                width={17}
                height={17}
                alt="Edit Pencil"
              />
              <span className="text-white opacity-70 font-medium">
                {t('agent.photo')}
              </span>
            </button>
            <h1
              data-testid="profile-user-name"
              className="text-white font-bold text-2xl text-center"
            >
              {profile.full_name}
            </h1>
            <div className="p-2 w-[182px] flex justify-center bg-[#ffffff1a] text-white rounded-3xl text-base">
              0 {t('agent.traveler')}
            </div>
            <div className="flex gap-12 m-2">
              <Image
                src={instagramIcon}
                width={24}
                height={24}
                alt="Instagram"
                className="cursor-pointer transition-all hover:translate-y-[-0.125rem] hover:scale-105"
                onClick={() => {
                  window.open(
                    profile.url_instagram || 'https://www.instagram.com/',
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
                    profile.url_whatsapp || 'https://wa.me/',
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
                    profile.url_facebook || 'https://www.facebook.com/',
                    '_blank'
                  );
                }}
              />
            </div>
            {profile.web_site ? (
              <div className="flex gap-2 text-base cursor-pointer text-white w-full justify-center">
                <Image src={globeIcon} height={18} alt="GlobeIcon" />
                <p className="truncate max-w-[70%]">
                  <a target="_blank" href={profile.web_site || ''}>
                    {profile.web_site
                      ?.replaceAll('http://', '')
                      .replaceAll('https://', '')}
                  </a>
                </p>
              </div>
            ) : null}
            <div className="flex gap-1 items-center text-[#777E91]">
              <Image src={checkIcon} width={24} alt="Check" />
              {t('agent.expertProfile')}
            </div>

            {windowSize < 1024 ? (
              // Todo check refactor and use one set of buttons
              <div className="flex items-center gap-5">
                <button
                  data-testid="profile-edit-button"
                  className="text-white font-medium py-3 px-4 border-2 border-[#353945] rounded-full"
                  onClick={() => setOpenModalProfile(true)}
                >
                  {t('agent.edit')}
                </button>

                <button
                  data-testid="profile-share-button"
                  onClick={() => setOpenShareProfileModal(true)}
                >
                  <Image
                    src={shareIcon}
                    width={24}
                    height={24}
                    alt="ShareIcon"
                  />
                </button>
              </div>
            ) : null}
          </section>
          <div className="w-full">
            {/* TABS */}
            <div className="flex justify-between">
              <ProfileTab
                initialTab="details"
                onChange={changedTab => {
                  setIsOnDetails(changedTab);
                }}
              />

              {windowSize >= 1024 ? (
                // Todo check refactor and use one set of buttons
                <div className="flex items-center gap-5">
                  <button
                    data-testid="profile-edit-button"
                    className="text-white font-medium py-3 px-4 border-2 border-[#353945] rounded-full"
                    onClick={() => setOpenModalProfile(true)}
                  >
                    {t('agent.edit')}
                  </button>

                  <button
                    data-testid="profile-share-button"
                    onClick={() => setOpenShareProfileModal(true)}
                  >
                    <Image
                      src={shareIcon}
                      width={24}
                      height={24}
                      alt="ShareIcon"
                    />
                  </button>
                </div>
              ) : null}
            </div>
            {isOnDetails ? (
              <ProfileDetails
                profile={profile}
                email={email}
                agent_id={agent_id}
                uploadPost={() => setOpenUploadPostModal(true)}
                renderTimestap={renderTimestap}
                setPostsUUIDs={setPostsUUIDs}
                onClickImage={uuid => {
                  unShiftPosts(uuid);
                  setSelectedDesktopPost(uuid);
                  setOpenPosts(true);
                }}
              />
            ) : (
              <Wallet />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

AgentProfile.getLayout = getLayout;

export default AgentProfile;
