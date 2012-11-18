/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


Ext.define('Ubidots.GenPanel', {
    
    extend: 'widget.panel'
    ,alias: 'widget.genPanel'
    
    
            ,animate: true,
            width : 450
            ,height: 270,
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
    
    //,width:781
    //,height:140
    //,border:false
    //,frame:true// panel fondo azul                   
    //,renderTo: 'container'            
    
    ,initComponent: function() {                                            
        
        this.callParent();                             
        
    }
    
    ,items: []
});