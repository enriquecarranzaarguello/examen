import config from '@config';

interface AwsMobileConfig {
  aws_project_region: any;
  aws_cognito_region: any;
  aws_cognito_identity_pool_id: any;
  aws_user_pools_id: any;
  aws_user_pools_web_client_id: any;
  oauth: {
    domain: any;
    scope: any;
    redirectSignIn: any;
    redirectSignOut: any;
    responseType: 'code' | 'token';
  };
}

const awsmobile: AwsMobileConfig = {
  aws_project_region: config.cognito_region,
  aws_cognito_region: config.cognito_region,
  aws_cognito_identity_pool_id: config.cognito_identity_pool_id,
  aws_user_pools_id: config.cognito_user_pool_id,
  aws_user_pools_web_client_id: config.cognito_app_client_id,
  oauth: {
    domain: config.cognito_domain,
    scope: config.cognito_scope,
    redirectSignIn: process.env.BASE_DASHBOARD,
    redirectSignOut: process.env.BASE_DASHBOARD,
    responseType: 'code', // or 'token', note that REFRESH token will only be generated when the responseType is code
  },
};

export default awsmobile;
