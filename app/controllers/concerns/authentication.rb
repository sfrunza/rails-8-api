module Authentication
  extend ActiveSupport::Concern

  included { before_action :require_authentication }

  class_methods do
    def allow_unauthenticated_access(**options)
      skip_before_action :require_authentication, **options
    end
  end

  private

  def authenticated?
    resume_session
  end

  def require_authentication
    render json: { error: "Unauthorized" }, status: :unauthorized unless authenticated?
  end

  def resume_session
    Current.session ||= find_session_by_cookie
  end

  def find_session_by_cookie
    token = cookies.signed[:session_token]
    session = Session.find_by(token: token)

    return nil if session&.expired?

    session
  end

  def start_new_session_for(user)
    user.sessions.delete_all # or keep multiple devices if you want

    user.sessions.create!(
      user_agent: request.user_agent,
      ip_address: request.remote_ip
    ).tap { |session| set_session_cookie(session) }
  end

  def set_session_cookie(session)
    Current.session = session

    cookies.signed.permanent[:session_token] = {
      value: session.token,
      expires: 7.days.from_now,
      httponly: true,
      same_site: Rails.env.production? ? :lax : :strict,
      secure: Rails.env.production?
    }
  end

  def terminate_session
    Current.session&.destroy
  end
end
