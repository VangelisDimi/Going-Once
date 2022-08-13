def user_authentication_rule(user):
    return user is not None and user.is_active #and user.is_approved