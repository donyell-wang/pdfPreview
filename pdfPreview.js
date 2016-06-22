/**
* Created by wangdy on 2016/6/13
*/
PDFPreview = function () {

    var DocPreview = function (_instance) {
        this.pdf_doc = _instance;
        this.rendering = false;
        this.pending_quene = [];
        this.id = Math.ceil(Math.random()*100000);
        this.imgWidth = 1000;
        this.imgHeight = 'auto';
    }

    DocPreview.prototype = {
        setImgSize: function (obj) {
            if(obj.width !== undefined){
                this.imgWidth = obj.width;
            }
            if(obj.height !== undefined){
                this.imgHeight = obj.height;
            }
        },
        getPageNum : function () {
            if(!this.pdf_doc){
                _e_output('no file initialized');
                return;
            }
            return this.pdf_doc.numPages;
        },
        getPageImgInBase64 : function (idx, callback) {
            if(!this.pdf_doc){
                _e_output('no file initialized');
            }else{
                if(this.rendering){
                    this.pending_quene.push({
                        _idx:idx,
                        _callback:callback
                    });
                }else{
                    this._renderPage(idx, callback);
                }
            }
        },
        _renderPage : function (_idx, _callback){
            var _obj = this;

            //idx should in the range of pagenums
            if(_idx >  this.pdf_doc.numPages){
                _e_output('out of page range');
                return;
            }

            //1.create a invisible canvas
            var canvas = document.getElementById('canvas_'+ this.id);
            if(!canvas){
                canvas=document.createElement("canvas");
                canvas.id = 'canvas_'+ this.id;
                canvas.style.display = "none";
                var body = document.getElementsByTagName("body")[0];
                body.appendChild(canvas);
            }

            //2.draw pdf in canvas
            this.rendering = true;
            this.pdf_doc.getPage(_idx).then(function(page) {
                var desiredWidth = 1000;
                var viewport = page.getViewport(1);
                var scale = desiredWidth / viewport.width;
                var scaledViewport = page.getViewport(scale);
                var context = canvas.getContext('2d');

                canvas.height = scaledViewport.height;
                canvas.width = scaledViewport.width;

                var renderContext = {
                    canvasContext: context,
                    viewport: scaledViewport
                };

                //3.convert canvas to img
                var renderTask = page.render(renderContext);

                // Wait for rendering to finish
                renderTask.promise.then(function () {
                    _obj.rendering = false;
                    _callback(canvas.toDataURL("image/jpeg"), _idx);
                    if(_obj.pending_quene.length>0){
                        var _temp_obj = _obj.pending_quene.shift();
                        _obj._renderPage(_temp_obj._idx, _temp_obj._callback);
                    }
                });
            });
        }
    };

    function _e_ouput (str) {
        if(console && console.log){
            console.log('error:'+ str);
        }
    }

    function initFile(file, callback){
        var _file_url, _file_obj;

        function setFile(file){
            if(typeof file == "string"){
                _file_url = file;
            }else{
                //file要求是原生file对象
                _file_obj = file;
            }
        };

        function load(callback){
            var _url;

            if(_file_url){
                _url = _file_url;
            }else if (_file_obj) {
                if (typeof URL !== 'undefined' && URL.createObjectURL) {
                    // get the Url of file object
                    _url = URL.createObjectURL(_file_obj);
                }else{
                    // Read the local file into a Uint8Array.
                    // var fileReader = new FileReader();
                    // fileReader.onload = function fileReaderOnload(evt) {
                    //     var buffer = evt.target.result;
                    //     var uint8Array = new Uint8Array(buffer);
                    //     PDFViewerApplication.open(uint8Array);
                    // };
                    // fileReader.readAsArrayBuffer(_file_obj);
                }
            }else{
                _e_output('');
                return;
            }

            PDFJS.getDocument(_url).then(function (_doc) {
                var _Preview = new DocPreview(_doc);
                callback(_Preview);
            });
        };

        if (!PDFJS || !PDFJS.getDocument) {
            _e_output('PDFJS lib not loaded');
            return;
        }

        setFile(file);
        load(callback);
    };

    return {
        openFile:initFile
    };
}();
