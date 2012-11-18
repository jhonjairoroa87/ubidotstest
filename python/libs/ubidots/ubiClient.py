# -*- coding: utf-8 -*-
from requests.auth import HTTPBasicAuth
import requests
import random

class ConnectionUbidots:

    def __init__(self, server_url='http://dd1.api.ubidots.com'):
        self._token = None
        self.server_url = server_url

    def authLogin(self, user, password):
        rs = requests.post('%s/api/v1/sessions/' % self.server_url, auth=HTTPBasicAuth('woakas', 'asdfasdf'))        
        if rs.status_code == 200:
            self._token = rs.json["token"]
            return True
        return False

    def authKey(self, key):
        headers = {'X-UbidotsApiKey': key}
        rs = requests.post('%s/api/v1/sessions/apikey' % self.server_url, headers=headers)

        if rs.status_code == 200:
            self._token = rs.json["token"]
            return True
        return False

    def _createRequest(self, method, url, data={}):
        headers = {'X-Auth-Token': self._token}
        rs = method('%s%s' % (self.server_url, url), headers=headers, data=data)
        return rs

    def _createJsonRequest(self, method, url, fields={}):
        rs = self._createRequest(method, url, fields)
        return rs.status_code, rs.json

    def getSites(self):
        dr = self._createJsonRequest(requests.get, "/api/v1/sites/")
        if dr[0] == 200:
            return dr[1]
        else:
            return False

    def getVariables(self, site):
        dr = self._createJsonRequest(requests.get, "/api/v1/sites/%s/variables/" % site)
        if dr[0] == 200:
            return dr[1]
        else:
            return False

    def getValues(self, variable):
        dr = self._createJsonRequest(requests.get, "/api/v1/variables/%s/values/" % variable)
        if dr[0] == 200:
            return dr[1]
        else:
            return False
    
    def getValuesPagging(self, variable, pag=1):
        dr = self._createJsonRequest(requests.get, "/api/v1/variables/%s/values/?page=%s" % (variable,pag))
        if dr[0] == 200:
            return dr[1]
        else:
            return False            

    def postValue(self, variable, value, timestamp=None):
        fields = {"value": value}
        if timestamp:
            fields["timestamp"] = timestamp
        dr = self._createJsonRequest(requests.post, "/api/v1/variables/%s/values" % (variable), fields)
        if dr[0] == 200:
            return dr[1]
        else:
            return False

    def postValueRandom(self, variable, limMin=0, limMax=10):
        return self.postValue(variable, random.randint(int(limMin), int(limMax)))

"""
if __name__ == "__main__":

    parser = argparse.ArgumentParser(description='ubiClient para ubidots')

    parser.add_argument('-p', '--point', dest='point', metavar='POINT', required=True, choices=["getSites", "getVariables", "getValues", "postValue", "postValueRandom"],
                        help="Punto de consumo en el api de ubidots:\n\n\tgetSites: Obtiene los sitios de un usuario\n\tgetVariables: argumentos site, Obtiene las variables de un sitio determinado\n\tgetValues: argumentos variable, Obtiene los valores de un id de una variable\n\tpostValues: aguymentos variable, value, timestamp(opcional) se postea un valor de una variable")

    parser.add_argument('-k', '--key', dest='key', metavar='KEY',
                        help='Key para authenticación')

    parser.add_argument('options', metavar='OPT', nargs="*",
                        help='Opciones del punto de consumo')

    args = parser.parse_args()
    c = ConnectionUbidots()
    if args.key:
        c.authKey(args.key)

    r = getattr(c, args.point)(*args.options)

    if not r:
        print ("Error falta llave o autenticación para acceder a este servicio")
    else:
        print r

"""