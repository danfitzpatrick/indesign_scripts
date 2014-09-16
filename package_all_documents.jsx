/*

This script will find every InDesign file in a folder or its subfolders, 
and "package" those documents into a folder that you specify.

Lines 13 thru 21 let you set the parameters, for example whether
you want fonts to be collected as well as graphics. Default is false.

*/

////////////////////////////////////////////
// Set preferences for packaging here

var copyingFonts = false;
var copyingLinkedGraphics = true;
var copyingProfiles = false;
var updatingGraphics = true;
var includingHiddenLayers = true;
var ignorePreflightErrors = true;
var creatingReport = false;
var versionComments = "comment";
var forceSave = false;

var g = {};

chooseFolders();

var myFiles = [];

GetSubFolders(g.sourceFolder);

UserInteractionLevels.INTERACT_WITH_ALL

// app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;

for(i=0; i<myFiles.length; i++) {

var docOpen = app.open(File(myFiles[i]));

folderName = docOpen.name.split(".indd",1); 

var collectFolder = g.destinationFolder.fsName + "/" + folderName;

var mkFolder = new Folder(collectFolder);

VerifyFolder(mkFolder);

var myPackageOk = docOpen.packageForPrint(collectFolder, copyingFonts, 
copyingLinkedGraphics, copyingProfiles, updatingGraphics, includingHiddenLayers, 
ignorePreflightErrors, creatingReport, versionComments, forceSave);

docOpen.close(SaveOptions.no);


}

UserInteractionLevels.INTERACT_WITH_ALL


// Choose Folder Function by Grant Gamble 
// http://gamblecomputersolutions.co.uk/
// http://amzn.com/1460915380

function chooseFolders(){
	g.sourceFolder = Folder.selectDialog("Please select the source folder.");
	if(g.sourceFolder == null){return false;}

	g.destinationFolder = Folder.selectDialog("Please select the destination folder.");
	if(g.destinationFolder == null){return false;}
	
	if(g.sourceFolder.getFiles().length == 0){
		alert("Source folder is empty.");
		return false;
	}
	else{
	return true;
	
	}
}

// Get Files Recursively From Folder
// by Kasyan Servetsky http://www.kasyan.ho.com.ua/

function GetSubFolders(theFolder) {
     var myFileList = theFolder.getFiles();
     for (var i = 0; i < myFileList.length; i++) {
          var myFile = myFileList[i];
          if (myFile instanceof Folder){
               GetSubFolders(myFile);
          }
          else if (myFile instanceof File && myFile.name.match(/\.indd$/i)) {
               myFiles.push(myFile);
          }
     }
}

// by Bob Stucky creativescripting.net and Kasyan 
// Kasyan Servetsky http://www.kasyan.ho.com.ua/

function VerifyFolder(myFolder) {
	if (!myFolder.exists) {
		var myFolder = new Folder(myFolder.absoluteURI);
		var myArray1 = new Array();
		while (!myFolder.exists) {
			myArray1.push(myFolder);
			myFolder = new Folder(myFolder.path);
		}
		myArray2 = new Array();
		while (myArray1.length > 0) {
			myFolder = myArray1.pop();
			if (myFolder.create()) {
				myArray2.push(myFolder);
			} else {
				while (myArray2.length > 0) {
					myArray2.pop.remove();
				}
				throw "Folder creation failed";
			} 
		}
	}
}
