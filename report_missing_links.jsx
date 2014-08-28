/*

I wrote (see functions at the bottom for credits to other authors' work) this script as a way of quickly opening
up each InDesign file in a folder and its subfolders, checking for missing links and then logging those missing
links to two files.

The first log file itemizes what was found in each file, and the path where the missing link "should" be.

The second log makes a list of missing files by name only, for use by a second script which can search
entire hard drives for those missing links.

--Dan Fitzpatrick

*/

app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;

var g = {}; 
var myFiles = [];
var wontOpenFiles = [];
var missingLinkFiles = [];

chooseFolders();
GetSubFolders(g.sourceFolder);

myReportFolder = g.sourceFolder.name.split("/",1);
myReportFolder = myReportFolder.toString();
myReportFolder = myReportFolder.replace(/%20/g," ");

var myLogPath = File(g.destinationFolder + "/" + myReportFolder + "-- missing.txt");
var myLinksLogPath = File(g.destinationFolder + "/" + myReportFolder + "-- missinglinks-list.txt");

var myLog = makeLogFile(myLogPath,true);
var myLinksLog = makeLogFile(myLinksLogPath,true);

var currentdate = new Date();
var datetime = "Generated " + currentdate.getDate() + "/"
    + (currentdate.getMonth()+1)  + "/" 
    + currentdate.getFullYear() + " at "  
    + currentdate.getHours() + ":"  
    + currentdate.getMinutes() + ":" 
    + currentdate.getSeconds();
                              
log(myLogPath,myReportFolder + " Missing Files Report\r");
log(myLogPath,datetime);
log(myLogPath,"\r\r");

var myFilesLength = myFiles.length;
log(myLogPath,"Script found " + myFilesLength + " Indesign Files\r\r");

var myMissingSummary = [];

for(i=0; i<myFilesLength; i++) {
	try { 
		var myDocument = app.open(File(myFiles[i])) 
			var myLinks = myDocument.links;
			var numLinks = myDocument.links.length;	
			log(myLog, "\rFile " + (i+1).toString() + " of " + myFilesLength + " -- " + myDocument.name +"\r")

		for(var p=0;p<numLinks;p++) {
			if(myLinks[p].status==1819109747) {
			log(myLog, "\t*** Link MISSING *** " + myLinks[p].filePath + "\r")
				myMissingSummary.push(myLinks[p].filePath)
			myLog.execute();
			}		
		}
			myDocument.close();

		} catch(e) {
			log(myLog, "\rFile " + (i+1).toString() + " of " + myFilesLength)
			log(myLog, "\r" + myFiles[i] + "\r" );
			log(myLog,"\t*** ERROR: File Did Not Open\r\r");	
		}

	myLog.execute();
}

myMissingSummary = eliminateDuplicates(myMissingSummary);

log(myLog, "\r\rSummary of Missing Files\r" );
for(k=0;k<myMissingSummary.length;k++){
	log(myLog, myMissingSummary[k] +"\r")
}

for(r=0;r<myMissingSummary.length;r++){
	log(myLinksLog, myMissingSummary[r] +"\r")
}

log(myLog, "\r\r** End of Script **\r" );

myLog.execute();


///////////////////
//// FUNCTIONS ////
///////////////////

// Credit to Raphael Montanaro
// http://stackoverflow.com/users/103281/raphael-montanaro
function eliminateDuplicates(arr) {
  var i,
      len=arr.length,
      out=[],
      obj={};

  for (i=0;i<len;i++) {
    obj[arr[i]]=0;
  }
  for (i in obj) {
    out.push(i);
  }
  return out;
}

// Make a Log File -- from Dave Saunders
// http://jsid.blogspot.com/2006/04/logging-to-text-file.html
function makeLogFile(aName, deleteIt) { 
  var aFile = File(aName);
  	aFile.encoding="UTF-8";

  if (deleteIt) {
    aFile.remove();
    return aFile;
  }
    aFile = File(aName);
  	aFile.encoding="UTF-8";
  	return aFile
}

// Make a Log Entry -- from Dave Saunders
// http://jsid.blogspot.com/2006/04/logging-to-text-file.html
function log(aFile, message) {
  if (!aFile.exists) {
    aFile.open("w");
 aFile.close();
  }
  aFile.open("e");
  aFile.seek(0,2);
  aFile.write(message);
  aFile.close();
}

// Choose Folder Function by Grant Gamble 
// http://gamblecomputersolutions.co.uk/
// http://amzn.com/1460915380
function chooseFolders(){
	g.sourceFolder = Folder.selectDialog("Please select the root folder.");
	if(g.sourceFolder == null){return false;}

	g.destinationFolder = Folder.selectDialog("Select Report destination folder.");
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
