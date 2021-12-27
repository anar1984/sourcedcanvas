/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function Carrier() {
    this.whoAmI = "";
    this.requirer = "";
    this.execwarder = "";
    this.applier = "";
    this.id = "";
    this.elementId = "";
    this.backlogId = "";
    this.lineId = "";
    this.element=null;
    this.data = {};
}

Carrier.prototype = {
    setElement:function(arg){
      this.element=arg;  
    },
    getElement:function(){
        return this.element;
    },
    setLineId:function(arg){
      this.lineId=arg;  
    },
    getLineId:function(){
        return this.lineId;
    },
    setResult:function(arg){
      this.data['result']= arg;  
    },
    getResult:function(){
      return this.data['result'];  
    },
    setBacklogId:function(arg){
      this.backlogId=arg;  
    },
     getBacklogId:function(arg){
      return this.backlogId ;  
    },
    setElementId:function(arg){
      this.elementId = arg;  
    },
    getElementId:function(){
      return this.elementId;  
    },
    getElementObject:function(){
      return document.getElementById(this.elementId);  
    },
    getData: function () {
        return this.data;
    },
    addData: function (key, value) {
        this.data[key] = value;
    },
    set: function (key, value) {
        this.data[key] = value;
    },
    getValue: function (key) {
        var val = (this.data[key]) ? this.data[key] : "";
        return val;
    },
    get: function (key) {
        var val = (this.data[key]) ? this.data[key] : "";
        return val;
    },
    isKeyTable: function (key) {
        return key.startsWith("_");
    },
    Am_I_Requirer: function () {
        return (this.whoAmI === 'requirer');
    },
    Am_I_Execwarder: function () {
        return (this.whoAmI === 'execwarder');
    },
    Am_I_Applier: function () {
        return (this.whoAmI === 'applier');
    },
    I_am_Requirer: function () {
        this.whoAmI = 'requirer';
    },
    I_am_Execwarder: function () {
        this.whoAmI = 'execwarder';
    },
    I_am_Applier: function () {
        this.whoAmI = 'applier';
    },
    setRequirer: function (arg) {
        this.requirer = arg;
    },
    setExecwarder: function (arg) {
        this.execwarder = arg;
    },
    setApplier: function (arg) {
        this.applier = arg;
    },
    getRequirer: function () {
        return  this.requirer;
    },
    getExecwarder: function () {
         return this.execwarder;
    },
    getApplier: function () {
        return this.applier;
    }
}


var SourcedDispatcher = {

    Exec: function (carrier) {
        if (carrier.Am_I_Requirer() && (carrier.getExecwarder())) {
            var fnName = carrier.getExecwarder();
            let crOut = new Carrier();
            crOut = eval(fnName)(carrier);      
        }else if (carrier.Am_I_Execwarder() && (carrier.getApplier())) {
            var fnName = carrier.getApplier();
            let crOut = new Carrier();
            crOut = eval(fnName)(carrier);      
        }
    }

}