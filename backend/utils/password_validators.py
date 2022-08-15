from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _

class CapsLowerNumberValidator:
    def validate(self, password, user=None):
        if not (any(x.isupper() for x in password) and any(x.islower() for x in password) and any(x.isdigit() for x in password)):
            raise ValidationError(
                _("This password must contain at must contain at least 1 uppercase character,one lowercase character and 1 numeric character."),
                code='no_caps_and_numbers',
            )

    def get_help_text(self):
        return _(
            "Your password must contain at least 1 uppercase character and 1 numeric character."
        )