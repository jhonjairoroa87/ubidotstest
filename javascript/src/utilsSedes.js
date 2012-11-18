// googleMapsUtils 'static class'
var googleMapsUtils = {  
 nuevoMarcador:function(myLatlng, map, titulo){  
      var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            animation: google.maps.Animation.DROP,
            title:titulo
          });
      return marker; 
 }
}

// funcion que toma los datos recibidos del servidor y los procesa segun logica de negocio
function generateData3(result){        
        var data = [];
        //var resultLength = result.length - 1;
        //result.reverse();
        var firstData = null;
        var maximoDatos = 2
        var datosIncluidos = 0;
        for(index in result){
               if(firstData == null){
                    firstData = result[index];     
               }
               
               // de los datos traidos del servidor se evalua cual esta en intervalos de 16 minutos
               //if((((firstData.timestamp - result[index].timestamp) % (16*60*1000)) == 0) && (datosIncluidos<maximoDatos)){
               if(datosIncluidos<maximoDatos){                   
                   var timestamp = result[maximoDatos-1-index].timestamp
                   var date = new Date(timestamp);
                   var dateString = date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();                   
                   data.push(new Data(dateString, parseInt(result[maximoDatos-1-index].value)));
                   datosIncluidos++;
               
               }               
               
        }          
                
        return data;
    };
    
// funcion que organiza la informacion en el store
function loadArray3(result){
        finaldata = generateData3(result);        
        finalArrayData = new Array();        
        for(i=0;i<finaldata.length;i++){            
            finalArrayData.push(finaldata[i].value);
        }                
        store2.loadData(finaldata);        
        return finalArrayData;
        
    }    

// store en el cual se almacenan los datos traidos del servidor    
var store2 = Ext.create('Ext.data.JsonStore', {
     fields: ['timestamp', 'value'],
     data: {}
}); 

// sedeUtils 'static class'
var sedesUtils = {
     //metodo que carga las sedes para mostrarla en el mapa
     cargueInicialSedes: function (myDataArray,geocoder, map){
          for( i in myDataArray){          
               var mySedeObj = myDataArray[i];          
               sedesUtils.nuevaSede(geocoder, map, mySedeObj.lat, mySedeObj.lng , mySedeObj.name);          
          }
     }
     // metodo que adiciona una nueva sede en el mapa
      ,nuevaSede: function ( geocoder, map, latitude, longitude, name){
          
        var myLatlng = new google.maps.LatLng(latitude,longitude);
        var myMarker = googleMapsUtils.nuevoMarcador(myLatlng,map,name);               
          
           google.maps.event.addListener(myMarker, 'click', function(){
               
               var chart15min = Ext.create('Ubidots.GenChart');
               var chart1h    = Ext.create('Ubidots.GenChart');
               var chart1d    = Ext.create('Ubidots.GenChart');                
                                                        
     
     var tabs = Ext.create('Ext.tab.Panel', {
        //renderTo: 'tabs1',        
        //title: 'Diagrama Inicial',
        layout: 'fit',
        activeTab: 0,
        defaults :{
          bodyPadding: 10
        },
        items: [{
            //contentEl:'script', 
            title: 'last 15 min'//,
            ,
                listeners: {
                    activate: function(tab){
                        //console.log("hola");
                        store2.removeAll(true);
                         //obtenerDatosGeneracionActual(name);
                         obtenerDatosGeneracionActual(name+'15min');    
                    }
                }
            ,items:[chart15min]
            //closable: true
        },{
            //contentEl:'script', 
            title: 'last hour'//,
            ,items:[chart1h]
            ,
                listeners: {
                    activate: function(tab){
                        //console.log("hola");
                        store2.removeAll(true);
                         //obtenerDatosGeneracionActual(name);
                         obtenerDatosGeneracionActual(name+'1h');    
                    }
                }   
            //closable: true
        },{
            //contentEl:'script', 
            title: 'last day'//,
            ,items:[chart1d]
            ,
                listeners: {
                    activate: function(tab){
                        //console.log("hola");
                        store2.removeAll(true);
                         //obtenerDatosGeneracionActual(name);
                         obtenerDatosGeneracionActual(name+'1d');    
                    }
                }   
            //closable: true
        }]
    });
               
               // modal window que contiene el trafico
               var myWindow = Ext.create("Ext.Window",{
                                width : 500
                                ,height: 350
                                ,title : name
                                ,resizable   : false
                                ,layout: 'absolute'
                                ,closable : true
                                ,modal:true
                                ,items:[tabs]
                                
                                //,items:[panel1]
                            }).show();
          });
                      
    }
}





// funcion para poner datos en el grafico
function cargarDatosEnGrafico(result){
     loadArray3(result.values);
}

// metodo que obtiene las variables, la compara con un nombre de variable ingresado y muestra en pantalla la informacion de dicha variable
function obtenerIdVariableByNombre(result, nombreVariable){
    var returnVariableId = null;
    for(index in result.variables){
          if(result.variables[index].name == nombreVariable){
               returnVariableId = result.variables[index].id;
               break;
          }
    }
    console.log("returnVariableId")
    console.log(returnVariableId)
    get_values_callback(returnVariableId, cargarDatosEnGrafico);    
}

// funcion para obtener las variables del servidor de ubidots y mostrarlos en pantalla
function obtenerDatosGeneracionActual(nombreVariable){
    var myKey = 'a45de6da5eea4d28bd50988e064c98ed87442016';
    
    login_url_with_token_and_callback(myKey, init);
    
    function init(token){
        //get_sites();
       get_variables_and_compare_name_callback("test.com", obtenerIdVariableByNombre,nombreVariable );
        
    }
}
