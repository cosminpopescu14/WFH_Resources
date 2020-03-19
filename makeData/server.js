"use strict";
console.log(`start print`);
class data {
  constructor(){
    
    this.tags='';
    this.category='';
    this.subCategory='';
    this.name='';
    this.links=[];
    this.dateCreated=new Date();

  }
  
  get id() {
    return this.name.toUpperCase() + '_' + this.subCategory.toUpperCase() +'_'+ this.category.toUpperCase();
  }

  
  // id: number;
  // tags: string;
  // category: string;
  // subCategory: string;
  // name: string;
  // description: string;
  // link: string;
}

//make json
(async () => {
  try
   {
    await main();
    console.log("done");
  } 
  catch (e) 
  {
    console.log("Error" + JSON.stringify(e));
  }
})();
function getId(v){
  return v.replace(/\s+/g, '-').toLowerCase();
}
function lineToBRAndLinks(str){
  var content = "<ol>";
  var lines= str.replace(/(?:\r\n|\r|\n)/g, '<br/>').split("<br/>");
  for(let line of lines){
    content +="<li>" +line.link(line).replace(/<a/g,"<a target='_blank'") +"</li><br/>";
  }
  content+="</ol>";
  return content;
 }
async function main() {
  const marked = require('marked');
  const path = require("path");
  const fs = require("fs");
  const { promisify } = require("util");
  const rra = require("recursive-readdir-async");
  var folders = ["Country","Entertainment","FreeSoftware", "Kids","Learn","MapsAndData"];
  let iContent=1;
  let contentTable='<table id="tbData"  class="display" style="width:90%">';
  contentTable +=" <thead>";
  contentTable+= '<tr> <th>Nr</th> <th> Category  </th><th>SubCategory  </th><th>Name</th><th>Links</th> </tr>';
  contentTable +="/<thead>";
  contentTable +=" <tbody>";
  contentTable+= "\r\n";
  let content ='';
  var arrData=[];
  //const declarations = fs.readFileSync(path.join(__dirname + "/..", "makeData","headerIncludes.md"), 'utf8');
  //const declarations ='';
  const readMe = fs.readFileSync(path.join(__dirname + "/..", "README.md"), 'utf8');

  for (let folder of folders) {
    const directoryPath = path.join(__dirname + "/..", folder);
    const list = await rra.list(directoryPath);
    content +="\r\n";
    content += `# ${folder}`;
    for(let f of list){
        const nameNoExtension=path.parse(f.name).name;
        //  if(nameNoExtension.indexOf("omania")<0)
        //    continue;
        content +="\r\n";
        content +=`# ${nameNoExtension}`;
        content +="\r\n";
        //console.log(f);
        var fileContents= fs.readFileSync(f.fullname, 'utf8');
        content+=fileContents;
        content +="\r\n";
        content +="\r\n";

        content +=`<a href="https://github.com/ignatandrei/WFH_Resources/edit/master/${folder}/${f.name}">Improve this</a>`;

        const tokens = marked.lexer(fileContents);
        
        for(let iToken=0;iToken<tokens.length;iToken++){
          var links = '';
          let token=tokens[iToken];
          if(token.type != 'heading')
            continue;
          
          
          if(token.depth !=2)
            continue;
          
          var findLinks=iToken;
          while(findLinks<tokens.length-2){
            findLinks++;

            const tLinks = tokens[findLinks];
            if('depth' in tLinks){
              if(tLinks.depth ==3){
                if(tLinks.text.indexOf("inks")>0){
                  links=tokens[findLinks+1].text;
                  break;
                }
              }
            }
            
          }
          //console.log("LINKS"+ links);
          contentTable +="\r\n";
          var newData= new data();
          //newData.id=iContent;
          newData.category=folder;
          newData.subCategory=nameNoExtension;
          newData.name=token.text;
          newData.links=links.split(/(?:\r\n|\r|\n)/g);
          arrData.push(newData);
          //contentTable +=`<tr><td>${iContent++}</td><td> <a href="#${getId(folder)}">${folder}</a> </td><td><a href="#${getId(nameNoExtension)}">${nameNoExtension}</a> (<a href="https://github.com/ignatandrei/WFH_Resources/edit/master/${folder}/${f.name}">Improve this</a>) </td><td><a href="#${getId(token.text)}"> ${token.text}</a></td><td>${lineToBRAndLinks(links)}</td> </tr>`;
          contentTable +=`<tr><td>${iContent++}</td><td> ${folder} </td><td>${nameNoExtension} (<a href="https://github.com/ignatandrei/WFH_Resources/edit/master/${folder}/${f.name}">Improve this</a>) </td><td> ${token.text}</td><td>${lineToBRAndLinks(links)}</td> </tr>`;
              
        }
        
        if(links.length == 0){
          var str=`no links for ${nameNoExtension}  `;
          console.log(str);
          //throw  str;
        }
        
    }
    // console.log(contentTable);
    
  }
  contentTable +="</tbody>";

  contentTable+='</table>';

  
   const directoryPathWrite = path.join(__dirname + "/..", "obj","all.md");
   //content = contentTable +"\r\n"+ content + "\r\n"+ readMe ; 
   content = contentTable +"\r\n"+  readMe ; 
    // var script=`
    // <script src="https://code.jquery.com/jquery-3.3.1.js"></script>
    // <script src="https://cdn.datatables.net/1.10.20/js/jquery.dataTables.js"></script>
    // <script>
    // $(document).ready( function () {
    //   window.alert('tst');
    //   $('#tbData').DataTable(
    //     {
    //       paging: false
    //     }
    //   );
    //   } );</script>`;
   
   //content+=script;
   fs.writeFileSync(directoryPathWrite,content);
   var js=(JSON.stringify(arrData, null, '\t').replace(/\"([^(\")"]+)\":/g,"$1:"));
   const directoryJS = path.join(__dirname + "/..", "obj","all.js");
   fs.writeFileSync(directoryJS,js);
   
   
}
//   var folders = ["FreeSoftware", "Country"];
//   for(let folder in folders) {
//     console.log(`processing ${folder}`);
//     const directoryPath = path.join(__dirname + "/..", folder);
//     const list = await rra.list(directoryPath);
//     console.log(list);
// fs.readdir(directoryPath, function(err, files) {
//   //handling error
//   if (err) {
//     return console.log("Unable to scan directory: " + err);
//   }
//   //listing all files using forEach
//   files.forEach(function(file) {
//     // Do whatever you want to do with the file
//     console.log(folder + file);
//   });
// });
//   });
// }
