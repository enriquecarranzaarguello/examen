import { FileMetadata, NewMarketingAdForm } from '@typing/types';
import { authedInstance } from '@utils/axiosClients';

export default class MarketingService {
  static sendLetterToAdvisor(token: string) {
    const instance = authedInstance(token);
    return instance.post('/marketing/branding/advisor');
  }

  static purchasePackage(
    token: string,
    packageName:
      | 'Pro'
      | 'Plus'
      | 'Premium'
      | 'Starter'
      | 'Platinum'
      | 'Diamante',
    whitelabel: 'volindo' | 'flyway'
  ) {
    const instance = authedInstance(token);
    const param = `?whitelabel=${whitelabel}`;
    return instance.post(`/marketing/branding/purchase/${packageName}${param}`);
  }

  static createAd(token: string, formData: NewMarketingAdForm, title: string) {
    const instance = authedInstance(token);

    const uploadFiles: FileMetadata[] = [];

    formData.uploadFiles.forEach(file => {
      const metadata: FileMetadata = {
        extension: file.name?.split('.').pop() || '',
        contentType: file.type,
      };
      uploadFiles.push(metadata);
    });

    const body = {
      title: title,
      social_network: formData.socialNetwork,
      type: formData.type,
      ad_text: formData.adText,
      start_date: formData.startDate,
      end_date: formData.endDate,
      days: formData.days,
      start_time: formData.startTime,
      end_time: formData.endTime,
      budget: formData.budget,
      upload_files: uploadFiles,
      coupon_budget: formData.coupon_budget,
      coupon_name: formData.coupon_name,
      percentage: formData.percentage,
    };

    return instance.post(`marketing/campaigns_manager/campaign`, body);
  }
}
