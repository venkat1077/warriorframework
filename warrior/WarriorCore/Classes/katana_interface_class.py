from xml.dom import minidom
import requests
import json

__author__ = 'Keenan Jabri'


class KatanaInterface():

    def __init__(self):
        self.getLocation()

    def getLocation(self):
        settingsXml = minidom.parse( '../../Tools/w_settings.xml' )
        settingElems = settingsXml.getElementsByTagName('Setting')
        for i in settingElems:
            if i.attributes['name'].value == 'katana':
                self.katanaLocation = i.attributes['location'].value

    def sendFile( self, fileLocation, toCall ):
        if self.katanaLocation != '':
            jsonObj = { 'fileUrl' : fileLocation, 'toCall' : toCall }
            requests.post( self.katanaLocation, jsonObj )
