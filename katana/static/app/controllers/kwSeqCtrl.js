    app.controller('KwSeqCtrlNew', ['$scope','$routeParams','$http', '$location', 'KwSeqFactCtrl', 'fileFactory', 'subdirs',
        function ($scope, $routeParams, $http, $location, KwSeqFactCtrl, fileFactory, subdirs) {

        'use strict';

        $scope.items = [];
        $scope.disabled= true;
        $scope.disKwname= false;
        $scope.disAcfname= false;
        $scope.disWdesc= false;
        $scope.myvalue = false;
        $scope.myvalue1 = true;
        $scope.myFlag = 2;
        $scope.myFlagPop = 0;
        $scope.keyVal = false;
        $scope.subdirs = subdirs;
        $scope.xml = {};
        $scope.xml.file = '';
        $scope.xml.json = '';
        $scope.xml.pycs = {};
        $scope.xml.args = {};
        $scope.xml.mapargs = {};
        $scope.xml.arglist = [];
       // $scope.showTab = false;
        var stringvar=[];


        function readTestCaseFile() { 
        
             KwSeqFactCtrl.fetch()
            .then(function (data) {
                $scope.xml.file = data.xml;
                $scope.xml.pycs = data.pycmts;
               
                $scope.xml.drivers = _.sortBy(_.keys(data.pycmts), function (d) { return d; });
                                    
                 $scope.xml.keywords = {};
             });
        }

        readTestCaseFile();


        $scope.resetVal = function () {

        if($scope.myFlag == 0){

            $scope.disKwname= true;
            $scope.disAcfname= true;
            $scope.disWdesc= true;
            }

        else{

         $scope.status.wkeywordname = '';
         $scope.status.actionfilename = '';
         $scope.status.wdesc = '';
            }

         $scope.status.subkwname = '';
         $scope.status.subkwargs = '';
         $scope.status.xml.arglist = '';
         $scope.status.xml.mapargs = '';
         $scope.status.xml.args = '';


        };

        $scope.hasNoSteps = function () {

            return $scope.status.length === 0;          
        };

        $scope.cancelReq = function () {

            $scope.status.wkeywordname = '';
            $scope.status.actionfilename = '';
            $scope.status.wdesc = '';

        };

        $scope.showEditor = function () {

            return $scope.status.step_edit_mode != 'None';

        };

        $scope.cancelArguments = function () {

           $location.path('/kwseq');

        };


        $scope.driverSelected = function (subkwname) {

          if($scope.status.subkwname != subkwname){
             $scope.xml.subkwargss = '';
             $scope.status.subkwargs = '';
             $scope.status.xml.arglist = '';
             $scope.status.xml.mapargs = '';
             $scope.status.xml.args = '';
          }

            var drivers = $scope.xml.pycs[subkwname];
            var ads = [];
            _.each(drivers, function (driver) {
                ads.push(_.filter(driver, function(d) {
                    return d.type === 'fn' && d.fn !== '__init__';
                }));
            });
            var kwds = _.flatten(ads);
            kwds = _.sortBy(kwds, function(r) {return r.fn});
            $scope.xml.subkwargss = kwds;     

            return kwds;
        };


        $scope.selectsubkwargs = function (subkwargs) {

        if($scope.status.subkwargs == null){
             $scope.status.subkwargs = '';
             $scope.status.xml.arglist = '';
             $scope.status.xml.mapargs = '';
             $scope.status.xml.args = '';
          }
            
            console.log('In selectsubkwargs(' + subkwargs + ')');
            var k = _.findWhere ($scope.xml.subkwargss, { fn: subkwargs });
            
            $scope.xml.args = _.where($scope.xml.subkwargss, { fn: subkwargs })[0];
            $scope.xml.arglist = _.map($scope.xml.args.args, function (a) {
                return a.split('=')[0];
            });
            $scope.xml.mapargs = {};
            _.each($scope.xml.arglist, function (v) {

                $scope.xmlmapargs[v] = '';

            });

            console.log('xml.args', JSON.stringify($scope.xml.args));


            return $scope.xml.args;
       
        };

        $scope.status = {

            "wkeywordname" :"",
            "actionfilename": "",
            "wdesc":""

        };

        $scope.saveArguments = function () {

            $scope.myFlag = 1;

            if($scope.status.wkeywordname === undefined || $scope.status.actionfilename === undefined || 
                $scope.status.wdesc === undefined || $scope.status.subkwname === undefined || 
                $scope.status.subkwname == '' || $scope.status.subkwargs === undefined || 
                $scope.status.subkwargs == ''){
                sweetAlert({
                    title: "Kindly fill the mandatory fields.",
                    closeOnConfirm: true,
                    confirmButtonColor: '#3b3131',
                    confirmButtonText: "Ok",
                    type: "warning"
                }); 

                
            }

            else{

            $scope.disKwname= true;
            $scope.disAcfname= true;
            $scope.disWdesc= true;

            var x2js = new X2JS();
            var token = angular.toJson($scope.status);
            $scope.xmlObj = x2js.json2xml_str(JSON.parse(token));
            $scope.items.push($scope.status.subkwname + " & " + $scope.status.subkwargs);
          
             $scope.disabled = false;  
             $scope.myvalue = true;  
             $scope.myvalue1 = false;

          /*  KwSeqFactCtrl.save($scope.xmlObj)
                .then(
                    function(data) {
                        console.log(data);
                             
                     })*/
                     
             $scope.toAppendData($scope.xmlObj); 
             $scope.keyVal = true;
            // $scope.showTab = true;
             $scope.myFlag = 0;
         }
               
        };


       $scope.toAppendData = function(objVal){

        $scope.myFlagPop = 1;
        var newval = objVal;
        stringvar = stringvar+newval;
        $scope.toFramework(stringvar); 
             
       };


       $scope.toFramework = function (stringvar) {

        var finall = stringvar;

        if($scope.myFlag == 0)
        {
           sweetAlert({
                  title: "Wrapper Keyword Saved successfully.",
                  closeOnConfirm: true,
                  confirmButtonColor: '#3b3131',
                  confirmButtonText: "Ok",
                  type: "success"
              }); 
        }
        
        };  


       $scope.insertAntKW = function(){
          $scope.disabled = true; 
          $scope.myvalue1 = true;
          $scope.status.subkwname = '';
          $scope.status.subkwargs = '';
          $scope.status.xml.arglist = '';
          $scope.status.xml.mapargs = '';
          $scope.status.xml.args = '';
          $scope.status.xml.args.def = '';
          
           };


    }]);




