import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import arrowPreviousWhite from '@icons/arrow-left-white.svg';
import { useTranslation } from 'next-i18next';

import { setSelectedVideo, useAppDispatch, useAppSelector } from '@context';

import styles from '@styles/video-player.module.scss';

const VideoPlayer = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t, i18n } = useTranslation('common');

  const videoData = useAppSelector(
    state => state.marketing.helpCenter.selectedVideo
  );
  const categoryList = useAppSelector(
    state => state.marketing.helpCenter.selectedCategory
  );

  if (videoData.name === '') return <span> loading .......</span>;

  const { player_embed_url, description, name } = videoData;

  const handleClick = (video: any) => {
    dispatch(setSelectedVideo(video));
  };

  const handleClickBack = () => {
    router.back();
  };

  const getLabel = (tags: any) => {
    return tags.map((item: any, index: number) => {
      if (item.name === 'free' || item.name === 'expert') {
        const color = item.name === 'free' ? '#aacd5f' : '#fcca3e';
        return (
          <span
            key={index}
            className={styles.video_player_cat_holder_individual_label}
            style={{ backgroundColor: color }}
          >
            {item.name === 'free' ? 'Free' : 'Expert plan only'}
          </span>
        );
      }
      return '';
    });
  };

  return (
    <div className={styles.helpCenter}>
      <h1 className={styles.mainTitle}>{t('marketing.pages.helpCenter')}</h1>
      <div className={styles.video_player}>
        <div className={styles.video_player_title} onClick={handleClickBack}>
          <Image
            src={arrowPreviousWhite}
            width={20}
            height={20}
            alt="Go back"
          />
          {name}{' '}
        </div>

        <div className="md:flex">
          <div className={styles.video_player_container}>
            <div className={styles.video_player_container_screen}>
              <iframe
                src={player_embed_url}
                width="100%"
                height="100%"
                allowFullScreen
              ></iframe>
            </div>

            <div className={styles.video_player_container_title}> {name} </div>

            <div className={styles.video_player_description}>{description}</div>
          </div>

          <div className={styles.video_player_cat_holder}>
            {categoryList?.videos.map((video: any, index: number) => {
              return (
                <div
                  className={styles.video_player_cat_holder_individual}
                  onClick={() => handleClick(video)}
                  key={index}
                >
                  {getLabel(video.tags)}

                  <img
                    className={styles.video_player_cat_holder_individual_img}
                    src={video?.pictures?.sizes[2]?.link_with_play_button}
                    alt="Videos thumbnail"
                    width={253}
                    height={170}
                  />
                  <p className={styles.video_player_cat_holder_individual_name}>
                    {video.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
