import { Schema } from 'rsuite';

import type {
  BootForgotPasswordType,
  BootSignInType,
  BootSignUpType,
  ConfirmForgotPasswordType,
  FieldSignUpType,
  ForgotPasswordType,
  SignInType,
} from '@typing/types';

export const DEFAULT_SIGN_IN_VALUES: SignInType = {
  email: '',
  password: '',
};

export const DEFAULT_SIGN_UP_VALUES: FieldSignUpType = {
  fields: {
    name: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  },
};

export const DEFAULT_FORGOT_PASSWORD_VALUES: ForgotPasswordType = {
  email: '',
};

export const DEFAULT_CONFIRM_FORGOT_PASSWORD_VALUES: ConfirmForgotPasswordType =
  {
    password_1: '',
    password_2: '',
  };

export const SignInSchema = (boot: BootSignInType) => {
  return Schema.Model({
    email: Schema.Types.StringType()
      .isRequired(boot.required)
      .isEmail(boot.email),
    password: Schema.Types.StringType().isRequired(boot.required),
  });
};

export const SignUpSchema = (boot: BootSignUpType) => {
  return Schema.Model({
    fields: Schema.Types.ObjectType().shape({
      name: Schema.Types.StringType()
        .isRequired(boot.required)
        .pattern(/^[A-Za-zа-яА-Я]+$/, 'Only letters are allowed'),
      email: Schema.Types.StringType()
        .isRequired(boot.required)
        .isEmail(boot.email),
      password: Schema.Types.StringType()
        .isRequired(boot.required)
        .pattern(
          /^(?=.*[ -~])[-A-Za-z\d!@#$%^&*()_+={}\[\]:;"'<>,.?/|\\s]{8,32}$/,
          boot.password
        ),
    }),
  });
};

export const ForgotPasswordSchema = (boot: BootSignInType) => {
  return Schema.Model({
    email: Schema.Types.StringType()
      .isRequired(boot.required)
      .isEmail(boot.email),
  });
};

export const ConfirmForgotPasswordSchema = (boot: BootForgotPasswordType) => {
  return Schema.Model({
    password_1: Schema.Types.StringType()
      .isRequired(boot.required)
      .minLength(8, boot.password_1)
      .maxLength(32, boot.password_1),
    password_2: Schema.Types.StringType()
      .isRequired(boot.required)
      .addRule((value, data) => {
        if (value !== data.password_1) {
          return false;
        }
        return true;
      }, boot.password_2),
  });
};
