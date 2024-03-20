import React, { useState } from 'react';
import Link from 'next/link';
import styles from '@styles/marketing.module.scss';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import config from '@config';
import { useVariableValue } from '@devcycle/react-client-sdk';
import { Dropdown } from 'rsuite';

const MarketLinksBar = () => {
  const { t } = useTranslation();
  const actualPage = useRouter().pathname.replace('/marketing', '');
  const actualActiveDropdownPage = useRouter().pathname;

  const isActiveFlywayAcademy = useVariableValue('marketing-academy', false);
  const isActiveTemplates = useVariableValue('marketing-templates', false);
  const showDealPackages = useVariableValue('deal-packages', false);
  const showHelpCenter = useVariableValue('help-center', false);
  const showMixPack = useVariableValue('mix-pack', false);
  const showAdForm = useVariableValue('ad-form', false);
  const showAdManager = useVariableValue('ad-manager', false);

  const dropdownItems = [
    {
      href: '/marketing/manager/form',
      label: t('marketing.pages.adForm'),
      condition: showAdForm,
    },
    {
      href: '/marketing/manager/crm',
      label: t('marketing.pages.adManager'),
      condition: showAdManager,
    },
    { href: '/marketing/branding', label: t('marketing.pages.branding') },
    {
      href: '/marketing/mix-pack',
      label: 'Mix Pack',
      condition: showMixPack,
    },
    {
      href: '/marketing/course-flyway',
      label: `${t('marketing.pages.academy')} ${config.WHITELABELNAME}`,
      condition: isActiveFlywayAcademy,
    },
    {
      href: '/marketing/templates',
      label: t('marketing.templates.templates'),
      condition: isActiveTemplates,
    },
    {
      href: '/marketing/deal-templates',
      label: t('marketing.templates.dealTemplates'),
      condition: showDealPackages,
    },
  ];

  const initialActiveItem =
    dropdownItems.find(item => actualActiveDropdownPage.includes(item.href)) ||
    dropdownItems[0];

  const [activeItem, setActiveItem] = useState(initialActiveItem);

  const handleSelect = (item: any) => {
    setActiveItem(item);
  };

  return (
    <>
      {/* Mobile navigation dropdown */}
      <Dropdown title={activeItem.label} className={styles.linksBarDropdown}>
        {dropdownItems.map(
          (item, index) =>
            item.condition !== false && (
              <Dropdown.Item
                key={index}
                as={Link}
                onClick={() => handleSelect(item)}
                className={
                  activeItem.href === item.href ? styles.activeDropdownItem : ''
                }
                href={item.href}
              >
                {item.label}
              </Dropdown.Item>
            )
        )}
      </Dropdown>

      <div data-testid="marketing-bar" className={styles.linksBar}>
        {showAdForm && (
          <Link
            data-testid="marketing-form-link"
            href="/marketing/manager/form"
            className={
              actualPage.includes('/manager/form') ? styles.active : ''
            }
          >
            {t('marketing.pages.adForm')}
          </Link>
        )}

        {showAdManager && (
          <Link
            data-testid="marketing-crm-link"
            href="/marketing/manager/crm"
            className={actualPage.includes('/manager/crm') ? styles.active : ''}
          >
            {t('marketing.pages.adManager')}
          </Link>
        )}

        {/* <Link
        href="/marketing/offers"
        className={actualPage === '/offers' ? styles.active : ''}
      >
        {t('marketing.pages.offers')}
      </Link> */}
        <Link
          data-testid="marketing-packages-link"
          href="/marketing/branding"
          className={actualPage === '/branding' ? styles.active : ''}
        >
          {t('marketing.pages.branding')}
        </Link>

        {showMixPack && (
          <Link
            href="/marketing/mix-pack"
            className={actualPage === '/mix-pack' ? styles.active : ''}
          >
            Mix Pack
          </Link>
        )}

        {isActiveFlywayAcademy && (
          <Link
            data-testid="marketing-courses-link"
            href="/marketing/course-flyway"
            className={actualPage === '/course-flyway' ? styles.active : ''}
          >
            {t('marketing.pages.academy')} {config.WHITELABELNAME}
          </Link>
        )}

        {isActiveTemplates && (
          <Link
            data-testid="marketing-temnplates-link"
            href="/marketing/templates"
            className={actualPage === '/templates' ? styles.active : ''}
          >
            {t('marketing.templates.templates')}
          </Link>
        )}

        {showDealPackages && (
          <Link
            href="/marketing/deal-templates"
            className={actualPage === '/deal-templates' ? styles.active : ''}
          >
            {t('marketing.templates.dealTemplates')}
          </Link>
        )}

        {/* <Link
        href="/marketing/branding"
        // className={actualPage === '/branding' ? styles.active : ''}
      >
        {t('marketing.pages.events')}
      </Link> */}
        {/* <Link
        href="/marketing/branding"
        // className={actualPage === '/branding' ? styles.active : ''}
      >
        {t('marketing.pages.session')}
      </Link> */}
      </div>
    </>
  );
};

export default MarketLinksBar;
