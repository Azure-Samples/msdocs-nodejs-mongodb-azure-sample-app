// Description: This file contains the code for the editor
import { CMS } from '../cms/cms.js'
import { Collection } from '../collection/collection.js'

let currentDocument = {}

async function init() {
  let cms = new CMS();
  await cms.initComponents()//.then(() => console.log('cms ready') )
  // const cmsDocuments = new Collection('cms')
  // cmsDocuments.getNames().then(data => {
  //   let dd = cms.page.componentObject.documents

  cms.page.componentObject.documents.callback =  (key, value) => {
      currentDocument = new Collection('cms')
      currentDocument.getByName(value).then((data) => {
        // console.log(data)
        editor.set(data)
      })
    }

}


// create the editor
//https://npm.runkit.com/jsoneditor
const container = document.getElementById("jsoneditor")
const options = {}
const editor = new JSONEditor(container, options)

//on click of save button get the json from the editor and
// update the collection
document.getElementById('save').addEventListener('click', () => {
  let json = editor.get()
  currentDocument.update(json)
})

init().then(() => console.log('init done'))
