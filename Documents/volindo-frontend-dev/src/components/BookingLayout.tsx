import React, { useEffect, useState } from 'react';
import { Inter } from '@next/font/google';
import { Container, Content } from 'rsuite';
import { useTranslation } from 'next-i18next';

import type { BookingLayoutProps } from '@typing/proptypes';

import { ResDetailsHeader, Footer, Header } from '@components';

import { useAppSelector } from '@context';
import router from 'next/router';
import AgentService from '@services/AgentService';
import { ProfileType } from '@typing/types';

const inter = Inter({ subsets: ['latin'] });

export default function BookingLayout({
  children,
  isPublic = false,
  agentId,
}: BookingLayoutProps) {
  const [agentProfile, setAgentProfile] = useState<ProfileType>({
    full_name: '',
    photo: '',
    phone_country_code: '',
    phone_number: '',
    birthday: '',
    address: '',
    city: '',
    country: '',
    state_province: '',
    zip_code: '',
    web_site: '',
    type_specialize: [],
    area_specialize: [],
    languages: [],
    url_facebook: '',
    url_instagram: '',
    url_whatsapp: '',
    description: '',
  });

  const [agentEmail, setAgentEmail] = useState('');
  const memoryAgent = useAppSelector(state => state.agent);

  useEffect(() => {
    if (isPublic && agentId) {
      AgentService.getAgentProfile(agentId).then(res => {
        if (!res.status) {
          const newProfile: ProfileType = {
            full_name: res.full_name_account || '',
            photo: res.photo || '',
            address: res.address_full || '',
            city: res.address_city || '',
            state_province: res.address_state_province || '',
            country: res.address_country || '',
            zip_code: res.address_zip_code || '',
            phone_country_code: res.phone_country_code || '',
            phone_number: res.phone_number || '',
            birthday: res.birthday || '',
            web_site: res.web_site || '',
            url_facebook: res.url_facebook || '',
            url_instagram: res.url_instagram || '',
            url_whatsapp: res.url_whatsapp || '',
            languages: res.languages || [],
            area_specialize: res.area_specialize || [],
            type_specialize: res.type_specialize || [],
            description: res.description || '',
          };
          setAgentProfile(newProfile);
        }
      });
      AgentService.getEmailByAgent_id(agentId).then(res => {
        if (!res.status) {
          setAgentEmail(res.email || '');
        }
      });
    } else {
      setAgentProfile(memoryAgent.profile);
      setAgentEmail(memoryAgent.email);
    }
  }, [agentId, isPublic, memoryAgent]);

  const { i18n } = useTranslation('common');
  return (
    <div>
      <Container
        className={`overflow-y-auto px-0 cursor-default lg:px-[48px] overflow-hidden`}
      >
        <ResDetailsHeader
          agent={{ profile: agentProfile, email: agentEmail }}
          redirectHome={() => router.push('/', '/', { locale: i18n.language })}
          isPublic={isPublic}
        />
        {/* checking laypuout I will remove before merge */}
        {/* <Header /> */}
        <Content className={`${inter.className} h-full`}>{children}</Content>
        <Footer />
      </Container>
    </div>
  );
}
