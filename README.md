# pdfPreview
a pdf to image solution based on pdf.js
## intro
In this project, a simple packaging of pdf.js was done to make it easier to convert PDF pages to image type. With the help of native API of canvas , we can easily get base64 code of page rendered by pdf.js. More work should be done to get png or jpg files from the base64 code.
## usage
In the demo , to make it visually, a sample pdf file was converting to <img> tags in html. In our usages , we did something more, the base64 code was converted to image file in remote server, thus, we use these image files and show them as the preview of the relating pdf file.
