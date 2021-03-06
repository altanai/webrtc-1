/*
 *  Copyright (c) 2014 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* More information about these options at jshint.com/docs/options */
/* jshint browser: true, camelcase: true, curly: true, devel: true, eqeqeq: true, forin: false, globalstrict: true, quotmark: single, undef: true, unused: strict */

'use strict';

function WebRTCCall(config) {
  this.pc1 = new RTCPeerConnection(config);
  this.pc2 = new RTCPeerConnection(config);

  this.pc1.addEventListener('icecandidate', this.onIceCandidate_.bind(this, this.pc2));
  this.pc2.addEventListener('icecandidate', this.onIceCandidate_.bind(this, this.pc1));
}

WebRTCCall.prototype = {
  establishConnection: function () {
    this.pc1.createOffer(this.gotOffer_.bind(this));
  },

  close: function () {
    this.pc1.close();
    this.pc2.close();
  },

  isGoodCandidate: function () { return true; },

  gotOffer_: function (offer) {
    this.pc1.setLocalDescription(offer);
    this.pc2.setRemoteDescription(offer);
    this.pc2.createAnswer(this.gotAnswer_.bind(this));
  },

  gotAnswer_: function (answer) {
    this.pc2.setLocalDescription(answer);
    this.pc1.setRemoteDescription(answer);
  },
  
  onIceCandidate_: function (otherPeer) {
    if (event.candidate) {
      var parsed = parseCandidate(event.candidate.candidate);
      if (this.isGoodCandidate(parsed)) {
        otherPeer.addIceCandidate(event.candidate);
      }
    }
  }
}
