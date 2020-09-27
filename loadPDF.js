 class pdfViewer {
      currPage;numPages = 0;thePDF = null;pdfCanvas;pdfUrl;pdfcontainer;pdfjsLib;
      pdfjsurl = 'https://unpkg.com/pdfjs-dist@2.5.207/build/pdf.min.js';
      pdfworkerurl = 'https://unpkg.com/pdfjs-dist@2.5.207/build/pdf.worker.min.js';
      constructor(pdfUrl, pdfcontainer){
          this.pdfUrl = pdfUrl;
          this.pdfcontainer = pdfcontainer;
      }
      async loadScript(url) {
          if(this.pdfjsLib) return; 
          let response = await fetch(url);
          let script = await response.text();
          eval(script);
      }
      loadPdf(){
          this.loadScript(this.pdfjsurl).then(() => {
              this.currPage = 1;
              this.pdfCanvas = document.createElement("div");
              this.pdfjsLib.GlobalWorkerOptions.workerSrc = this.pdfworkerurl;
              this.pdfjsLib.getDocument(this.pdfUrl).promise.then((pdf) => {
                  this.thePDF = pdf;
                  this.numPages = pdf.numPages;
                  pdf.getPage(this.currPage).then((page) => {this.handlePages(page)});
              });
          });
      }
      handlePages(page) {
          let viewport = page.getViewport({ scale: 1});
          let canvas = document.createElement("canvas");
          canvas.style.display = "block";
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          let context = canvas.getContext("2d");
          let renderContext = {
              canvasContext: context,
              viewport: viewport
          };
          page.render(renderContext).promise.then(() => {
            this.pdfCanvas.appendChild(canvas);
            this.currPage++;
            if (this.thePDF !== null && this.currPage <= this.numPages)
              this.thePDF.getPage(this.currPage).then((page) => {this.handlePages(page)});
            else
              document.getElementById(this.pdfcontainer).appendChild(this.pdfCanvas);
          });
      }
  }
