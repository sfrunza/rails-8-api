class PasswordsMailer < ApplicationMailer
  def reset(user)
    @user = user
    @reset_url =
      "http://localhost:3000/auth/reset-password?token=#{@user.password_reset_token}"
    mail subject: "Reset your password", to: @user.email_address
  end
end
