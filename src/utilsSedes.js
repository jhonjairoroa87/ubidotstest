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
        result.reverse();
        var firstData = null;
        var maximoDatos = 2
        var datosIncluidos = 0;
        for(index in result){
               if(firstData == null){
                    firstData = result[index];     
               }
               
               // de los datos traidos del servidor se evalua cual esta en intervalos de 16 minutos
               if((((firstData.timestamp - result[index].timestamp) % (16*60*1000)) == 0) && (datosIncluidos<maximoDatos)){                   
                   var timestamp = result[index].timestamp
                   var date = new Date(timestamp);
                   var dateString = date.getHours() + ':' + date.getMinutes();                   
                   data.push(new Data(dateString, parseInt(result[index].value)));
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
          
           store2.removeAll(true);
           obtenerDatosGeneracionActual(name);
     
     // panel que va a contener el gráfico                                                            
     var panel1 = Ext.create('widget.panel', {
        width : 480
        ,height: 310
        ,x:0,
        y:0,
        //title: 'Diagrama Inicial',
        layout: 'fit',
        items:{
            xtype: 'chart',
            animate: true,            
            shadow: true,
            store: store2,
            axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ['value'],
                title: 'Megavatios por hora',
                grid: true,
                minimum: 0
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['timestamp'],
                title: 'Horas',
                label: {
                    rotate: {
                        degrees: 0
                    }
                }
            }]            
                              
            ,series: [{
                type: 'column',
                axis: 'left',
                gutter: 80,
                xField: 'timestamp',
                yField: ['value'],
                label: {
                  display: 'outside',
                  'text-anchor': 'middle',
                    field: 'value',
                    renderer: Ext.util.Format.numberRenderer('0'),
                    orientation: 'horizontal'
                    //,color: '#333'
                },
                tips: {
                    //trackMouse: true,
                    width: 74,
                    height: 38
                    /*,
                    renderer: function(storeItem, item) {
                        this.setTitle(storeItem.get('value'));
                    }*/
                    
                },renderer: function(sprite, record, attr, index, store) {
                         // default color
                         var color = '#38B8BF';
                         // set title to column
                         this.setTitle(record.data.value);             
                         // eval the color of the last column comparing the previous column value                        
                         if((store.data.items.length > 1) && (index == store.data.items.length - 1) ){                              
                              var currentValue = record.data.value;
                              var previousValue = store.data.items[index-1].data.value;
                              
                              if(currentValue > previousValue){
                                   color = "green"
                              }else if(currentValue == previousValue){
                                   color = "yellow"
                              }else{
                                   color = "red"
                              }                                                                                                              
                         }
                         return Ext.apply(attr, {
                                   fill: color
                                   }); 
                                                       
                    }
            }]
        }
    });     
               
               // modal window que contiene el trafico
               var myWindow = Ext.create("Ext.Window",{
                                width : 500
                                ,height: 350
                                ,title : name                                
                                ,layout: 'absolute'
                                ,closable : true
                                ,modal:true
                                ,items:[panel1]
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
