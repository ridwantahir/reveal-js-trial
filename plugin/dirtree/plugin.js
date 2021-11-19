
 RevealDirTree = {
    id: 'RevealDirTree',
    init: function(deck) {
        initDirTree(deck);
    }
};
const initDirTree = function(Reveal){
    function unique(item, index, array) {
      return array.indexOf(item) == index;
  }
  const jsonize = function(dirs, parentDir){
      let immchildren = dirs
      .map(d => d.replaceAll("\\", "/").split("/").shift().trim())
      .filter(de => de)
      .filter(unique)
      .map(c => {
          let nextParent = {'name': c}
          let nextDirs = dirs
          .map(td => td.replaceAll("\\", "/").split("/"))
          .filter(td2 => td2.shift() === c)
          .map(td3 => td3.join("/"))
          jsonize(nextDirs, nextParent)
          return nextParent
      })
      parentDir.children = immchildren 
  }
  const generateDirTree = function(dirTree, pref, activePath, parentHist, callback){
      let curPref = pref + '├── '
      let curPrefLastChild = pref + '└── '
      let nextPref = pref + '│   '
      let nextPrefLastChild = pref + '&nbsp;&nbsp;&nbsp; '
      let children = dirTree.children
      children.forEach((c, i) => {
          let suffix = ""
          let classList = "data-dir-tree"
          let curFullPath = (parentHist) ? parentHist + "/" + c.name: c.name;
          if(c.children.length > 0) suffix = "/"
          if(c.children.length == 0  && curFullPath === activePath){
              classList = "data-dir-tree data-dir-tree-selected"
          }
          if(i === children.length - 1){
              callback(c.name + suffix , curPrefLastChild, classList)
          }
          else{
              callback(c.name + suffix , curPref, classList)
          }
        
          if(c.children.length > 0 && i === children.length -1){
              generateDirTree(c, nextPrefLastChild, activePath, curFullPath, callback)
          }
          else if(c.children.length > 0){
              generateDirTree(c, nextPref, activePath, curFullPath, callback)
          }
      });
  }
  const applyDirTreeToHtml = function(elmnt, dirData, activePath){
    var dirs = dirData.split("\n")
    let htmlCont = "&nbsp;&nbsp;&nbsp;./..<br>"
    let rootDir = {name: 'root'}
    jsonize(dirs, rootDir)
    let callb = function(cname, pref, classList){
      htmlLine = pref + `<a class="${classList}">${cname}</a><br>\n`
      htmlCont = htmlCont + htmlLine
    }
    generateDirTree(rootDir, "&nbsp;&nbsp;&nbsp;", activePath, "",  callb)
    htmlCont = htmlCont + "<p></p>"
    elmnt.innerHTML = `<div>${htmlCont}</div>`
  }

  var dirTreeSections = document.querySelectorAll(".data-dir-tree");
  for (var i = 0; i < dirTreeSections.length; i++ ){
    let activePath = ""
    let dirsFilePath = dirTreeSections[i].getAttribute("data-dir-tree-path")
    if(dirTreeSections[i].hasAttribute("data-dir-tree-active-path")){
      activePath = dirTreeSections[i].getAttribute("data-dir-tree-active-path")
    }
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      if (xhr.readyState === 4) {
        applyDirTreeToHtml(dirTreeSections[i], xhr.responseText, activePath);
      }
      else {
        console.warn( 'Failed to read ' + dirsFilePath +". ReadyState: " + xhr.readyState + ", Status: " + xhr.status);
      }
    };
    xhr.open( 'GET', dirsFilePath, false );
    try {
      xhr.send();
    }
    catch ( error ) {
      console.warn(error );
    }
  }
}