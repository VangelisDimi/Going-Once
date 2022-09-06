from textwrap import indent
from rest_framework.renderers import JSONRenderer
import rest_framework.renderers as renderers
# import xml.etree.cElementTree as ET
import lxml.etree as ET

class CustomJSONRenderer(JSONRenderer):    
    def get_indent(self, accepted_media_type, renderer_context):
        return 4

class CustomXMLRenderer(renderers.BaseRenderer):
    media_type = 'application/xml'
    format = 'xml'
    charset = 'utf-8'

    def render(self, data, accepted_media_type=None, renderer_context=None):
        if data is None:
            return ''
        return ET.tostring(data,encoding='utf8', method='xml',pretty_print=True, xml_declaration = True)