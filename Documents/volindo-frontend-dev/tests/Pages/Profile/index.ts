import { Page, Locator } from 'playwright';

class EditModal {
  private readonly page: Page;

  private readonly title: Locator;

  private readonly submitButton: Locator;

  private readonly nameField: Locator;

  private readonly emailField: Locator;

  private readonly addressField: Locator;

  private readonly closeButton: Locator;

  private readonly confirmModalTitle: Locator;

  private readonly confirmButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('edit-modal-title');
    this.submitButton = page.getByTestId('edit-modal-submit');
    this.nameField = page.getByTestId('edit-modal-name');
    this.emailField = page.getByTestId('edit-modal-email');
    this.addressField = page.getByTestId('edit-modal-address');
    this.closeButton = page.getByTestId('edit-modal-close');
    this.confirmModalTitle = page.getByTestId('info-popup-title');
    this.confirmButton = page.getByTestId('info-popup-ok-button');
  }
  // locators

  getTitle() {
    return this.title;
  }

  getSubmitButton() {
    return this.submitButton;
  }

  getName() {
    return this.nameField;
  }

  getEmail() {
    return this.emailField;
  }

  getAddress() {
    return this.addressField;
  }

  getConfirmModalTitle() {
    return this.confirmModalTitle;
  }

  // acations

  // fillModal(profileInfo: ProfileInfo) {
  //   return this.page.fill(this.nameField, profileInfo.name);
  // }

  clickSubmit() {
    return this.submitButton.click();
  }

  clickConfirmButton() {
    return this.confirmButton.click();
  }
}

class ShareModal {
  private readonly page: Page;

  private readonly title: Locator;

  private readonly link: Locator;

  private readonly copyLink: Locator;

  private readonly socials: Locator;

  private readonly close: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = this.page.getByTestId('modal-share-profile-title');
    this.link = this.page.getByTestId('modal-share-profile-copy-link');
    this.copyLink = this.page.getByTestId('modal-share-profile-copy-button');
    this.socials = this.page.getByTestId('modal-share-profile-socials');
    this.close = this.page.getByTestId('modal-share-profile-close');
  }

  // locators

  getTitle() {
    return this.title;
  }

  getLink() {
    return this.link;
  }

  getCopyButton() {
    return this.copyLink;
  }

  getSocials() {
    return this.socials;
  }

  // actions

  clickClose() {
    return this.close.click();
  }
}

class Profile {
  private readonly page: Page;

  private readonly editModal: EditModal;

  private readonly shareModal: ShareModal;

  private readonly email: Locator;

  private readonly personalInfo: Locator;

  private readonly agentProfile: Locator;

  private readonly walletSelector: Locator;

  private readonly agentAbout: Locator;

  private readonly walletAbout: Locator;

  private readonly tabControls: Locator;

  private readonly userName: Locator;

  private readonly walletWithdraw: Locator;

  private readonly editProfile: Locator;

  private readonly shareButton: Locator;

  private readonly shareModalContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.editModal = new EditModal(page);
    this.shareModal = new ShareModal(page);

    this.userName = page.getByTestId('profile-user-name');
    this.email = page.getByTestId('profile-user-email');
    this.personalInfo = page.getByTestId('profile-personal-info');
    this.agentProfile = page.getByTestId('profile-agent-selector');
    this.walletSelector = page.getByTestId('profile-wallet-selector');
    this.tabControls = page.getByTestId('profile-tab-controls');
    this.agentAbout = page.getByTestId('profile-about-section');
    this.walletAbout = page.getByTestId('profile-wallet-about');
    this.walletWithdraw = page.getByTestId('profile-wallet-withdraw');
    this.editProfile = page.getByTestId('profile-edit-button');
    this.shareButton = page.getByTestId('profile-share-button');
    this.shareModalContainer = page.getByTestId('modal-share-profile');
  }

  // Locators

  getEditModal() {
    return this.editModal;
  }

  getUserName() {
    return this.userName;
  }

  getEmail() {
    return this.email;
  }

  getTabControls() {
    return this.tabControls;
  }

  getAboutSection() {
    return this.agentAbout;
  }

  getWalletAbout() {
    return this.walletAbout;
  }

  getPersonalInfo() {
    return this.personalInfo;
  }

  getUserEmail() {
    return this.email;
  }

  getWalletWithdraw() {
    return this.walletWithdraw;
  }

  getShareModal() {
    return this.shareModalContainer;
  }

  getShareModalComp() {
    return this.shareModal;
  }

  clickAgentSlelector() {
    return this.agentProfile.click();
  }

  clickWalletSelector() {
    return this.walletSelector.click();
  }

  clickShareButton() {
    return this.shareButton.click();
  }

  clickEditProfile() {
    return this.editProfile.click();
  }
}

export default Profile;
