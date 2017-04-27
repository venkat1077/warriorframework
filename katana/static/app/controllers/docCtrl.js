/*
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

app.controller('docsCtrl', ['$scope', '$http', 'fileFactory', '$window', function($scope, $http, fileFactory, $window) {

    $scope.cfg = {};
    $scope.path = "";
    $scope.pathUG = "";
    $scope.default_paths = {
        "pythonsrcdir": "Warrior"
    };
    $scope.orig = {

        pythonsrcdir: ""

    };


    $scope.loadGuide = function() {

         $scope.osFinder = location.hostname;
        
        if($scope.cfg.pythonsrcdir==''){
            sweetAlert({
            title: "Since Katana has not been configured yet, it would not be able to open up any Warrior documentation. Please go to the Configuration Tab to fill in the relevant information and then you will be able to access the documentation.",
            closeOnConfirm: false,
            confirmButtonColor: '#3b3131',
            confirmButtonText: "Ok",
            type: "warning"
        });
        }
        else {

         if($scope.osFinder == "localhost"  || $scope.osFinder == "0.0"){
            $scope.pathUG = $scope.cfg.pythonsrcdir + "/Docs/Warrior_Framework_UserGuide_Rel8.pdf";
            $scope.pathUrl= $scope.pathUG.replace(/\\/g, "/");
            $scope.checkPath = "file:///"+$scope.pathUrl;
            var s = $scope.checkPath;
            var i = s.indexOf("/");
            if (i != -1) {
                $scope.newGuide = s.substring(i, s.length);
            }

            guideSplit();
            fileFactory.myGuide($scope.pathGuide)
                .then(
                     function(data) {
                     });
         
         }

         else {
            $scope.pathUG = $scope.cfg.pythonsrcdir + "/Docs/Warrior_Framework_UserGuide_Rel8.pdf";
            var s = $scope.pathUG;
            var i = s.indexOf("/");
            if (i != -1) {
                $scope.newGuide = s.substring(i, s.length);
            }
            guideSplit();
            fileFactory.myGuideLinux($scope.pathGuide)
                .then(
                     function(data) {
                     })

         }
     }

      };

    function guideSplit(){
        var array = [];
        if($scope.newGuide.indexOf("\\")>= 0) {
            array = $scope.newGuide.split("\\");
        }
        else {
            array = $scope.newGuide.split("/");
        }
        var path = "";
        for(var i=0; i<array.length-1; i++){
            path = path + array[i] + ">"
        }
        $scope.pathGuide = path.replace(/\>$/, '');
        $scope.pathGuide = $scope.pathGuide + ">Warrior_Framework_UserGuide_Rel8.pdf";
    }

   $scope.loadDocs = function() {
         $scope.osFinder = location.hostname;
       
        if($scope.cfg.pythonsrcdir==''){
            sweetAlert({
            title: "Since Katana has not been configured yet, it would not be able to open up any Warrior documentation. Please go to the Configuration Tab to fill in the relevant information and then you will be able to access the documentation.",
            closeOnConfirm: false,
            confirmButtonColor: '#3b3131',
            confirmButtonText: "Ok",
            type: "warning"
        });
        }
        else {
         if($scope.osFinder == "localhost"  || $scope.osFinder == "0.0"){
           $scope.pathUG = $scope.cfg.pythonsrcdir + "/Docs/build/html/warrior_index.html";
            $scope.pathUrl= $scope.pathUG.replace(/\\/g, "/");
            $scope.checkPath = "file:///"+$scope.pathUrl;
            var s = $scope.checkPath;
            var i = s.indexOf("/");
            if (i != -1) {
                 $scope.newDoc = s.substring(i, s.length);
            }

            docSplit();
            fileFactory.myDoc($scope.pathDoc)
                .then(
                      function(data) {
                      });
          
         }

        else {

            $scope.pathUG = $scope.cfg.pythonsrcdir + "/Docs/build/html/warrior_index.html";
            var s = $scope.pathUG;
            var i = s.indexOf("/");
            if (i != -1) {
                $scope.newDoc = s.substring(i, s.length);
            }
            docSplit();
            fileFactory.myDocLinux($scope.pathDoc)
                .then(
                     function(data) {
                     })

         }
}
        };


    function docSplit(){
        var array = [];
        if($scope.newDoc.indexOf("\\")>= 0) {
            array = $scope.newDoc.split("\\");
        }
        else {
            array = $scope.newDoc.split("/");
        }
        var path = "";
        for(var i=0; i<array.length-1; i++){
            path = path + array[i] + ">"
        }
        $scope.pathDoc = path.replace(/\>$/, '');
        $scope.pathDoc = $scope.pathDoc + ">warrior_index.html";

    }



    function readConfig() {
        $http.get('/readconfig')
            .success(function(data, status, headers, config) {
                $scope.cfg = data;
                $scope.orig.pythonsrcdir = $scope.cfg.pythonsrcdir;
            })
            .error(function(data, status, headers, config) {
                alert("Error fetching config data. ", status, headers);
            });
    }

    readConfig();
 


}]);
