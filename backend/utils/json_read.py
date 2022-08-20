import json
import os
from pathlib import Path
from django.core.exceptions import ImproperlyConfigured

file_name = 'secrets.json'

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
try:
    with open(os.path.join(BASE_DIR, file_name)) as secrets_file:
        secrets = json.load(secrets_file)
except:
    raise ImproperlyConfigured("Missing {} file in base directory".format(file_name))

def get_secret(setting, secrets=secrets):
    """Get secret setting or fail with ImproperlyConfigured"""
    try:
        return secrets[setting]
    except KeyError:
        raise ImproperlyConfigured("Set the {} setting in {}".format(setting,file_name))