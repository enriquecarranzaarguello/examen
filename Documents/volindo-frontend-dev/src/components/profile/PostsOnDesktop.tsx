import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import IconCloseBlack from '@icons/close-black.svg';
import userDef from '@icons/userDefaultIMG.svg';
import pinIcon from '@icons/roundPushpin.svg';
import threeDotsIcon from '@icons/threeDots.svg';
import pencilIcon from '@icons/pencil-white.svg';
import trashIcon from '@icons/trashCan-white.svg';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Dropdown } from 'rsuite';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// import required modules
import { Navigation } from 'swiper';
import { IndividualPost } from '@typing/types';
import { useTranslation } from 'react-i18next';
import AgentService from '@services/AgentService';

const PostsOnDesktop: FC<{
  open: boolean;
  onClose: () => void;
  agentName?: string;
  agentPhoto?: string;
  uuid: string;
  clickWantDetails?: () => void;
  privateProfile?: boolean;
  onEditPost?: (_description: string, _country: string, _city: string) => void;
  onDeleteImage?: (_index: number, _deletePost: boolean) => void;
}> = ({
  open,
  onClose,
  agentName = '',
  agentPhoto = '',
  uuid,
  clickWantDetails = () => {},
  privateProfile = false,
  onEditPost = () => {},
  onDeleteImage = () => {},
}) => {
  const { t } = useTranslation();
  const [post, setPost] = useState<IndividualPost>({
    description: '',
    images: [],
    city: '',
    country: '',
    created_at: '',
  });
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (uuid !== '' && open)
      AgentService.getIndividualPost(uuid).then(res => {
        if (!res.status) {
          setPost(res);
        }
      });
  }, [uuid, open]);

  useEffect(() => {
    if (!open) {
      setPost({
        description: '',
        images: [],
        city: '',
        country: '',
        created_at: '',
      });
      setImageIndex(0);
    }
  }, [open]);

  if (!open || !post.images[0]) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      <div className="absolute inset-0 bg-[#23262F]/[.5] flex"></div>
      <div className="relative rounded-xl bg-black shadow-[0px_64px_64px_-48px_rgba(15,15,15,0.08)] text-white">
        <button
          className="absolute  top-0 right-0  md:-top-5 md:-right-6"
          onClick={onClose}
        >
          <Image alt="icon" src={IconCloseBlack} />
        </button>
        <div className="w-[60vh] h-min-[60vh] pb-4">
          <div id={uuid}>
            {/* HEAD POST */}
            <div className="px-5 py-[0.875rem] grid grid-cols-6 items-center text-white">
              <div className="justify-self-start flex gap-3 items-center col-span-5">
                {agentPhoto ? (
                  <img
                    src={agentPhoto}
                    className=" w-8 h-8 rounded-full"
                    alt={agentName}
                  />
                ) : (
                  <Image
                    src={userDef}
                    width={32}
                    height={32}
                    alt={'agent photo'}
                  />
                )}
                <div className="flex flex-col">
                  <span className="font-bold text-base mt-[0.125rem]">
                    {agentName}
                  </span>
                  {post.city ? (
                    <div className="text-sm flex mt-[-0.25rem] gap-1">
                      <Image src={pinIcon} alt="Pin" width={10} height={10} />
                      <span className="pb-[0.125rem]">
                        {`${post.city}, ${post.country}`}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
              {privateProfile ? (
                <Dropdown
                  title={
                    <Image
                      alt="icon"
                      src={threeDotsIcon}
                      className=""
                      width={6.5}
                    />
                  }
                  className="justify-self-end dropdown-avatar dots"
                  placement="bottomEnd"
                >
                  <Dropdown.Item
                    className="flex gap-4 w-40 text-[white!important] hover:bg-white hover:bg-opacity-[.05] px-3"
                    onClick={() =>
                      onEditPost(post.description, post.country, post.city)
                    }
                  >
                    <Image src={pencilIcon} width={16} height={16} alt="edit" />
                    {t('agent.posts.edit')}
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="flex gap-4 w-40 text-[white!important] hover:bg-white hover:bg-opacity-[.05] px-3"
                    onClick={() =>
                      onDeleteImage(imageIndex, post.images.length === 1)
                    }
                  >
                    <Image
                      src={trashIcon}
                      width={13}
                      height={13}
                      alt="delete"
                      className="ml-[0.125rem]"
                    />
                    {t('agent.posts.delete')}
                  </Dropdown.Item>
                </Dropdown>
              ) : null}
            </div>
            {/* IMAGE */}
            <Swiper
              slidesPerView={1}
              loop={true}
              navigation={true}
              modules={[Navigation]}
              className="overflow-hidden select-none"
              onSlideChangeTransitionEnd={swiper => {
                const previousIndex = swiper.previousIndex;
                const currentIndex = swiper.activeIndex;
                if (currentIndex > previousIndex) {
                  // Swiped right
                  const newIndex = imageIndex + 1;
                  setImageIndex(newIndex === post.images.length ? 0 : newIndex);
                } else if (currentIndex < previousIndex) {
                  // Swiped left
                  const newIndex = imageIndex - 1;
                  setImageIndex(
                    newIndex === -1 ? post.images.length - 1 : newIndex
                  );
                }
              }}
            >
              {post.images ? (
                post.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image}
                      alt={`Image-${index}`}
                      className="w-full aspect-square object-cover"
                    />
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <img
                    src="/testImages/landscape-1.jpg"
                    alt="Landscape"
                    className="w-full aspect-square object-cover"
                  />
                </SwiperSlide>
              )}
            </Swiper>
            {/* DESCRIPTION */}
            <p className="text-white w-full px-6 py-3 text-sm leading-[1.125rem]">
              {post.description}
            </p>
            <div className="w-full px-6">
              {privateProfile ? null : (
                <button
                  className="bg-white py-3 w-full rounded-full text-black  font-semibold text-lg"
                  onClick={clickWantDetails}
                >
                  {t('agent.moreDetails')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostsOnDesktop;
