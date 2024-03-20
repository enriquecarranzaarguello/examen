import { AgentEditProfileType, ProfileTypeBackend } from '@typing/types';
import { agentMultipartRequest, agentRequest } from '@utils/axiosClients';
import { FileType } from 'rsuite/esm/Uploader';

export default class AgentService {
  static getAgent_id(email: string) {
    return agentRequest({
      method: 'POST',
      url: '/get_agent_id',
      data: {
        account_email: email,
      },
    });
  }

  static getEmailByAgent_id(agent_id: string) {
    return agentRequest({
      method: 'GET',
      url: `/email/${agent_id}`,
    });
  }

  static getAgentProfile(agent_id: string) {
    return agentRequest({
      method: 'GET',
      url: `/${agent_id}`,
    });
  }

  static editAgentProfile(agent_id: string, editedAgent: AgentEditProfileType) {
    const newData: ProfileTypeBackend = {
      full_name_account: editedAgent.full_name,
      address_full: editedAgent.address || '',
      address_city: editedAgent.city || '',
      address_state_province: editedAgent.state_province || '',
      address_country: editedAgent.country || '',
      address_zip_code: editedAgent.zip_code || '',
      phone_country_code: editedAgent.phone_country_code || '',
      phone_number: editedAgent.phone_number || '',
      birthday: editedAgent.birthday || '',
      web_site: editedAgent.web_site || '',
      url_facebook: editedAgent.url_facebook || '',
      url_instagram: editedAgent.url_instagram || '',
      url_whatsapp: editedAgent.url_whatsapp || '',
      languages: editedAgent.languages,
      area_specialize: editedAgent.area_specialize,
      type_specialize: editedAgent.type_specialize,
      description: editedAgent.description,
    };

    return agentRequest({
      method: 'PUT',
      url: `/${agent_id}`,
      data: newData,
    });
  }

  static updatePhoneNumber(
    agent_id: string,
    phone_number: string,
    phone_country_code: string
  ) {
    return agentRequest({
      method: 'PUT',
      url: `/phone/${agent_id}`,
      data: {
        phone_number,
        phone_country_code,
      },
    });
  }

  static uploadProfilePhoto(agent_id: string, photo: File) {
    const formData = new FormData();
    formData.append('photoFile', photo);

    return agentMultipartRequest({
      method: 'PUT',
      url: `/photo/${agent_id}`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: progressEvent => {
        let progress = 0;
        if (progressEvent.total !== undefined)
          progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
        console.log(`Progreso de subida: ${progress}%`);
      },
    });
  }

  static uploadPost(
    agent_id: string,
    images: FileType[],
    description: string,
    city: string,
    country: string
  ) {
    const data = {
      description,
      city,
      country,
      imagesMetadata: images.map(image => {
        return {
          extension: image.name?.split('.').pop(),
          contentType: image.blobFile?.type,
        };
      }),
    };

    return agentRequest({
      method: 'POST',
      url: `/post/${agent_id}`,
      data: data,
    });
  }

  static getSimplePostsByAgentId(agent_id: string) {
    return agentRequest({
      method: 'GET',
      url: `/post/${agent_id}`,
    });
  }

  static getIndividualPost(uuid: string) {
    return agentRequest({
      method: 'GET',
      url: `/post/individual/${uuid}`,
    });
  }

  static isCorrectPublicProfile(email: string, fullname_encoded: string) {
    return agentRequest({
      method: 'GET',
      url: '/public',
      params: {
        email,
        fullname_encoded,
      },
    });
  }

  static getAgentPublicProfile(email: string) {
    return agentRequest({
      method: 'GET',
      url: `/public/${email}`,
    });
  }

  static sendLetterToAgent(
    emailAgent: string,
    fullname: string,
    email: string,
    phone_number: string,
    message: string
  ) {
    return agentRequest({
      method: 'POST',
      url: `/utils/send_letter/${emailAgent}`,
      data: {
        fullname,
        phone_number,
        email,
        message,
      },
    });
  }

  static updatePostByUUID(
    uuid: string,
    description: string,
    country: string,
    city: string
  ) {
    return agentRequest({
      method: 'PUT',
      url: `/post/individual/${uuid}`,
      data: {
        description,
        country,
        city,
      },
    });
  }

  static deleteImageByUUIDAndIndex(uuid: string, imageIndex: number) {
    return agentRequest({
      method: 'DELETE',
      url: `/post/individual/${uuid}/${imageIndex}`,
    });
  }
}
