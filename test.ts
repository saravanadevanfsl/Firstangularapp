 UpdateDataparts() {
    this._interactionService.SendMessageToC({ Key: 'infobar', Value: 'Refreshing...' })
    let UpdatedDP = '';
    let setheaders = new HttpHeaders();
    setheaders = setheaders.set('ObjectId', this.ObjectID).set('VisitId', this.VisitID).set('BodyHdr', 'true').set('RType', 'HTTP');
    this.httpClient.post(this.WorkflowConfig.ServiceURL + '/UpdateDataParts', '<DPs><DP Nm="XCaseDocs"></DP><DP Nm="$PATSCR"></DP></DPs>', { headers: setheaders, observe: 'body' }).subscribe((res: any) => {
      for (var pair of res.headers.entries()) {
        if (res.headers.length == 1) {
          this._interactionService.SendMessageToC({ Key: 'infobar', Value: '' })
        }
        if (pair[1].key == 'UpdatedDP') {
          UpdatedDP = pair[1].value[0];
          let tDataparts: string;
          let dpcollection = '', dpdata = '';
          tDataparts = pair[1].value[0];
          tDataparts = tDataparts.split("&lt;").join("<").split("&gt;").join(">").split("&amp;lt;").join("<").split("&amp;gt;").join(">");
          let parser = new DOMParser();
          const xmlDom = parser.parseFromString(tDataparts, 'application/xml');
          xmlDom.querySelectorAll('[Nm=XCaseDocs]').forEach((function (EL) {
            if (typeof EL.outerHTML !== 'undefined') {
              dpcollection = dpcollection + EL.innerHTML;
            }
          }))
          if (dpcollection !== '') {
            dpdata = '<A>' + dpcollection + '</A>'
            this._interactionService.SendMessageToC({ Key: 'UpdateDocument', Value: dpdata });
          }

          dpcollection = '';
          dpdata = '';
          xmlDom.querySelectorAll('[Nm="$PATSCR"]').forEach((function (EL) {
            if (typeof EL.outerHTML !== 'undefined') {
              dpcollection = dpcollection + EL.innerHTML;
            }
          }))
          dpdata = dpcollection;
          /* dpdata = '<A>' + dpcollection + '</A>' */
          this._interactionService.SendMessageToC({ Key: 'UpdateReview', Value: dpdata });

        }

      }
    }
    );

  }