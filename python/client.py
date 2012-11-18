# -*- coding: utf-8 -*-

import os
import sys

APP_DIR = os.getcwd() #lee path en el cual corre este script
#print "APP_DIR: " , APP_DIR

sys.path.insert(0, APP_DIR +os.sep+"libs")

from ubidots.ubiClient import ConnectionUbidots
from argparse import argparse

import datetime

def procesarDataOriginalA15minutos1hora1dia(variableObject, connectionUbidotsObject, idDestinVariable, timeunit):
        
    idVariable = variableObject["id"]
    nameVariable = variableObject["name"]
        
    print "idVariable: " , idVariable
    print "nameVariable: " , nameVariable
    
    
        
    valuesReturn1 = c.getValues(idVariable)
    #valuesReturn = c.getValuesPagging(idVariable)
        
    print "valuesReturn1"
    print valuesReturn1
    pageTotal  =  valuesReturn1["meta"]["num_pages"]
    print "pageTotal"
    print pageTotal
    print "valuesReturn1['values']:"
    print valuesReturn1["values"]
    
    firstData = None
    firstLoop = False
    listadoGrupoValores = []
    
    for currentPage in range(1, pageTotal):
    #for currentPage in range(1, 5):
        valuesReturn = c.getValuesPagging(idVariable, currentPage)
        #print "valuesReturn"
        #print valuesReturn
        #print "valuesReturn['values']:"
        #print valuesReturn["values"]
        
        listadoTotalValores = valuesReturn["values"]
        listadoTotalValores.extend(listadoGrupoValores)
        
        
        for valueReturnValue in listadoTotalValores:        
            if(firstData == None):
                firstData = valueReturnValue;                    
            
            print "valueReturnValue['timestamp']:"
            print valueReturnValue['timestamp']
            myDatetime = datetime.datetime.fromtimestamp(valueReturnValue['timestamp']/1000)
            #print "myDatetime: "
            #print myDatetime
            listadoGrupoValores.append(valueReturnValue)
            ##if (((firstData["timestamp"] - valueReturnValue["timestamp"]) % timeunit) == 0):
            if (len(listadoGrupoValores) >= timeunit):
                if firstLoop is False:
                    firstLoop = True
                    listadoGrupoValores.remove(valueReturnValue)
                else:
                    print "hola"
                    acum15min = float(0)
                    for intervalDateObject in listadoGrupoValores:
                        acum15min = acum15min + float(intervalDateObject["value"])
                    print "acum15min"
                    print acum15min
                    print "listadoGrupoValores[0]['timestamp']"
                    print listadoGrupoValores[0]['timestamp']
                    result = connectionUbidotsObject.postValue(idDestinVariable, acum15min, listadoGrupoValores[0]['timestamp'])
                    print "result"
                    print result
                    listadoGrupoValores = []
                
                
class Data:
    def __init__(self,timestamp, value):
        self.timestamp = timestamp
        self.value = value

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

    #r = getattr(c, args.point)(*args.options)
    
    relationedvariables = []
        
    siteReturn = c.getSites()
    
    print "siteReturn"
    print siteReturn
    print "siteReturn['sites']"
    print siteReturn['sites']
    
    for site in siteReturn['sites']:                
        siteId = site["domain"]    
        print "siteId"
        print siteId
            
    variablesReturn = c.getVariables(siteId)
    
    #for variableReturn in variablesReturn["variables"]:
    
    
    print "variablesReturn"
    print variablesReturn
    
    for variableReturn in variablesReturn["variables"]:
        idVariable = variableReturn["id"]
        nameVariable = variableReturn["name"]
        
        print "idVariable: " , idVariable
        print "nameVariable: " , nameVariable
        
        #valuesReturn = c.getValues(idVariable)
        #valuesReturn = c.getValuesPagging(idVariable)
        
        #print "valuesReturn"
        #print valuesReturn
        #pageCount  =  valuesReturn["meta"]["num_pages"]
        #print "pageCount"
        #print pageCount
        #print "valuesReturn['values']:"
        #print valuesReturn["values"]
        #if nameVariable == 'gen1':
        ## carga con datos el gen115min            
        #procesarDataOriginalA15minutos1hora1dia(variableReturn, c, '12124', 8 )
            
        ## carga con datos el gen11h
        #procesarDataOriginalA15minutos1hora1dia(variableReturn, c, '12125', 30 )
            
        ## carga con datos el gen11d
        #procesarDataOriginalA15minutos1hora1dia(variableReturn, c, '12115', 24*60/2 )
        
        ## carga con datos el gen215min            
        procesarDataOriginalA15minutos1hora1dia(variableReturn, c, '12116', 8 )
            
        ## carga con datos el gen21h
        procesarDataOriginalA15minutos1hora1dia(variableReturn, c, '12117', 30 )
            
        ## carga con datos el gen21d
        procesarDataOriginalA15minutos1hora1dia(variableReturn, c, '12118', 24*60/2 )
        
        ## carga con datos el gen315min            
        procesarDataOriginalA15minutos1hora1dia(variableReturn, c, '12119', 8 )
            
        ## carga con datos el gen31h
        procesarDataOriginalA15minutos1hora1dia(variableReturn, c, '12120', 30 )
            
        ## carga con datos el gen31d
        procesarDataOriginalA15minutos1hora1dia(variableReturn, c, '12121', 24*60/2 )
            
            
        
    
    """
    if not r:
        print ("Error falta llave o autenticación para acceder a este servicio")
    else:
        print r
    """