# pdfPreview
a pdf to image solution based on pdf.js
## intro
In this project, a simple packaging of pdf.js was done to make it easier to convert PDF pages to image type. With the help of native API of canvas , we can easily get base64 code of page rendered by pdf.js. More work should be done to get png or jpg files from the base64 code.
To get the image of the page, an invisible canvas was created in the DOM, after one page rendered, the canvas was captured in base64 image format.
## usage
```javascript
// only support url and native file object now
PDFPreview.openFile(file, function (preview) {
    //do thing here
    //the preview instance has several methods
    //as the following
    var _preview_num = preview.getPageNum();

    preview.setImgSize({
        width:1000
    });//height is auto

    preview.getPageImgInBase64(page_number, function (base64code, current_page_number) {
        //the image was formatted in base64 code, default in jpeg format
        //you got current_page_number to know which page the image is
        //...
    })

});
```
In the demo , to make it visually, a sample pdf file was converting to \<img\> tags in html. And with the help of \<a\> tag, you can download the image in browser.
## further
In our usages , we did something more, the base64 code was converted to image file in remote server, thus, we use these image files and show them as the preview of the relating pdf file.
