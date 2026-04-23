class Api::V1::SessionsController < ApplicationController
  allow_unauthenticated_access only: %i[create auto_login]

  rate_limit to: 10, within: 3.minutes, only: :create, with: -> {
    render json: { error: "Too many login attempts. Try again later." },
           status: :too_many_requests
  }

  def create
    if user = User.authenticate_by(params.permit(:email_address, :password))
      start_new_session_for(user)

      render json: {
        user: UserSerializer.new(user)
      }, status: :created
    else
      render json: { error: "Invalid email address or password" }, status: :unauthorized
    end
  end

  def auto_login
    token = params[:token]

    unless token.present?
      render json: { error: "Token is required" }, status: :bad_request
      return
    end

    user = User.find_by(login_token: token)

    unless user&.login_token_valid?(token)
      render json: { error: "The link is invalid or has expired" }, status: :unauthorized
      return
    end

    handle_successful_authentication(user)

    # Optional: invalidate token to make it single-use
    # user.invalidate_login_token!
  end

  def show
   handle_successful_authentication(Current.user)
  end

  def destroy
    terminate_session
    head :no_content
  end

  private

  def handle_successful_authentication(user)
    unless user.active?
      render json: { error: "Account is not active" }, status: :forbidden
      return
    end

    start_new_session_for(user)
    render json: { user: current_user_json }, status: :created
  end

  def current_user_json
    UserSerializer.new(Current.user)
  end
end
